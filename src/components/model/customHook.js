import { useEffect, useState } from 'react';
import axios from 'axios';
import { Token } from 'neka-biblioteka'; // Zamijenite sa stvarnim uvozom biblioteke

const useFetchObjtpData = (url, selectedLanguage, props) => {
  const [ddObjtps, setDdObjtps] = useState(null);
  const [ddObjtp, setDdObjtp] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const tokenLocal = await Token.getTokensLS();
        const headers = {
          Authorization: tokenLocal.token
        };

        const response = await axios.get(url, { headers });
        const data = response.data.items;
        const dataDD = data.map(({ textx, id }) => ({ name: textx, code: id }));
        setDdObjtps(dataDD);
        setDdObjtp(dataDD.find((item) => item.roll === props.admRollstr.roll) || null);
      } catch (error) {
        console.error(error);
        // Obrada greške ako je potrebna
      }
    };

    fetchData();
  }, [url, selectedLanguage, props.admRollstr.roll]);

  return { ddObjtps, ddObjtp };
};

export default useFetchObjtpData;
