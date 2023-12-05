import React from 'react';
import { useParams } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import LocL from './cmnLocL';

const CmnLocW = () => {
    const { loctpId: routeLocTpId } = useParams();
    const loctpId = routeLocTpId;
    const location = useLocation();
    const key = location.pathname;

    return <LocL key={key} loctpId={loctpId} />;
};

export default CmnLocW;
