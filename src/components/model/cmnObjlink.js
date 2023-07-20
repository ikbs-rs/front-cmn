import React, { useState, useRef, useEffect } from 'react';
import { classNames } from 'primereact/utils';
import { CmnObjlinkService } from "../../service/model/CmnObjlinkService";
import './index.css';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Toast } from "primereact/toast";
import DeleteDialog from '../dialog/DeleteDialog';
import { translations } from "../../configs/translations";
import { Dropdown } from 'primereact/dropdown';
//import { CmnObjlinkService } from "../../service/model/CmnObjattService"
import { InputSwitch } from "primereact/inputswitch";
import env from "../../configs/env"
import axios from 'axios';
import Token from "../../utilities/Token";
import { Calendar } from "primereact/calendar";
import DateFunction from "../../utilities/DateFunction.js"

const CmnObjlink = (props) => {
    const selectedLanguage = localStorage.getItem('sl') || 'en'
    const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
    const [cmnObjlink, setCmnObjlink] = useState(props.cmnObjlink);
    const [submitted, setSubmitted] = useState(false);
    const [ddUmItem, setDdUmItem] = useState(null);
    const [ddUmItems, setDdUmItems] = useState(null);
    const [ddObjTp1Item, setDdObjTp1Item] = useState(null);
    const [ddObjTp1Items, setDdObjTp1Items] = useState(null);
    const [ddObj1Item, setDdObj1Item] = useState(null);
    const [ddObj1Items, setDdObj1Items] = useState(null);
    const [begda, setBegda] = useState(new Date(DateFunction.formatJsDate(props.cmnObjlink.begda)));
    const [endda, setEndda] = useState(new Date(DateFunction.formatJsDate(props.cmnObjlink.endda || '99991231')))
    const [onoff, setOnoff] = useState(props.cmnObjlink.onoff == 1);
    const [hijerarhija, setHijerarhija] = useState(props.cmnObjlink.hijerarhija == 1);

    const calendarRef = useRef(null);
    const toast = useRef(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const url = `${env.CMN_BACK_URL}/cmn/x/objtp/?sl=${selectedLanguage}`;
                const tokenLocal = await Token.getTokensLS();
                const headers = {
                    Authorization: tokenLocal.token
                };

                const response = await axios.get(url, { headers });
                const data = response.data.items;
                const dataDD = data.map(({ textx, id }) => ({ name: textx, code: id }));
                setDdObjTp1Items(dataDD);
                setDdObjTp1Item(dataDD.find((item) => item.code === props.cmnObjlink.objtp1) || null);
            } catch (error) {
                console.error(error);
                // Obrada greške ako je potrebna
            }
        }
        fetchData();
    }, []);

    useEffect(() => {
        async function fetchData() {
            try {
                const tp = cmnObjlink.objtp1 || -1
                const url = `${env.CMN_BACK_URL}/cmn/x/obj/getall/tp/${tp}/?sl=${selectedLanguage}`;
                const tokenLocal = await Token.getTokensLS();
                const headers = {
                    Authorization: tokenLocal.token
                };
                const response = await axios.get(url, { headers });
                const data = response.data.item;
                const dataDD = data.map(({ textx, id }) => ({ name: textx, code: id }));
                setDdObj1Items(dataDD);
                setDdObj1Item(dataDD.find((item) => item.code === props.cmnObjlink.obj1) || null);
            } catch (error) {
                console.error(error);
                // Obrada greške ako je potrebna
            }
        }
        fetchData();
    }, [cmnObjlink.objtp1]);

    useEffect(() => {
        async function fetchData() {
            try {
                const url = `${env.CMN_BACK_URL}/cmn/x/um/?sl=${selectedLanguage}`;
                const tokenLocal = await Token.getTokensLS();
                const headers = {
                    Authorization: tokenLocal.token
                };

                const response = await axios.get(url, { headers });
                const data = response.data.items;
                const dataDD = data.map(({ textx, id }) => ({ name: textx, code: id }));
                setDdUmItems(dataDD);
                setDdUmItem(dataDD.find((item) => item.code === props.cmnObjlink.um) || null);
            } catch (error) {
                console.error(error);
                // Obrada greške ako je potrebna
            }
        }
        fetchData();
    }, []);
    // Autocomplit>

    const handleCancelClick = () => {
        props.setVisible(false);
    };

    const handleCreateClick = async () => {
        try {
            setSubmitted(true);
            setSubmitted(true);
            cmnObjlink.begda = DateFunction.formatDateToDBFormat(DateFunction.dateGetValue(begda));
            cmnObjlink.endda = DateFunction.formatDateToDBFormat(DateFunction.dateGetValue(endda));

            const cmnObjlinkService = new CmnObjlinkService();
            const data = await cmnObjlinkService.postCmnObjlink(cmnObjlink);
            cmnObjlink.id = data
            props.handleDialogClose({ obj: cmnObjlink, objlinkTip: props.objlinkTip });
            props.setVisible(false);
        } catch (err) {
            toast.current.show({
                severity: "error",
                summary: "CmnObjlink ",
                detail: `${err.response.data.error}`,
                life: 5000,
            });
        }
    };

    const handleSaveClick = async () => {
        try {


            cmnObjlink.begda = DateFunction.formatDateToDBFormat(DateFunction.dateGetValue(begda));
            cmnObjlink.endda = DateFunction.formatDateToDBFormat(DateFunction.dateGetValue(endda));
            const cmnObjlinkService = new CmnObjlinkService();

            await cmnObjlinkService.putCmnObjlink(cmnObjlink);
            props.handleDialogClose({ obj: cmnObjlink, objlinkTip: props.objlinkTip });
            props.setVisible(false);
        } catch (err) {
            toast.current.show({
                severity: "error",
                summary: "CmnObjlink ",
                detail: `${err.response.data.error}`,
                life: 5000,
            });
        }
    };

    const showDeleteDialog = () => {
        setDeleteDialogVisible(true);
    };

    const handleDeleteClick = async () => {
        try {
            setSubmitted(true);
            const cmnObjlinkService = new CmnObjlinkService();
            await cmnObjlinkService.deleteCmnObjlink(cmnObjlink);
            props.handleDialogClose({ obj: cmnObjlink, objlinkTip: 'DELETE' });
            props.setVisible(false);
            hideDeleteDialog();
        } catch (err) {
            toast.current.show({
                severity: "error",
                summary: "CmnObjlink ",
                detail: `${err.response.data.error}`,
                life: 5000,
            });
        }
    };

    const onInputChange = (e, type, name, a) => {
        let val = ''
        if (type === "options") {
            switch (name) {
                case "objtp1":
                    setDdObjTp1Item(e.value);
                    cmnObjlink.cobjtp1 = e.value.code
                    cmnObjlink.nobjtp1 = e.value.name
                    break;
                case "obj1":
                    setDdObj1Item(e.value);
                    cmnObjlink.cobj1 = e.value.code
                    cmnObjlink.nobj1 = e.value.name
                    break;
                default:
                    console.error("Pogresan naziv options polja")
            }
            val = (e.target && e.target.value && e.target.value.code) || '';
        } else if (type === "Calendar") {
            const dateVal = DateFunction.dateGetValue(e.value)
            val = (e.target && e.target.value) || '';
            switch (name) {
                case "begda":
                    setBegda(e.value)
                    cmnObjlink.begda = DateFunction.formatDateToDBFormat(dateVal)
                    break;
                case "endda":
                    setEndda(e.value)
                    cmnObjlink.endda = DateFunction.formatDateToDBFormat(dateVal)
                    break;
                default:
                    console.error("Pogresan naziv polja")
            }
        } else if (type === "inputSwitch") {
            val = (e.target && e.target.value) ? 1 : 0
            switch (name) {
                case "onoff":
                    setOnoff(e.value)
                    break;
                case "hijerarhija":
                    setHijerarhija(e.value)
                    break;
                default:
                    console.error("Pogresan naziv polja")
            }
        } else {
            val = (e.target && e.target.value) || '';
        }
        let _cmnObjlink = { ...cmnObjlink };
        _cmnObjlink[`${name}`] = val;

        setCmnObjlink(_cmnObjlink);
    };

    const hideDeleteDialog = () => {
        setDeleteDialogVisible(false);
    };

    return (
        <div className="grid">
            <Toast ref={toast} />
            <div className="col-12">
                <div className="card">
                    <div className="p-fluid formgrid grid">
                        <div className="field col-12 md:col-5">
                            <label htmlFor="code">{translations[selectedLanguage].Code}</label>
                            <InputText id="code"
                                value={props.cmnObj.code}
                                disabled={true}
                            />
                        </div>
                        <div className="field col-12 md:col-7">
                            <label htmlFor="text">{translations[selectedLanguage].Text}</label>
                            <InputText
                                id="textx"
                                value={props.cmnObj.textx}
                                disabled={true}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-12">
                <div className="card">
                    <div className="p-fluid formgrid grid">
                        <div className="field col-12 md:col-7">
                            <label htmlFor="objtp">{translations[selectedLanguage].ObjtpText} *</label>
                            <Dropdown id="objtp"
                                value={ddObjTp1Item}
                                options={ddObjTp1Items}
                                onChange={(e) => onInputChange(e, "options", 'objtp1')}
                                required
                                optionLabel="name"
                                placeholder="Select One"
                                className={classNames({ 'p-invalid': submitted && !cmnObjlink.objtp1 })}
                            />
                            {submitted && !cmnObjlink.objtp1 && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                        </div>
                        <div className="field col-12 md:col-7">
                            <label htmlFor="obj1">{translations[selectedLanguage].ObjText} *</label>
                            <Dropdown id="obj1"
                                value={ddObj1Item}
                                options={ddObj1Items}
                                onChange={(e) => onInputChange(e, "options", 'obj1')}
                                required
                                optionLabel="name"
                                placeholder="Select One"
                                className={classNames({ 'p-invalid': submitted && !cmnObjlink.obj1 })}
                            />
                            {submitted && !cmnObjlink.obj1 && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-1">
                        <div className="p-fluid formgrid grid">
                            <div className="field col-12 md:col-7">
                                <label htmlFor="roll">{translations[selectedLanguage].On_off}</label>
                                <InputSwitch inputId="onoff" checked={onoff} onChange={(e) => onInputChange(e, "inputSwitch", 'onoff')} />
                            </div>
                        </div>
                        <div className="p-fluid formgrid grid">
                            <div className="field col-12 md:col-7">
                                <label htmlFor="roll">{translations[selectedLanguage].Hijerarhija}</label>
                                <InputSwitch inputId="hijerarhija" checked={hijerarhija} onChange={(e) => onInputChange(e, "inputSwitch", 'hijerarhija')} />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="card">
                    <div className="p-fluid formgrid grid">
                        <div className="field col-12 md:col-7">
                            <label htmlFor="um">{translations[selectedLanguage].Um}</label>
                            <Dropdown id="um"
                                value={ddUmItem}
                                options={ddUmItems}
                                onChange={(e) => onInputChange(e, "options", 'um')}
                                required
                                optionLabel="name"
                                placeholder="Select One"
                                className={classNames({ 'p-invalid': submitted && !cmnObjlink.um })}
                            />
                            {submitted && !cmnObjlink.um && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                        </div>
                    </div>
                    <div className="p-fluid formgrid grid">
                        <div className="field col-12 md:col-11">
                            <label htmlFor="value">{translations[selectedLanguage].Value}</label>
                            <InputText
                                id="value"
                                value={cmnObjlink.value} onChange={(e) => onInputChange(e, "text", 'value')}
                            />
                        </div>
                    </div>                    
                    <div className="flex flex-wrap gap-2">
                        <div className="p-fluid formgrid grid">
                            <div className="field col-12 md:col-7">
                                <label htmlFor="begda">{translations[selectedLanguage].Begda} *</label>
                                <Calendar
                                    value={begda}
                                    onChange={(e) => onInputChange(e, "Calendar", 'begda', this)}
                                    showIcon
                                    dateFormat="dd.mm.yy"
                                />
                            </div>
                        </div>
                        <div className="p-fluid formgrid grid">
                            <div className="field col-12 md:col-7">
                                <label htmlFor="roenddal">{translations[selectedLanguage].Endda} *</label>
                                <Calendar
                                    value={endda}
                                    onChange={(e) => onInputChange(e, "Calendar", 'endda')}
                                    showIcon
                                    dateFormat="dd.mm.yy"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-1">
                        {props.dialog ? (
                            <Button
                                label={translations[selectedLanguage].Cancel}
                                icon="pi pi-times"
                                className="p-button-outlined p-button-secondary"
                                onClick={handleCancelClick}
                                outlined
                            />
                        ) : null}
                        <div className="flex-grow-1"></div>
                        <div className="flex flex-wrap gap-1">
                            {(props.objlinkTip === 'CREATE') ? (
                                <Button
                                    label={translations[selectedLanguage].Create}
                                    icon="pi pi-check"
                                    onClick={handleCreateClick}
                                    severity="success"
                                    outlined
                                />
                            ) : null}
                            {(props.objlinkTip !== 'CREATE') ? (
                                <Button
                                    label={translations[selectedLanguage].Delete}
                                    icon="pi pi-trash"
                                    onClick={showDeleteDialog}
                                    className="p-button-outlined p-button-danger"
                                    outlined
                                />
                            ) : null}
                            {(props.objlinkTip !== 'CREATE') ? (
                                <Button
                                    label={translations[selectedLanguage].Save}
                                    icon="pi pi-check"
                                    onClick={handleSaveClick}
                                    severity="success"
                                    outlined
                                />
                            ) : null}
                        </div>
                    </div>
                </div>
            </div>
            <DeleteDialog
                visible={deleteDialogVisible}
                inCmnObjlink="delete"
                item={cmnObjlink.roll}
                onHide={hideDeleteDialog}
                onDelete={handleDeleteClick}
            />
        </div>
    );
};

export default CmnObjlink;
