import React from "react";
import ImageUploading from "react-images-uploading";
import { Button, Paper, Grid } from "@material-ui/core";

export default function UploadImage({ setData }) {
  const [images, setImages] = React.useState([]);
  const maxNumber = 69;

  const onChange = (imageList, addUpdateIndex) => {
    setImages(imageList);
    if (imageList.length !== 0) {
      setData(imageList[0].data_url);
    } else {
      setData(undefined);
    }
  };

  return (
    <ImageUploading
      value={images}
      onChange={onChange}
      maxNumber={maxNumber}
      dataURLKey="data_url"
    >
      {({
        imageList,
        onImageUpload,
        onImageRemoveAll,
        onImageUpdate,
        onImageRemove,
        isDragging,
        dragProps,
      }) => (
        // write your building UI
        <Grid container style={{ margin: "12px", justifyContent: "center" }}>
          <Grid item md={12} spacing={4}>
            <Button
              variant="contained"
              color="primary"
              style={isDragging ? { color: "red" } : undefined}
              onClick={onImageUpload}
              {...dragProps}
            >
              Upload image
            </Button>
          </Grid>
          {/* <Grid item md={12} style={{ margin: "12px" }}>
              {imageList.map((image, index) => (
                <Paper
                  elevation={3}
                  key={index}
                  style={{
                    display: "inline-block",
                    padding: "12px",
                    margin: "12px",
                  }}
                >
                  <img
                    id="image-1"
                    src={image["data_url"]}
                    alt=""
                    width="200"
                  />
                  <div>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => onImageUpdate(index)}
                      style={{ marginRight: "8px" }}
                    >
                      Update
                    </Button>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => onImageRemove(index)}
                    >
                      Remove
                    </Button>
                  </div>
                </Paper>
              ))}
            </Grid> */}
        </Grid>
      )}
    </ImageUploading>
  );
}
