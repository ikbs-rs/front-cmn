import axios from 'axios';
import env from "../../configs/env"
import Token from "../../utilities/Token";

export class AdmMessageService {
  async getAdmMessageV() {
    const url = `${env.ADM_BACK_URL}/adm/message`;
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

  async postAdmMessage(newObj) {
    try {
      if (newObj.code.trim() === '' || newObj.text.trim() === '') {
        throw new Error(
          "Items must be filled!"
        );
      }
      const url = `${env.ADM_BACK_URL}/adm/message`;
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

  async putAdmMessage(newObj) {
    try {
      if (newObj.code.trim() === '' || newObj.text.trim() === '') {
        throw new Error(
          "Items must be filled!"
        );
      }
      const url = `${env.ADM_BACK_URL}/adm/message`;
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

  async deleteAdmMessage(newObj) {
    const url = `${env.ADM_BACK_URL}/adm/message/${newObj.id}`;
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

