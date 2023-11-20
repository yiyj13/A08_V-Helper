import { useEffect } from "react";
import { useDidShow, useDidHide } from "@tarojs/taro";
// global style sheet
import "./app.css";

function App(props: any) {
  // React Hooks are supported
  useEffect(() => {});

  // corresponding to onShow
  useDidShow(() => {});

  // corresponding to onHide
  useDidHide(() => {});

  return props.children;
}

export default App;
