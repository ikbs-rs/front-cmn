import React from 'react';
import { useParams } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import ObjL from './cmnObjL';

const CmnLocWEnd = (params) => {
    console.log(params, "*-*-*-*-*-*-*-*-*-*-*- CmnLocWEnd *-*-*-*-*-*-*-*-*-*-*-*-")
    const { objtpCode: routeObjTpCode } = useParams();
    const objtpCode = routeObjTpCode;
    const location = useLocation();
    const key = location.pathname;
    // Dohvati query parametre iz URL-a
    const objkey = `/${params.objcode}/${params.objtp}`    
console.log(objkey, "########################### CmnObjW ###",  "#############################", location)
    return <ObjL
        key={objkey}
        objtpCode={params.objtp}
    />;
};

export default CmnLocWEnd;
