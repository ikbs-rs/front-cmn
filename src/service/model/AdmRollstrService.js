import axios from 'axios';
import env from "../../configs/env"
import Token from "../../utilities/Token";

export class AdmRollstrService {

    async getAdmRollstrRoll(objId) {
        const selectedLanguage = localStorage.getItem('sl') || 'en'
        const url = `${env.ADM_BACK_URL}/adm/rollstr/getallouter1/roll/${objId}/?sl=${selectedLanguage}&outer=cmn_objtp&outerKey=objtp&outer1=cmn_obj&outerKey1=obj`;
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

    async getAdmRollstrs() {
        const selectedLanguage = localStorage.getItem('sl') || 'en'
        const url = `${env.ADM_BACK_URL}/adm/rollstr/?sl=${selectedLanguage}`;
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

    async getAdmRollstr(objId) {
        const selectedLanguage = localStorage.getItem('sl') || 'en'
        const url = `${env.ADM_BACK_URL}/adm/rollstr/${objId}/?sl=${selectedLanguage}`;
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


    async postAdmRollstr(newObj) {
        try {
            const selectedLanguage = localStorage.getItem('sl') || 'en'
            if (newObj.obj === null || newObj.objtp === null) {
                throw new Error(
                    "Items must be filled!"
                );
            }
            const url = `${env.ADM_BACK_URL}/adm/rollstr/?sl=${selectedLanguage}`;
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

    async putAdmRollstr(newObj) {
        try {
            const selectedLanguage = localStorage.getItem('sl') || 'en'
            if (newObj.obj === null || newObj.objtp === null)  {
                throw new Error(
                    "Items must be filled!"
                );
            }
            const url = `${env.ADM_BACK_URL}/adm/rollstr/?sl=${selectedLanguage}`;
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

    async deleteAdmRollstr(newObj) {
        try {
            const url = `${env.ADM_BACK_URL}/adm/rollstr/${newObj.id}`;
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

