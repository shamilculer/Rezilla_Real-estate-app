import { useEffect } from 'react';
import { useMap } from 'react-leaflet';

const SetMapCenter = ({ center }) => {
    const map = useMap();

    useEffect(() => {
        if (center && center[0] && center[1]) {
            map.setView(center);
        }
    }, [center, map]);

    return null;
};

export default SetMapCenter;