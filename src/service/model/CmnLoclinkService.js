import axios from 'axios';
import env from "../../configs/env"
import Token from "../../utilities/Token";

export class CmnLoclinkService {

    async getLista(objId) {
        const selectedLanguage = localStorage.getItem('sl') || 'en'
        const url = `${env.CMN_BACK_URL}/cmn/loclink/_v/fkey/?stm=cmn_loclink_v&id=${objId}&sl=${selectedLanguage}`;
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

    async getListaLL(objId, locCode) {
        const selectedLanguage = localStorage.getItem('sl') || 'en'
        const url = `${env.CMN_BACK_URL}/cmn/loclink/_v/fkey/?stm=cmn_loclinkll_v&item=${locCode}&id=${objId}&sl=${selectedLanguage}`;
        const tokenLocal = await Token.getTokensLS();
        const headers = {
            Authorization: tokenLocal.token
        };

        try {
            const response = await axios.get(url, { headers });
            console.log(url, "******************************getListaLL*********************************", response.data.item)
            return response.data.item;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async getCmnLoclinks() {
        const selectedLanguage = localStorage.getItem('sl') || 'en'
        const url = `${env.CMN_BACK_URL}/cmn/loclink/?sl=${selectedLanguage}`;
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

    async getCmnLoclink(objId) {
        const selectedLanguage = localStorage.getItem('sl') || 'en'
        const url = `${env.CMN_BACK_URL}/cmn/loclink/${objId}/?sl=${selectedLanguage}`;
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


    async postCmnLoclink(newObj) {
        try {
            const selectedLanguage = localStorage.getItem('sl') || 'en'
            if (newObj.obj === null || newObj.objtp === null) {
                throw new Error(
                    "Items must be filled!"
                );
            }
            const url = `${env.CMN_BACK_URL}/cmn/loclink/?sl=${selectedLanguage}`;
            const tokenLocal = await Token.getTokensLS();
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': tokenLocal.token
            };
            const jsonObj = JSON.stringify(newObj)
            console.log(newObj, "--------jsonObj---------", url)
            const response = await axios.post(url, jsonObj, { headers });
            return response.data.items;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async putCmnLoclink(newObj) {
        try {
            const selectedLanguage = localStorage.getItem('sl') || 'en'
            if (newObj.obj === null || newObj.objtp === null) {
                throw new Error(
                    "Items must be filled!"
                );
            }
            const url = `${env.CMN_BACK_URL}/cmn/loclink/?sl=${selectedLanguage}`;
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

    async deleteCmnLoclink(newObj) {
        try {
            const url = `${env.CMN_BACK_URL}/cmn/loclink/${newObj.id}`;
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


    async postGrpLoclink(obj,newObj, addItems, begda, enda) {
        try {
            const selectedLanguage = localStorage.getItem('sl') || 'en'
            if (obj.id===null) {
                throw new Error(
                    "obj must be filled!"
                );
            }
            const url = `${env.CMN_BACK_URL}/cmn/loclink/_s/param/?stm=cmn_grploclink_s&objId1=${obj.id}&objId2=${obj.tp}&par1=${addItems}&begda=${begda}&endda=${enda}&sl=${selectedLanguage}`;
            console.log(addItems, "@@@@@@*****************postGrpEventatts********************@@@@@@@@@@@", url, "@@+@@", "@@+@@", newObj)
            const tokenLocal = await Token.getTokensLS();
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': tokenLocal.token
            };
            const jsonObj = JSON.stringify(newObj)
            
            const response = await axios.post(url, {jsonObj}, { headers });
            console.log(response.data, "* BMV **************************postGrpEventatts*******************************", url)
            return response.data.item;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

}

