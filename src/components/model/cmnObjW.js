import React from 'react';
import { useParams } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import ObjL from './cmnObjL';

const CmnLocW = () => {
    const { objtpCode: routeObjTpCode } = useParams();
    const objtpCode = routeObjTpCode;
    const location = useLocation();
    const key = location.pathname;
console.log(objtpCode, "###########################CmnLocW################################", key)
    return <ObjL
        key={key}
        objtpCode={objtpCode}
    />;
};

export default CmnLocW;
