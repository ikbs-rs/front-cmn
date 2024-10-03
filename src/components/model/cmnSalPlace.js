import React from 'react';
import { translations } from '../../configs/translations';
import env from '../../configs/env';

const cmnSalPlace = (props) => {

    const selectedLanguage = localStorage.getItem('sl') || 'en';
    const url = `${env.DOMEN}/sal/admin-skica/${props.venue_id}?parent=ADM`
    console.log(props, "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX", url)
    return (
        <>
            <div className="grid">
                <div className="col-12">
                    <div className="card">
                        <iframe
                            // src={`https://82.117.213.106/sal/wizard/?locid${props.locId}&venue_id${props.venue_id}&parent=ADM`}
                            src={url}
                            title="Sal iframe"
                            width="100%"
                            height={props.iframeHeight||`760px`}
                            frameBorder="0"
                            // scrolling="no"
                        ></iframe>
                    </div>
                </div>
            </div>
        </>
    );
};

export default cmnSalPlace;