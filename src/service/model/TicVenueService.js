import axios from 'axios';
import env from "../../configs/env"
import Token from "../../utilities/Token";

export class TicVenueService {


  async getTicVenueLista(objId) {
    const selectedLanguage = localStorage.getItem('sl') || 'en'
    const url = `${env.CMN_BACK_URL}/cmn/locvenue/_v/lista/?stm=tic_locvenue_v&objid=${objId}&sl=${selectedLanguage}`;
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

  async getTicVenues() {
    const selectedLanguage = localStorage.getItem('sl') || 'en'
    const url = `${env.CMN_BACK_URL}/tic/venue/?sl=${selectedLanguage}`;
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

  async getTicVenue(objId) {
    const selectedLanguage = localStorage.getItem('sl') || 'en'
    const url = `${env.CMN_BACK_URL}/tic/venue/${objId}/?sl=${selectedLanguage}`;
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

  async postTicVenue(newObj) {
    const selectedLanguage = localStorage.getItem('sl') || 'en'
    const url = `${env.CMN_BACK_URL}/tic/venue/_s/param/?stm=tic_venue_s&par1=CREATE&sl=${selectedLanguage}`;
    const tokenLocal = await Token.getTokensLS();
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': tokenLocal.token
    };
    const jsonObj = JSON.stringify(newObj)
    // console.log(jsonObj, "***************************postGrpEventatts*******************************", url)
    const response = await axios.post(url, { jsonObj }, { headers });
    return response.data.items||response.data.item;

  }

  async putTicVenue(newObj) {
    const selectedLanguage = localStorage.getItem('sl') || 'en'
    const url = `${env.CMN_BACK_URL}/tic/venue/_s/param/?stm=tic_venue_s&par1=UPDATE&sl=${selectedLanguage}`;
    const tokenLocal = await Token.getTokensLS();
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': tokenLocal.token
    };
    const jsonObj = JSON.stringify(newObj)
    // console.log(jsonObj, "***************************postGrpEventatts*******************************", url)
    const response = await axios.post(url, { jsonObj }, { headers });
    return response.data.items||response.data.item;
  }

  async deleteTicVenue(newObj) {
    const selectedLanguage = localStorage.getItem('sl') || 'en'
    const url = `${env.CMN_BACK_URL}/tic/venue/_s/param/?stm=tic_venue_s&par1=DELETE&sl=${selectedLanguage}`;
    const tokenLocal = await Token.getTokensLS();
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': tokenLocal.token
    };
    const jsonObj = JSON.stringify(newObj)
    // console.log(jsonObj, "***************************postGrpEventatts*******************************", url)
    const response = await axios.post(url, { jsonObj }, { headers });
    return response.data.items;

  }

  async getIdByItem(objId) {
    const selectedLanguage = localStorage.getItem('sl') || 'en'
    const url = `${env.CMN_BACK_URL}/tic/venue/getid/code/${objId}/?sl=${selectedLanguage}`;
    const tokenLocal = await Token.getTokensLS();
    const headers = {
      Authorization: tokenLocal.token
    };

    try {
      //console.log(url, "***************getIdByItem*******************!!!!!")
      const response = await axios.get(url, { headers });
      return response.data.items || response.data.item;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

}

