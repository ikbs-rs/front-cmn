import React, { useEffect, useState } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import App from './App';
import { Login } from './pages/Login';
import { Error } from './pages/Error';
import { NotFound } from './pages/NotFound';
import LocEnd from './components/model/cmnLocL';
import ObjEnd from './components/model/cmnObjWEnd';
import ObjTpEnd from './components/model/cmnObjtpWEnd';
import ObjAttEnd from './components/model/cmnObjattWEnd';
import ObjAtttpEnd from './components/model/cmnObjatttpWEnd';
import ParLEnd from './components/model/cmnParL';
import ParEnd from './components/model/cmnObject';
import { Access } from './pages/Access';
import axios from 'axios';
import env from "./configs/env"


const AppWrapper = (props) => {
//console.log("**AppWrapper****AppWrapper*******AppWrapper****")
  let location = useLocation();
  const navigate = useNavigate();
  let [isLoggedIn, setIsLoggedIn] = useState(true);
  const search = window.location.search;
  const params = new URLSearchParams(search);
  const sl = params.get('sl');
  const aa = params.get('endpoint')
  const objId = params.get('objid');
  const obj = params.get('obj');

  const objtp=params.get('tp');
  const objcode=params.get('objcode');
  
  localStorage.setItem('sl', sl || "en")

  useEffect(() => {
    const token = localStorage.getItem('token');
    // proveri da li postoji token i da li je validan
    if (token && token.length > 0) {
      // ovde mozete dodati kod za proveru da li je token validan
      axios
        .post(`${env.JWT_BACK_URL}/adm/services/checkJwt`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
            timeout: 5000, // vreme za koje se očekuje odgovor od udaljenog servera (u milisekundama)
          }
        )
        .then((response) => {
          isLoggedIn = response.status === 200; // Ako je status 200, isLoggedIn će biti true
          if (isLoggedIn) {
            //TODO idi na pocetnu stranicu
            setIsLoggedIn(true);
            // navigate('/');
          } else {
            //TODO vrati se na login
            navigate('/login');
          }
        })
        .catch((error) => {
          console.error(error);
          isLoggedIn = false; // Ako se dogodila pogreška, isLoggedIn će biti false
          //TODO vrati se na login
        });
    } else {
      setIsLoggedIn(false);
    }
    window.scrollTo(0, 0);
  }, []);



  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/error" element={<Error />} />
      <Route path="/notfound" element={<NotFound />} />
      <Route path="/access" element={<Access />} />
      <Route path="/locend" element={<LocEnd />} />
      <Route path="/objend" element={<ObjEnd />} />
      <Route path="/objtpend" element={<ObjTpEnd />} />
      <Route path="/objattend" element={<ObjAttEnd />} />
      <Route path="/objatttpend" element={<ObjAtttpEnd />} />
      <Route path="/parlend" element={<ParLEnd />} />
      <Route path="/parend" element={<ParEnd objId={objId} />} />
      <Route path="*" element={
        (() => {
          if (isLoggedIn) {
            if (aa === "locend") {
              return <LocEnd />;
            } else if (aa === "objend") {
              return <ObjEnd objtp={objtp} objcode={objcode}/>; 
            } else if (aa === "objtpend") {
              return <ObjTpEnd />;                 
            } else if (aa === "objattend") {
              return <ObjAttEnd />;   
            } else if (aa === "objatttpend") {
              return <ObjAtttpEnd />;                            
            } else if (aa === "parlend") {
              return <ParLEnd />;  
            } else if (aa === "parend") {
              return <ParEnd objId={objId} dialog={false} />;                                       
            } else if (aa === "notfound") {
              return <NotFound />;
            } else if (aa === "access") {
              return <Access />;
            } else {
              return <App />;
            }
          } else {
            return <Login />;
          }
        })()
      } />
    </Routes>
  );
};

export default AppWrapper;
