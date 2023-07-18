import axios from 'axios';
import env from "../../configs/env"
import Token from "../../utilities/Token";

export class AdmRollactService {

    async getARollActRoll(objId) {
        const selectedLanguage = localStorage.getItem('sl') || 'en'
        const url = `${env.ADM_BACK_URL}/adm/rollact/getallouter/roll/${objId}/?sl=${selectedLanguage}&outer=adm_action&outerKey=action`;
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

    async getAdmRollActs() {
        const selectedLanguage = localStorage.getItem('sl') || 'en'
        const url = `${env.ADM_BACK_URL}/adm/rollact/?sl=${selectedLanguage}`;
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

    async getAdmRollAct(objId) {
        const selectedLanguage = localStorage.getItem('sl') || 'en'
        const url = `${env.ADM_BACK_URL}/adm/rollact/${objId}/?sl=${selectedLanguage}`;
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


    async postAdmRollAct(newObj) {
        try {
            const selectedLanguage = localStorage.getItem('sl') || 'en'
            if (newObj.action === null || newObj.roll === null) {
                throw new Error(
                    "Items must be filled!"
                );
            }
            const url = `${env.ADM_BACK_URL}/adm/rollact/?sl=${selectedLanguage}`;
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

    async putAdmRollAct(newObj) {
        try {
            const selectedLanguage = localStorage.getItem('sl') || 'en'
            if (newObj.action === null || newObj.roll === null)  {
                throw new Error(
                    "Items must be filled!"
                );
            }
            const url = `${env.ADM_BACK_URL}/adm/rollact/?sl=${selectedLanguage}`;
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

    async deleteAdmRollAct(newObj) {
        try {
            const url = `${env.ADM_BACK_URL}/adm/rollact/${newObj.id}`;
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

