import axios from 'axios';
import env from "../../configs/env"
import Token from "../../utilities/Token";

export class AdmRollService {
  async getAdmRollX() {
    const selectedLanguage = localStorage.getItem('sl') || 'en'
    const url = `${env.ADM_BACK_URL}/adm/x/roll/?sl=${selectedLanguage}`;
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

  async postAdmRoll(newObj) {
    try {
      const selectedLanguage = localStorage.getItem('sl') || 'en'
      if (newObj.code.trim() === '' || newObj.text.trim() === '' || newObj.valid === null) {
        throw new Error(
          "Items must be filled!"
        );
      }
      const url = `${env.ADM_BACK_URL}/adm/x/roll/?sl=${selectedLanguage}`;

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

  async putAdmRoll(newObj) {
    try {
      const selectedLanguage = localStorage.getItem('sl') || 'en'
      if (newObj.code.trim() === '' || newObj.text.trim() === '' || newObj.valid === null) {
        throw new Error(
          "Items must be filled!"
        );
      }
      const url = `${env.ADM_BACK_URL}/adm/x/roll/?sl=${selectedLanguage}`;
      const tokenLocal = await Token.getTokensLS();
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': tokenLocal.token
      };
      const jsonObj = JSON.stringify(newObj)

      const response = await axios.put(url, jsonObj, { headers });
      return response.data.items;
    } catch (error) {
      console.error(error);
      throw error;
    }

  }

  async deleteAdmRoll(newObj) {
    const url = `${env.ADM_BACK_URL}/adm/roll/${newObj.id}`;
    const tokenLocal = await Token.getTokensLS();
    const headers = {
      'Authorization': tokenLocal.token
    };

    try {
      const response = await axios.delete(url, { headers });
      return response.data.items;
    } catch (error) {
      throw error;
    }

  }
}

