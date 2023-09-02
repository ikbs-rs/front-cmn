import React, { useState, useEffect} from "react";
 import { CmnObjectService } from '../../service/model/CmnObjectService'; 
 import ParEnd from './cmnPar';

const CmnObjEnd = (props) => {
    
  const [cmnObj, setCmnObj] = useState(null);
  useEffect(() => {
    
    async function fetchData() {
      
      try {
        const cmnObjectService = new CmnObjectService();
        const data = await cmnObjectService.getPar(props.objId); // Pretpostavljam da vaš servis koristi objId za dohvatanje objekta
        setCmnObj(data[0]);
      } catch (error) {
        console.error(error);
      }
    }
    fetchData();
  }, [props.objId]);

  // Renderujte vašu komponentu na osnovu dohvaćenog objekta
  return (
    <div>
        {cmnObj && <ParEnd cmnPar={cmnObj} remote={true}/>}
    </div>
  );
};

export default CmnObjEnd;
