import React from "react";
import ReactDOM from "react-dom/client";

import App from "./screen/App";
import Timer from "./screen/Timer";

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error(`Не найден элемент #root`);
}

async function wakeLock() {
  if ("wakeLock" in navigator) {
    // @ts-ignore
    await navigator.wakeLock.request("screen");
  }
}

wakeLock();

const root = ReactDOM.createRoot(rootElement);

root.render(
  <App>
    <Timer />
  </App>
);
