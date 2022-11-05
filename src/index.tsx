import React from "react";
import ReactDOM from "react-dom/client";

import App from "./screen/App";
import Timer from "./screen/Timer";

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error(`Не найден элемент #root`);
}
const root = ReactDOM.createRoot(rootElement);
root.render(
  <App>
    <Timer />
  </App>
);
