import axios from 'axios';
import env from "../../configs/env"
import Token from "../../utilities/Token";

export class AdmRolllinkService {

  async getAdmRolllinkRoll(objId) {
    const selectedLanguage = localStorage.getItem('sl') || 'en'
    const url = `${env.ADM_BACK_URL}/adm/rolllink/getallouter/roll2/${objId}/?sl=${selectedLanguage}&outer=adm_roll&outerKey=roll1`;
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

  async getAdmRolllinkAllByItem(userObj) {
    const url = `${env.ADM_BACK_URL}/adm/rolllink_vr/getall/roll/${userObj.id}`;
    const tokenLocal = await Token.getTokensLS();
    const headers = {
      Authorization: tokenLocal.token
    };
    try {
      console.log(url)
      const response = await axios.get(url, { headers });
      return response.data.item;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async postAdmRolllink(newObj) {
    try {
      console.log("KKKK43", newObj)
      if (newObj.roll === null || newObj.usr === null) {
        throw new Error(
          "Items must be filled!"
        );
      }
      const url = `${env.ADM_BACK_URL}/adm/rolllink`;
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

  async putAdmRolllink(newObj) {
    try {
      if (newObj.roll === null || newObj.usr === null) {
        throw new Error(
          "Items must be filled!"
        );
      }
      const url = `${env.ADM_BACK_URL}/adm/rolllink`;
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

  async deleteAdmRolllink(newObj) {
    const url = `${env.ADM_BACK_URL}/adm/rolllink/${newObj.id}`;
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

