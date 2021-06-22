import React from "react";
import { Button, Paper, Grid, Slider, Typography } from "@material-ui/core";

export default function ToMatrix({ data }) {
  const [avgColor, setAvgColor] = React.useState({ r: 0, g: 0, b: 0, a: 0 });
  const [blocksize, setBocksize] = React.useState(1);
  const [isClear, setIsClear] = React.useState(true);
  const canvasFrom = React.useRef(null);
  const canvasTo = React.useRef(null);
  const canvasTest = React.useRef(null);

  React.useEffect(() => {
    if (data) {
      console.log("render");
      clearImage();
      renderImgae(data);
    } else {
      console.log("clear");
      clearImage();
    }
  }, [data]);

  const clearImage = () => {
    var canvas = canvasFrom.current;
    var canvas2 = canvasTo.current;
    var ctx = canvas.getContext("2d");
    var ctx2 = canvas2.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx2.clearRect(0, 0, canvas2.width, canvas2.height);
    setIsClear(true);
  };

  const renderImgae = (img) => {
    var canvas = canvasFrom.current;
    var ctx = canvas.getContext("2d");
    var canvas2 = canvasTo.current;

    var myImage = new Image();
    myImage.src = img;
    myImage.onload = function() {
      var w = myImage.width,
        h = myImage.height;

      canvas.width = w;
      canvas.height = h;
      canvas2.width = w;
      canvas2.height = h;
      ctx.drawImage(myImage, 0, 0);
    };
  };

  const toMat = () => {
    // var src = data;
    // var myImage = new Image();
    // myImage.src = src;

    // var w = myImage.width,
    //   h = myImage.height;
    // w = w - (w % blocksize);
    // h = h - (h % blocksize);
    var canvas = canvasFrom.current;
    var ctx = canvas.getContext("2d");
    const w = canvas.width;
    const h = canvas.height;

    var data = ctx.getImageData(0, 0, w, h);
    console.log(data);
    // var data = ctx.getImageData(
    //   Math.ceil(w / 2 - size.w / 2),
    //   Math.ceil(h / 2 - size.h / 2),
    //   size.w,
    //   size.h
    // );
    // ctx.clearRect(0, 0, canvas.width, canvas.height);
    // ctx.putImageData(data, 0, 0);

    var canvas2 = canvasTo.current;
    var ctx2 = canvas2.getContext("2d");
    ctx2.clearRect(0, 0, canvas2.width, canvas2.height);

    getAvgBlock(
      data,
      ctx2,
      canvas2.width,
      canvas2.height,
      Math.ceil(Math.min(canvas2.height, canvas2.width) / 100) * blocksize
    );
  };
  const getAvg = (data) => {
    const avgRgba = {
      r: 0,
      g: 0,
      b: 0,
      a: 0,
    };
    const rgba = {
      r: 0,
      g: 0,
      b: 0,
      a: 0,
      count: 0,
    };
    for (let i = 0; i < data.data.length; i += 4) {
      rgba.r = rgba.r + data.data[i + 0];
      rgba.g = rgba.g + data.data[i + 1];
      rgba.b = rgba.b + data.data[i + 2];
      rgba.a = rgba.a + data.data[i + 3];
      rgba.count = rgba.count + 1;
    }
    avgRgba.r = rgba.r / rgba.count;
    avgRgba.g = rgba.g / rgba.count;
    avgRgba.b = rgba.b / rgba.count;
    avgRgba.a = rgba.a / rgba.count;
    return avgRgba;
  };
  const getAvgBlock = (data, ctx, w, h, b) => {
    console.log(`w-${w} h-${h} b-${b}`);
    let result = [];
    for (let byNum = 0; byNum < Math.ceil(h / b); byNum += 1) {
      for (let bxNum = 0; bxNum < Math.ceil(w / b); bxNum += 1) {
        const pos = byNum * h * b + bxNum * b;
        let avgArr = [];
        for (let by = pos; by < pos + b * w; by += w) {
          avgArr.push(getAvg({ data: data.data.slice(by * 4, (by + b) * 4) }));
          //   console.log(data.data.slice(by * 4, (by + b) * 4));
        }
        let avg = { r: 0, g: 0, b: 0, a: 0 };
        avgArr.forEach((e) => {
          avg.r += e.r;
          avg.g += e.g;
          avg.b += e.b;
          avg.a += e.a;
        });
        avg.r = avg.r / avgArr.length;
        avg.g = avg.g / avgArr.length;
        avg.b = avg.b / avgArr.length;
        avg.a = avg.a / avgArr.length;

        ctx.fillStyle = `rgb(
            ${Math.floor(avg.r)},
            ${Math.floor(avg.g)},
            ${Math.floor(avg.b)})`;

        result.push(avg.r);
        result.push(avg.g);
        result.push(avg.b);
        result.push(avg.a);
        ctx.fillRect(bxNum * b - (w % b), byNum * b - (h % b), b, b);
      }
    }
    setIsClear(false);
  };

  const handleBlocksize = (event, newValue) => {
    setBocksize(Number(newValue));
  };
  function valText(value) {
    return `${value}px`;
  }
  const download = () => {
    const canvas = canvasTo.current;
    const url = canvas.toDataURL("image/png");
    const ctx = canvas.getContext("2d");
    const link = document.createElement("a");
    link.download = "pixelate.png";
    link.href = url;
    link.click();
  };
  return (
    <Grid container spacing={6}>
      <Grid item xs={12} sm={12} md={6} lg={6}>
        <Paper
          elevation={5}
          style={{ display: "inline-block", padding: "12px" }}
        >
          <canvas
            ref={canvasFrom}
            id="from"
            style={{ width: "100%", height: "100%" }}
          ></canvas>
        </Paper>
      </Grid>
      <Grid item xs={12} sm={12} md={6} lg={6}>
        <Paper
          elevation={5}
          style={{ display: "inline-block", padding: "12px" }}
        >
          <canvas
            ref={canvasTo}
            id="to"
            style={{ width: "100%", height: "100%" }}
          ></canvas>
        </Paper>
      </Grid>
      {/* <canvas
        ref={canvasTest}
        id="test"
        style={{ width: "100%", height: "100%" }}
      ></canvas> */}
      {/* <div
        style={{
          width: "100px",
          height: "100px",
          backgroundColor: `rgba(${avgColor.r},${avgColor.g},${avgColor.b},${avgColor.a})`,
        }}
      ></div> */}
      <Grid item xs={12} sm={12} md={12}>
        <Paper elevation={3} style={{ padding: "12px" }} color="secondary">
          <div style={{ display: "flex", flexWrap: "wrap" }}>
            <Typography id="block-size-slider" gutterBottom>
              {`Block size ${blocksize}%x${blocksize}%`}
            </Typography>
            <Slider
              defaultValue={1}
              getAriaValueText={valText}
              aria-labelledby="block-size-slider"
              valueLabelDisplay="auto"
              step={1}
              marks
              min={1}
              max={40}
              value={blocksize}
              onChange={handleBlocksize}
            />
          </div>
          <Button
            variant="contained"
            disabled={!data}
            color="primary"
            onClick={toMat}
            style={{
              marginRight: "8px",
            }}
          >
            pixelate
          </Button>
          <Button
            onClick={download}
            disabled={isClear}
            color="primary"
            variant="outlined"
          >
            Download
          </Button>
        </Paper>
      </Grid>
    </Grid>
  );
}
