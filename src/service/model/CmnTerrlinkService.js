import axios from 'axios';
import env from "../../configs/env"
import Token from "../../utilities/Token";

export class CmnTerrlinkService {

    async getLista(objId) {
        const selectedLanguage = localStorage.getItem('sl') || 'en'
        const url = `${env.CMN_BACK_URL}/cmn/terrlink/_v/lista/?stm=cmn_terrlink_v&objid=${objId}&sl=${selectedLanguage}`;
        const tokenLocal = await Token.getTokensLS();
        const headers = {
          Authorization: tokenLocal.token
        };
    
        try {
          const response = await axios.get(url, { headers });
          return response.data.item;
        } catch (error) {
          console.error(error);
          throw error;
        }
      }

    async getCmnTerrlinks() {
        const selectedLanguage = localStorage.getItem('sl') || 'en'
        const url = `${env.CMN_BACK_URL}/cmn/terrlink/?sl=${selectedLanguage}`;
        const tokenLocal = await Token.getTokensLS();
        const headers = {
            Authorization: tokenLocal.token
        };

        try {
            const response = await axios.get(url, { headers });
            return response.data.items;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async getCmnTerrlink(objId) {
        const selectedLanguage = localStorage.getItem('sl') || 'en'
        const url = `${env.CMN_BACK_URL}/cmn/terrlink/${objId}/?sl=${selectedLanguage}`;
        const tokenLocal = await Token.getTokensLS();
        const headers = {
            Authorization: tokenLocal.token
        };

        try {
            const response = await axios.get(url, { headers });
            return response.data.items;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }


    async postCmnTerrlink(newObj) {
        try {
            
            const selectedLanguage = localStorage.getItem('sl') || 'en'
            if (newObj.action === null || newObj.roll === null) {
                throw new Error(
                    "Items must be filled!"
                );
            }
            const url = `${env.CMN_BACK_URL}/cmn/terrlink/?sl=${selectedLanguage}`;

            const tokenLocal = await Token.getTokensLS();
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': tokenLocal.token
            };
            const jsonObj = JSON.stringify(newObj)
            const response = await axios.post(url, jsonObj, { headers });
            return response.data.items;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async putCmnTerrlink(newObj) {
        try {
            const selectedLanguage = localStorage.getItem('sl') || 'en'
            if (newObj.action === null || newObj.roll === null)  {
                throw new Error(
                    "Items must be filled!"
                );
            }
            const url = `${env.CMN_BACK_URL}/cmn/terrlink/?sl=${selectedLanguage}`;
            const tokenLocal = await Token.getTokensLS();
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': tokenLocal.token
            };
            const jsonObj = JSON.stringify(newObj)
            const response = await axios.put(url, jsonObj, { headers });
            //console.log("**************"  , response, "****************")
            return response.data.items;
        } catch (error) {
            console.error(error);
            throw error;
        }

    }

    async deleteCmnTerrlink(newObj) {
        try {
            const url = `${env.CMN_BACK_URL}/cmn/terrlink/${newObj.id}`;
            const tokenLocal = await Token.getTokensLS();
            const headers = {
                'Authorization': tokenLocal.token
            };

            const response = await axios.delete(url, { headers });
            return response.data.items;
        } catch (error) {
            throw error;
        }

    }
}

