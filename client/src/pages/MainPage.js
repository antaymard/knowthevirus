import React, { useEffect, useState } from 'react';
import axios from 'axios';

import CountryPanel from '../components/countryPanel/CountryPanel.js';
import { XYPlot, XAxis, YAxis, HorizontalGridLines, LineSeries } from 'react-vis';

import './mainPage.css'

function MainPage() {

    const [data, setData] = useState([]);

    useEffect(() => {
        axios.get('/api/')
            .then((res) => {
                setData(res.data)
            })
    }, [])

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
                        <XYPlot
                            width={600}
                            height={500}>
                            <LineSeries
                            />
                            <XAxis title="Date" />
                            <YAxis title="Nombre de décès" />
                        </XYPlot>
                    </div>
                    <div className="card chart-settings-section">
                        <div>
                            Afficher
                            <button className="mode-button">Décès</button>
                            <button className="mode-button">Guérisons</button>
                        </div>
                        <div>
                            Temps
                            <button className="mode-button">Relatif</button>
                            <button className="mode-button">Normal</button>
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
        </div >
    );
}

export default MainPage;