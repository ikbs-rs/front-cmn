import React from 'react';
import { translations } from "../configs/translations";

const EmptyPage = () => {
    const selectedLanguage = localStorage.getItem('sl')||'en'
    return (
        <div className="grid">
            <div className="col-12">
                <div className="card">
                    <h5>{translations[selectedLanguage].Common_libraries } </h5>
                    <p>{translations[selectedLanguage]._eptyPage }</p>
                </div>
            </div>
        </div>
    );
};

export default EmptyPage;
