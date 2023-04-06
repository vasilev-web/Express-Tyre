import React from 'react';

import MapObject from './components/MapObject';

interface MapProps {
    data?: any;
    city?: string;
    setMap?: React.Dispatch<React.SetStateAction<boolean>>;
    setCurrent?: React.Dispatch<React.SetStateAction<number>>;
    current?: number;
}

const MapOutposts = ({ data, city = 'Екатеринбург', current = null, setCurrent }: MapProps) => {
    return (
        <div className='map-outer'>
            <MapObject
                data={data}
                city={city}
                show={true}
                onCurrentValue={setCurrent}
                currentValue={current}
            />
        </div>
    );
};

export default MapOutposts;
