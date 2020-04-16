import React, { useEffect, useState, useRef } from "react";
import ReactHighcharts from "react-highcharts";
import Highcharts from "highcharts";
import "./simulationPage.scss";
import SimulationPanel from "../components/simulation/SimulationPanel";

// Setting up general parameters
var c;
var chart;
const defaultFps = 60; // default value for the animation framerate
const fps = 30; // How many fps in the simulation ?
const fpsFactor = defaultFps / fps;
var canvas = {
  x: 800,
  y: 800,
};
const radius = 3; // Size of an agent
const popSize = 500;

// Setting the space in the simulation
var oneMeterInTheSimulation = 2 * radius; // how many pixels in the simulation are 1 m. 1 agent = 1 m²
canvas.realX = canvas.x / oneMeterInTheSimulation; // Real width of the canvas in meter
canvas.realY = canvas.y / oneMeterInTheSimulation; // Real height of the canvas in meter
canvas.realSurface = canvas.realX * canvas.realY; // Real surface of the canvas in meter²
var popDensity = popSize / canvas.realSurface; // en hab /m² Paris is 21000 hab / km²

// Setting the time in the simulation
var currentFrame = 0;
const oneDayInTheSimulation = 1; // how long in sec does a day in the simulation last ?
const simDay = oneDayInTheSimulation * defaultFps; // How many frames is a day in the simulation ?

// Baics of the simulation
var agents = [];
var contagionRadius = 8;
var initialSickPercentage = 0.01;
var walkingSpeed = 1.4 * oneMeterInTheSimulation; // 1,2 m/s * equivalent en pixel

// Setting up scientific values linked to Covid
const timeToHeal = 12 * simDay; // 12 days to heal by itself
const timeToSymptoms = 5 * simDay; // Incubation time
var gettingSickProba = 0.5 / contagionRadius; // If the contagionRadius increases, then the time spent in the radius increases, not wanted

// React component
const SimulationPage = () => {
  const myCanvas = useRef(null);

  const [transmissionProba, setTransmissionProba] = useState(0.1);
  const [agentSpeed, setAgentSpeed] = useState(5);
  const [numberOfAgents, setNumberOfAgents] = useState(popSize);
  const [currentSickPop, setCurrentSickPop] = useState(0);
  const [currentImmunizedPop, setCurrentImmunizedPop] = useState(0);
  const [currentRFactor, setCurrentRFactor] = useState(0);
  const [currentDay, setCurrentDay] = useState(0);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    initCanvas();
    initChart();
    createTheAgents();
    animate();
  }, []);

  const initCanvas = () => {
    const theCanvas = myCanvas.current;
    c = theCanvas.getContext("2d");
  };

  // Init the chart
  const initChart = () => {
    chart = document.getElementById("chart-container");
    Highcharts.chart("chart-container", {
      title: {
        text: "Evolution de l'épidémie",
      },
      chart: {
        height: 200,
        width: canvas.y,
        type: "area",
        events: {
          load: function () {
            // set up the updating of the chart each second
            var series = this.series[0];
            setInterval(function () {
              var y = agents.filter((e) => e.isSick).length;
              var x = currentFrame;
              series.addPoint([x, y], true, false);
            }, 250);
          },
        },
      },
      accessibility: {
        announceNewData: {
          enabled: true,
          minAnnounceInterval: 15000,
          announcementFormatter: function (allSeries, newSeries, newPoint) {
            if (newPoint) {
              return "New point added. Value: " + newPoint.y;
            }
            return false;
          },
        },
      },
      xAxis: {
        allowDecimals: false,
        labels: {
          formatter: function () {
            return this.value; // clean, unformatted number for year
          },
        },
      },
      yAxis: {
        labels: {
          formatter: function () {
            return this.value;
          },
        },
      },
      // tooltip: {
      //   pointFormat:
      //     "{series.name} produced <b>{point.y:,.0f}</b><br/>warheads in {point.x}",
      // },
      plotOptions: {
        area: {
          pointStart: 0,
          marker: {
            enabled: false,
            symbol: "circle",
            radius: 1,
            states: {
              hover: {
                enabled: true,
              },
            },
          },
        },
      },
      series: [
        {
          name: "Population malade",
          data: [],
        },
      ],
    });
  };

  // Create the agents
  const createTheAgents = () => {
    const speedModulator = 0.3;
    for (let i = 0; i < numberOfAgents; i++) {
      // Starting Position
      var x = Math.random() * (canvas.x - radius * 2) + radius;
      var y = Math.random() * (canvas.y - radius * 2) + radius;

      // Speed in x and y direction
      var dx = (Math.random() - 0.5) * fpsFactor * speedModulator;
      var dy = (Math.random() - 0.5) * fpsFactor * speedModulator;

      // Initial condition
      var isSick = Math.random() < initialSickPercentage ? true : false;

      agents.push(new Agent(x, y, dx, dy, isSick));
    }
  };

  // Animate the canvas
  const animate = () => {
    currentFrame++;
    // Move each agent
    if (currentFrame % (defaultFps / fps) === 0) {
      c.clearRect(0, 0, canvas.x, canvas.y);
      for (let i = 0; i < numberOfAgents; i++) {
        agents[i].update();
      }
    }
    setCurrentSickPop(agents.filter((e) => e.isSick).length);
    setCurrentImmunizedPop(agents.filter((e) => e.isImmunized).length);
    setCurrentDay((currentFrame / simDay).toFixed(0));

    if (currentFrame % 60 === 0) {
      // console.log("updating chart");
    }

    requestAnimationFrame(animate);
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
    this.awareOn = 0;
    this.sickOn = 0;
    this.healedOn = 0;
    this.isImmunized = false;
    this.isDead = false;
    this.R = 0; // how many agents I contamined

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
        if (Math.random() < gettingSickProba) {
          item.isSick = true;
          this.R++;
        }
        item.sickOn = currentFrame;
      });
    };

    this.live = function () {
      if (this.isSick) {
        this.spreadTheInfection();
        if (
          currentFrame >
          this.sickOn + timeToSymptoms + (Math.random() - 0.5) * 2 * 2 * simDay
        ) {
          this.isAwareThatSick = true;
          this.awareOn = currentFrame;
        }
        if (
          currentFrame >
          this.sickOn + timeToHeal + (Math.random() - 0.5) * 2 * 3 * simDay
        ) {
          this.heal();
          this.healedOn = currentFrame;
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
      if (this.isSick) {
        c.fillStyle = "red";
      }
      if (this.isAwareThatSick) {
        c.fillStyle = "blue";
      }
      if (this.isImmunized) {
        c.fillStyle = "yellow";
      }
      c.fill();
    };

    // Make them move !
    this.update = function () {
      if (this.x + this.radius > canvas.x || this.x - this.radius < 0) {
        this.dx = -this.dx;
      }

      if (this.y + this.radius > canvas.y || this.y - this.radius < 0) {
        this.dy = -this.dy;
      }
      this.x += this.dx;
      this.y += this.dy;

      this.draw();

      this.live();
    };
  }

  const debug = () => {
    // console.log(agents);
    var r0 = agents.map((item) => item.R);
    let avg =
      r0.reduce((previous, current) => (current += previous)) / r0.length;
    console.log(avg);
  };

  const recieveActions = (type) => {
    switch (type) {
      case "masksOn":
        console.log("masksOn");
        contagionRadius = 4;
        gettingSickProba = gettingSickProba / 2;
        break;
      case "masksOff":
        console.log("masksOff");
        contagionRadius = 8;
        gettingSickProba = gettingSickProba * 2;
        break;
      default:
        break;
    }
  };

  return (
    <div className="main-page-body simulation-page">
      <div className="simulation-section">
        <div id="chart-container" />
        {/* <div>{popDensity * 1000 * 1000} hab/m2</div> */}
        <canvas ref={myCanvas} id="canvas" width={canvas.x} height={canvas.y} />
      </div>
      {/* <button onClick={debug}>DEBUG</button> */}
      <SimulationPanel
        agents={agents}
        popSize={popSize}
        currentDay={currentDay}
        popDensity={popDensity}
        sendActions={recieveActions}
      />
    </div>
  );
};

export default SimulationPage;
