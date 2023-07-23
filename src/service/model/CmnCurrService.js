import axios from 'axios';
import env from "../../configs/env"
import Token from "../../utilities/Token";

export class CmnCurrService {

    async getLista() {
        const selectedLanguage = localStorage.getItem('sl') || 'en'
        const url = `${env.CMN_BACK_URL}/cmn/x/curr/_v/lista/?stm=cmn_curr_v&sl=${selectedLanguage}`;
        const tokenLocal = await Token.getTokensLS();
        const headers = {
          Authorization: tokenLocal.token
        };
    
        try {
          const response = await axios.get(url, { headers });
          console.log(url, "++++++++++++++++++++", response)
          return response.data.item;
        } catch (error) {
          console.error(error);
          throw error;
        }
      }

    async getCmnCurrs() {
        const selectedLanguage = localStorage.getItem('sl') || 'en'
        const url = `${env.CMN_BACK_URL}/cmn/x/curr/?sl=${selectedLanguage}`;
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

    async getCmnCurr(objId) {
        const selectedLanguage = localStorage.getItem('sl') || 'en'
        const url = `${env.CMN_BACK_URL}/cmn/x/curr/${objId}/?sl=${selectedLanguage}`;
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


    async postCmnCurr(newObj) {
        try {
            console.log(newObj, "6666666666666666666666666666666666")
            const selectedLanguage = localStorage.getItem('sl') || 'en'
            if (newObj.action === null || newObj.roll === null) {
                throw new Error(
                    "Items must be filled!"
                );
            }
            const url = `${env.CMN_BACK_URL}/cmn/x/curr/?sl=${selectedLanguage}`;
            const tokenLocal = await Token.getTokensLS();
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': tokenLocal.token
            };
            const jsonObj = JSON.stringify(newObj)
console.log("*-*-*-*-*", url, newObj, jsonObj)
            const response = await axios.post(url, jsonObj, { headers });
            return response.data.items;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async putCmnCurr(newObj) {
        try {
            const selectedLanguage = localStorage.getItem('sl') || 'en'
            if (newObj.action === null || newObj.roll === null)  {
                throw new Error(
                    "Items must be filled!"
                );
            }
            const url = `${env.CMN_BACK_URL}/cmn/x/curr/?sl=${selectedLanguage}`;
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

    async deleteCmnCurr(newObj) {
        try {
            const url = `${env.CMN_BACK_URL}/cmn/x/curr/${newObj.id}`;
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

