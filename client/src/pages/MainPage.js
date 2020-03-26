import React from 'react';

import CountryPanel from '../components/countryPanel/CountryPanel.js';

import './mainPage.css'

function MainPage() {
    return (
        <div className='main-page-body'>
            <div className="main-page-section">
                <div className='left-part'>
                    <h1>Nombre de décès au COVID-19 (date relative)</h1>
                    <p>Cette courbe permet de simuler une situation où tous les pays ont été contaminés en même temps. Elle permet de comparer l’évolution du virus, en ignorant les décalages de contamination ??
L’axe des dates correspond donc à des dates relatives (x jours après le 10e décès).</p>
                </div>
            </div>
            <div className="main-page-section">
                <div className="left-part">
                    <div className="card" style={{ height: "600px", marginBottom: "20px" }}>
                        ICI la courbe
                    </div>
                    <div className="card chart-settings-section">
                        <div>
                            Afficher
                            <button>Décès</button>
                            <button>Guérisons</button>
                        </div>
                        <div>
                            Temps
                            <button>Relatif</button>
                            <button>Normal</button>
                        </div>
                    </div>
                </div>
                <div className="right-part">
                    <CountryPanel />
                </div>
            </div>
            <div className="main-page-section">
                <div className="left-part">

                </div>
                <div className="right-part">
                </div>
            </div>
        </div>
    );
}

export default MainPage;
