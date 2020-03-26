import React from 'react';

import CountryItem from '../countryItem/CountryItem.js';

import './countryPanel.css';

function CountryPanel() {
    return (
        <div className=' card country-panel-body'>
            <input />
            <div className="list-section">
                <CountryItem country="France" />
            </div>
        </div>
    );
}

export default CountryPanel;
