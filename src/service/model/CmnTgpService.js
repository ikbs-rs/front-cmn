import axios from 'axios';
import env from "../../configs/env"
import Token from "../../utilities/Token";

export class CmnTgpService {

  async getLista() {
    const selectedLanguage = localStorage.getItem('sl') || 'en'
    const url = `${env.CMN_BACK_URL}/cmn/x/tgp/_v/lista/?stm=cmn_tgp_v&sl=${selectedLanguage}`;
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


  async getCmnTgps() {
    const selectedLanguage = localStorage.getItem('sl') || 'en'
    const url = `${env.CMN_BACK_URL}/cmn/x/tgp/?sl=${selectedLanguage}`;
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

  async getCmnTgp(tgpId) {
    const selectedLanguage = localStorage.getItem('sl') || 'en'
    const url = `${env.CMN_BACK_URL}/cmn/x/tgp/${tgpId}/?sl=${selectedLanguage}`;
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


  async postCmnTgp(newObj) {
    try {
      const selectedLanguage = localStorage.getItem('sl') || 'en'
      if (newObj.code.trim() === '' || newObj.text.trim() === '' || newObj.valid === null) {
        throw new Error(
          "Items must be filled!"
        );
      }
      const url = `${env.CMN_BACK_URL}/cmn/x/tgp/?sl=${selectedLanguage}`;
      const tokenLocal = await Token.getTokensLS();
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': tokenLocal.token
      };
      const jsonObj = JSON.stringify(newObj)
      console.log(url, "**************"  , jsonObj, "****************")
      const response = await axios.post(url, jsonObj, { headers });

      return response.data.items;
    } catch (error) {
      console.error(error);
      throw error;
    }

  }

  async putCmnTgp(newObj) {
    try {
      const selectedLanguage = localStorage.getItem('sl') || 'en'
      if (newObj.code.trim() === '' || newObj.text.trim() === '' || newObj.valid === null) {
        throw new Error(
          "Items must be filled!"
        );
      }
      const url = `${env.CMN_BACK_URL}/cmn/x/tgp/?sl=${selectedLanguage}`;
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

  async deleteCmnTgp(newObj) {
    try {
      const url = `${env.CMN_BACK_URL}/cmn/x/tgp/${newObj.id}`;
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

