import React from "react";
import "./App.css";
import UploadImage from "./components/uploadImage.jsx";
import ToMatrix from "./components/toMatrix.jsx";
import { ThemeProvider, StylesProvider } from "@material-ui/core/styles";
import theme from "./theme";

function App() {
  const [data, setData] = React.useState();
  return (
    <StylesProvider injectFirst>
      <ThemeProvider theme={theme}>
        <div className="App">
          <UploadImage setData={setData} />
          <ToMatrix data={data} />
        </div>
      </ThemeProvider>
    </StylesProvider>
  );
}

export default App;
