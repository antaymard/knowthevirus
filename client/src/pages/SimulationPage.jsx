import React from "react";
import { useEffect } from "react";

const SimulationPage = () => {
  var canvas = document.getElementById("canvas");

  useEffect(() => {
    canvas.width = 200;
    canvas.height = 200;
  });

  return <canvas id="canvas"></canvas>;
};

export default SimulationPage;
