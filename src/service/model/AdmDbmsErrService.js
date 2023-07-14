import axios from 'axios';
import env from "../../configs/env"
import Token from "../../utilities/Token";

export class AdmDbmsErrService {
  async getAdmDbmsErrV() {
    const url = `${env.ADM_BACK_URL}/adm/dbmserr`;
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

  async postAdmDbmsErr(newObj) {
    try {
      if (newObj.code.trim() === '' || newObj.text.trim() === '') {
        throw new Error(
          "Items must be filled!"
        );
      }
      const url = `${env.ADM_BACK_URL}/adm/dbmserr`;
      const tokenLocal = await Token.getTokensLS();
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': tokenLocal.token
      };
      const jsonObj = JSON.stringify(newObj)


      const response = await axios.post(url, jsonObj, { headers });
      //console.log("**************"  , response, "****************")
      return response.data.items;
    } catch (error) {
      console.error(error);
      throw error;
    }

  }

  async putAdmDbmsErr(newObj) {
    try {
      if (newObj.code.trim() === '' || newObj.text.trim() === '') {
        throw new Error(
          "Items must be filled!"
        );
      }
      const url = `${env.ADM_BACK_URL}/adm/dbmserr`;
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

  async deleteAdmDbmsErr(newObj) {
    const url = `${env.ADM_BACK_URL}/adm/dbmserr/${newObj.id}`;
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

