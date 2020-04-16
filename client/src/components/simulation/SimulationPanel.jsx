import React, { useState } from "react";

const SimulationPanel = (props) => {
  let sickPop = props.agents.filter((e) => e.isSick).length;
  let immunePop = props.agents.filter((e) => e.isImmunized).length;

  const [masksOn, setMasksOn] = useState(false);

  const calculateMax = () => {
    return 0;
  };

  return (
    <div className="panel-container">
      <div className="card stats">
        <div className="rowFlex">
          <div>
            <h2>Jour de la simulation</h2>
            <p className="number">{props.currentDay}</p>
          </div>
          <div>
            <h2>Densité d'habitants</h2>
            <p className="number">
              {(props.popDensity * 1000 * 1000).toFixed(2)} hab/m2
            </p>
          </div>
        </div>
        <div className="rowFlex">
          <div>
            <h2>Population malade</h2>
            <p className="number">Actuel : {sickPop}</p>
            <p className="number">Max : {0}</p>
          </div>
          <div>
            <h2>Population Immunisées</h2>
            <p className="number">{immunePop}</p>
          </div>
        </div>
      </div>
      <div className="card actions">
        <h2>Mesures</h2>
        <button
          className={masksOn ? "selected" : ""}
          onClick={() => {
            props.sendActions(masksOn ? "masksOff" : "masksOn");
            setMasksOn(!masksOn);
          }}
        >
          Masques obligatoires
        </button>
      </div>
    </div>
  );
};

export default SimulationPanel;
