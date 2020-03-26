import React from 'react';

import './countryItem.css';

function CountryItem(props) {
    return (
        <div className='country-item-body'>
            <div>
                <div className='pill' />
                {props.country}
            </div>
            <button>X</button>
        </div>
    );
}

export default CountryItem;
