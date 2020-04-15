import React, { useEffect, useState, useRef } from "react";
import "./simulationPage.css";

// var myCanvas;
var c;
var agents = [];
const radius = 5;
var contagionRadius = radius;
const popSize = 200;
var currentFrame = 0;
const ralenti = 2;
const timeToHeal = 400;

const SimulationPage = () => {
  const myCanvas = useRef(null);

  // Set the canvas size
  const [canvasSize, setCanvasSize] = useState({
    x: 800,
    y: 800,
  });
  const [transmissionProba, setTransmissionProba] = useState(0.1);
  const [agentSpeed, setAgentSpeed] = useState(5);
  const [numberOfAgents, setNumberOfAgents] = useState(popSize);
  const [currentSickPop, setCurrentSickPop] = useState(0);
  const [currentImmunizedPop, setCurrentImmunizedPop] = useState(0);

  useEffect(() => {
    initCanvas();
    createTheAgents();
    animate();
  }, []);

  const initCanvas = () => {
    const canvas = myCanvas.current;
    c = canvas.getContext("2d");
  };

  const createTheAgents = () => {
    for (let i = 0; i < numberOfAgents; i++) {
      // Starting Position
      var x = Math.random() * (canvasSize.x - radius * 2) + radius;
      var y = Math.random() * (canvasSize.y - radius * 2) + radius;

      // Speed in x and y direction
      var dx = (Math.random() - 0.5) * 2;
      var dy = (Math.random() - 0.5) * 2;

      // Initial condition
      var isSick = Math.random() > 0.9 ? true : false;

      agents.push(new Agent(x, y, dx, dy, isSick));
    }
  };

  // Start the animation

  // Animate the canvas
  const animate = () => {
    requestAnimationFrame(animate);
    currentFrame++;
    // Move each agent
    if (currentFrame % ralenti === 0) {
      c.clearRect(0, 0, canvasSize.x, canvasSize.y);
      for (let i = 0; i < numberOfAgents; i++) {
        agents[i].update();
      }
    }
  };

  // Agent class
  function Agent(x, y, dx, dy, isSick) {
    this.x = x;
    this.y = y;
    this.dx = agentSpeed * dx;
    this.dy = agentSpeed * dy;
    this.radius = radius;
    this.isSick = isSick;
    this.isAwareThatSick = false;
    this.sickOn = 0;
    this.isImmunized = false;
    this.isDead = false;

    // Can turn into sick if near to sick agent = Recieve the infection
    this.closeToSickAgent = function () {
      // add a proba here
      this.isSick = true;
      this.sickOn = currentFrame;
    };

    // If sick, the agent will be contagious = Give the infection
    this.spreadTheInfection = function () {
      this.closeAgents = agents.filter((agent) => {
        return (
          agent.x < this.x + 2 * contagionRadius &&
          agent.x > this.x - 2 * contagionRadius &&
          agent.y < this.y + 2 * contagionRadius &&
          agent.y > this.y - 2 * contagionRadius &&
          !agent.isImmunized &&
          !agent.isSick
        );
      });
      this.closeAgents.map((item, i) => {
        return this.closeAgents[i].closeToSickAgent();
      });
    };

    this.live = function () {
      if (this.isSick) {
        this.spreadTheInfection();
        if (
          currentFrame >
          this.sickOn +
            (1 / ralenti) * timeToHeal +
            Math.floor((Math.random() * timeToHeal) / 5)
        ) {
          this.heal();
        }
      }
    };

    this.heal = function () {
      this.isSick = false;
      this.isImmunized = true;
      //   setCurrentSickPop(currentSickPop - 1);
    };

    // Draw them
    this.draw = function () {
      c.beginPath();
      c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
      if (!this.isSick) {
        c.fillStyle = "white";
      }
      if (this.isImmunized) {
        c.fillStyle = "yellow";
      }
      if (this.isSick) {
        c.fillStyle = "red";
      }
      c.fill();
    };

    // Make them move !
    this.update = function () {
      if (this.x + this.radius > canvasSize.x || this.x - this.radius < 0) {
        this.dx = -this.dx;
      }

      if (this.y + this.radius > canvasSize.y || this.y - this.radius < 0) {
        this.dy = -this.dy;
      }
      this.x += this.dx;
      this.y += this.dy;

      this.draw();

      setCurrentSickPop(agents.filter((e) => e.isSick).length);
      setCurrentImmunizedPop(agents.filter((e) => e.isImmunized).length);

      this.live();
    };
  }

  return (
    <div className="main-page-body simulation-page">
      <div className="stats-section">
        <div>Population malade {currentSickPop}</div>
        <div>Population immunisée {currentImmunizedPop}</div>
      </div>

      <canvas
        ref={myCanvas}
        id="canvas"
        width={canvasSize.x}
        height={canvasSize.y}
      />
    </div>
  );
};

export default SimulationPage;
