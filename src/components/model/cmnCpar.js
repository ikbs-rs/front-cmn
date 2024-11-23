import React, { useState, useRef, useEffect } from 'react';
import { classNames } from 'primereact/utils';
import { CmnCparService } from "../../service/model/CmnCparService";
import { CmnCpartpService } from "../../service/model/CmnCpartpService";
import { CmnTerrService } from "../../service/model/CmnTerrService";
import './index.css';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Toast } from "primereact/toast";
import DeleteDialog from '../dialog/DeleteDialog';
import { translations } from "../../configs/translations";
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from "primereact/calendar";
import DateFunction from "../../utilities/DateFunction";
import env from '../../configs/env';

const CmnCpar = (props) => {
    const selectedLanguage = localStorage.getItem('sl') || 'en'
    const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
    const [cmnCpar, setCmnCpar] = useState(props.cmnCpar);
    const [submitted, setSubmitted] = useState(false);
    const [ddCmnCparItem, setDdCmnCparItem] = useState(null);
    const [ddCmnCparItems, setDdCmnCparItems] = useState(null);
    const [ddCountryItem, setDdCountryItem] = useState(null);
    const [ddCountryItems, setDdCountryItems] = useState(null);
    const [cmnCparItem, setCmnCparItem] = useState(null);
    const [cmnCparItems, setCmnCparItems] = useState(null);
    const [cmnCounryItem, setCmnCounryItem] = useState(null);
    const [cmnCounryItems, setCmnCounryItems] = useState(null);
    const [begda, setBegda] = useState(new Date(DateFunction.formatJsDate(props.cmnCpar.begda || DateFunction.currDate())));
    const [endda, setEndda] = useState(new Date(DateFunction.formatJsDate('99991231' || DateFunction.currDate())))
    const [birthday, setBirthday] = useState(props.cmnCpar?.birthday?new Date(DateFunction.formatJsDate(props.cmnCpar.birthday)):null);

    const calendarRef = useRef(null);

    const toast = useRef(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const cmnCpartpService = new CmnCpartpService();
                const data = await cmnCpartpService.getCmnCpartps();

                setCmnCparItems(data)
                //console.log("******************", cmnCparItem)

                const dataDD = data.map(({ textx, id }) => ({ name: textx, code: id }));
                setDdCmnCparItems(dataDD);
                setDdCmnCparItem(dataDD.find((item) => item.code === props.cmnCpar.tp) || null);
                if (props.cmnCpar.tp) {
                    const foundItem = data.find((item) => item.id === props.cmnCpar.tp);
                    setCmnCparItem(foundItem || null);
                    cmnCpar.ctp = foundItem.code
                    cmnCpar.ntp = foundItem.textx
                }

            } catch (error) {
                console.error(error);
                // Obrada greške ako je potrebna
            }
        }
        fetchData();
    }, []);
    // Autocomplit>

    useEffect(() => {
        async function fetchData() {
            try {
                const cmnTerrService = new CmnTerrService();
                const data = await cmnTerrService.getTpLista('2');

                setCmnCounryItems(data)
                //console.log("******************", cmnCparItem)

                const dataDD = data.map(({ textx, id }) => ({ name: textx, code: id }));
                setDdCountryItems(dataDD);
                setDdCountryItem(dataDD.find((item) => item.code === props.cmnCpar.countryid) || null);
                if (props.cmnCpar.tp) {
                    const foundItem = data.find((item) => item.id === props.cmnCpar.countryid);
                    setCmnCounryItem(foundItem || null);
                    cmnCpar.cterr = foundItem.code
                    cmnCpar.nterr = foundItem.textx
                }

            } catch (error) {
                console.error(error);
                // Obrada greške ako je potrebna
            }
        }
        fetchData();
    }, []);


    // const handleCancelClick = () => {
    //     props.setVisible(false);
    // };
    const handleCancelClick = () => {
        if (props.remote) {
            const dataToSend = { type: 'dataFromIframe', visible: false };
            sendToParent(dataToSend);
        } else {
            props.setVisible(false);
        }
    };
    const sendToParent = (data) => {
        const parentOrigin = `${env.DOMEN}`; // Promenite ovo na stvarni izvor roditeljskog dokumenta
        window.parent.postMessage(data, parentOrigin);
    }
    const handleCreateClick = async () => {
        try {
            setSubmitted(true);
            cmnCpar.begda = DateFunction.formatDateToDBFormat(DateFunction.dateGetValue(begda));
            cmnCpar.endda = DateFunction.formatDateToDBFormat(DateFunction.dateGetValue(endda));
            cmnCpar.birthday = birthday?DateFunction.formatDateToDBFormat(DateFunction.dateGetValue(birthday)):null;
            
            const cmnCparService = new CmnCparService();
            const data = await cmnCparService.postCmnCpar(cmnCpar);
            cmnCpar.id = data.id
            if (cmnCpar.code === null || cmnCpar.code === "") {
                cmnCpar.code = data.code;
            }
            props.handleDialogClose({ obj: cmnCpar, cparTip: props.cparTip });
            props.setVisible(false);
        } catch (err) {
            toast.current.show({
                severity: "error",
                summary: "CmnCpar ",
                detail: `${err.response.data.error}`,
                life: 5000,
            });
        }
    };

    const handleSaveClick = async () => {
        try {
            setSubmitted(true);
            cmnCpar.begda = DateFunction.formatDateToDBFormat(DateFunction.dateGetValue(begda));
            cmnCpar.endda = DateFunction.formatDateToDBFormat(DateFunction.dateGetValue(endda));
            cmnCpar.birthday = birthday?DateFunction.formatDateToDBFormat(DateFunction.dateGetValue(birthday)):null;
            const cmnCparService = new CmnCparService();

            await cmnCparService.putCmnCpar(cmnCpar);
            const newObj = { obj: cmnCpar, cparTip: props.cparTip }
            props.handleDialogClose(newObj);
            props.setVisible(false);
        } catch (err) {
            toast.current.show({
                severity: "error",
                summary: "CmnCpar ",
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
            const cmnCparService = new CmnCparService();
            await cmnCparService.deleteCmnCpar(cmnCpar);
            props.handleDialogClose({ obj: cmnCpar, cparTip: 'DELETE' });
            props.setVisible(false);
            hideDeleteDialog();
        } catch (err) {
            toast.current.show({
                severity: "error",
                summary: "CmnCpar ",
                detail: `${err.response.data.error}`,
                life: 5000,
            });
        }
    };

    const onInputChange = (e, type, name, a) => {
        let val = ''
        if (type === "options") {
            val = (e.target && e.target.value && e.target.value.code) || '';
            if (name == 'tp') {
                setDdCmnCparItem(e.value);
                const foundItem = cmnCparItems.find((item) => item.id === val);
                setCmnCparItem(foundItem || null);
                cmnCpar.ntp = e.value.name
                cmnCpar.ctp = foundItem?.code
            } else {
                setDdCountryItem(e.value);
                const foundItem = cmnCounryItems.find((item) => item.id === val);
                // setCmnCounryItem(foundItem || null);
                // cmnCpar.ntp = e.value.name
                // cmnCpar.ctp = foundItem.code
            }
        } else if (type === "Calendar") {
            //const dateVal = DateFunction.dateGetValue(e.value)
            val = (e.target && e.target.value) || '';
            switch (name) {
                case "begda":
                    setBegda(e.value)
                    //cmnCpar.begda = DateFunction.formatDateToDBFormat(dateVal)
                    break;
                case "endda":
                    setEndda(e.value)
                    break;
                case "birthday":
                    setBirthday(e.value)
                    break;
                default:
                    console.error("Pogresan naziv polja")
            }
        } else {
            val = (e.target && e.target.value) || '';
            console.log(val, "*******************", e.target)
        }
        let _cmnCpar = { ...cmnCpar };
        _cmnCpar[`${name}`] = val;
        setCmnCpar(_cmnCpar);
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
                        <div className="field col-12 md:col-3">
                            <label htmlFor="code">{translations[selectedLanguage].Code}</label>
                            <InputText id="code" autoFocus
                                value={cmnCpar.code} onChange={(e) => onInputChange(e, "text", 'code')}
                                required
                                className={classNames({ 'p-invalid': submitted && !cmnCpar.code })}
                            />
                            {submitted && !cmnCpar.code && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                        </div>
                        <div className="field col-12 md:col-9">
                            <label htmlFor="text">{translations[selectedLanguage].Text}</label>
                            <InputText
                                id="text"
                                value={cmnCpar.text} onChange={(e) => onInputChange(e, "text", 'text')}
                                required
                                className={classNames({ 'p-invalid': submitted && !cmnCpar.text })}
                            />
                            {submitted && !cmnCpar.text && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                        </div>



                        <div className="field col-12 md:col-8">
                            <label htmlFor="short">{translations[selectedLanguage].short}</label>
                            <InputText
                                id="short"
                                value={cmnCpar.short} onChange={(e) => onInputChange(e, "text", 'short')}
                            />
                        </div>
                        <div className="field col-12 md:col-7">
                            <label htmlFor="tp">{translations[selectedLanguage].Type} *</label>
                            <Dropdown id="tp"
                                value={ddCmnCparItem}
                                options={ddCmnCparItems}
                                onChange={(e) => onInputChange(e, "options", 'tp')}
                                required
                                optionLabel="name"
                                placeholder="Select One"
                                className={classNames({ 'p-invalid': submitted && !cmnCpar.tp })}
                            />
                            {submitted && !cmnCpar.tp && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                        </div>
                        <div className="field col-12 md:col-5">
                            <label htmlFor="address">{translations[selectedLanguage].address}</label>
                            <InputText
                                id="address"
                                value={cmnCpar.address} onChange={(e) => onInputChange(e, "text", 'address')}
                            />

                        </div>

                        <div className="field col-12 md:col-4">
                            <label htmlFor="place">{translations[selectedLanguage].place}</label>
                            <InputText
                                id="place"
                                value={cmnCpar.place} onChange={(e) => onInputChange(e, "text", 'place')}
                            />
                        </div>

                        <div className="field col-12 md:col-3">
                            <label htmlFor="countryid">{translations[selectedLanguage].Country} *</label>
                            <Dropdown id="countryid"
                                value={ddCountryItem}
                                options={ddCountryItems}
                                onChange={(e) => onInputChange(e, "options", 'countryid')}
                                required
                                optionLabel="name"
                                placeholder="Select One"
                                className={classNames({ 'p-invalid': submitted && !cmnCpar.countryid })}
                            />
                            {submitted && !cmnCpar.countryid && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                        </div>


                        <div className="field col-12 md:col-4">
                            <label htmlFor="postcode">{translations[selectedLanguage].postcode}</label>
                            <InputText
                                id="postcode"
                                value={cmnCpar.postcode} onChange={(e) => onInputChange(e, "text", 'postcode')}
                            />
                        </div>
                        <div className="field col-12 md:col-4">
                            <label htmlFor="tel">{translations[selectedLanguage].tel}</label>
                            <InputText
                                id="tel"
                                value={cmnCpar.tel} onChange={(e) => onInputChange(e, "text", 'tel')}
                            />
                        </div>
                        <div className="field col-12 md:col-4">
                            <label htmlFor="email">{translations[selectedLanguage].email}</label>
                            <InputText
                                id="email"
                                value={cmnCpar.email} onChange={(e) => onInputChange(e, "text", 'email')}
                            />
                        </div>

                        <div className="field col-12 md:col-6">
                            <label htmlFor="activity">{translations[selectedLanguage].activity}</label>
                            <InputText
                                id="activity"
                                value={cmnCpar.activity} onChange={(e) => onInputChange(e, "text", 'activity')}
                            />
                        </div>

                        <div className="field col-12 md:col-6">
                            <label htmlFor="pib">{translations[selectedLanguage].pib}</label>
                            <InputText
                                id="pib"
                                value={cmnCpar.pib} onChange={(e) => onInputChange(e, "text", 'pib')}
                            />
                        </div>
                        <div className="field col-12 md:col-6">
                            <label htmlFor="idnum">{translations[selectedLanguage].idnum}</label>
                            <InputText
                                id="idnum"
                                value={cmnCpar.idnum} onChange={(e) => onInputChange(e, "text", 'idnum')}
                            />
                        </div>

                        <div className="field col-12 md:col-6">
                            <label htmlFor="pdvnum">{translations[selectedLanguage].pdvnum}</label>
                            <InputText
                                id="pdvnum"
                                value={cmnCpar.pdvnum} onChange={(e) => onInputChange(e, "text", 'pdvnum')}
                            />
                        </div>
                        <div className="field col-12 md:col-6">
                            <label htmlFor="begda">{translations[selectedLanguage].Begda} *</label>
                            <Calendar
                                value={begda}
                                onChange={(e) => onInputChange(e, "Calendar", 'begda', this)}
                                showIcon
                                dateFormat="dd.mm.yy"
                            />
                        </div>
                        <div className="field col-12 md:col-6">
                            <label htmlFor="endda">{translations[selectedLanguage].Endda} *</label>
                            <Calendar
                                value={endda}
                                onChange={(e) => onInputChange(e, "Calendar", 'endda')}
                                showIcon
                                dateFormat="dd.mm.yy"
                            />
                        </div>
                        <div className="field col-12 md:col-4">
                            <label htmlFor="birthday">{translations[selectedLanguage].Birthday} *</label>
                            <Calendar
                                value={birthday}
                                onChange={(e) => onInputChange(e, "Calendar", 'birthday')}
                                showIcon
                                dateFormat="dd.mm.yy"
                            />
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-1">

                        <Button
                            label={translations[selectedLanguage].Cancel}
                            icon="pi pi-times"
                            className="p-button-outlined p-button-secondary"
                            onClick={handleCancelClick}
                            outlined
                        />

                        <div className="flex-grow-1"></div>
                        <div className="flex flex-wrap gap-1">
                            {(props.cparTip === 'CREATE') ? (
                                <Button
                                    label={translations[selectedLanguage].Create}
                                    icon="pi pi-check"
                                    onClick={handleCreateClick}
                                    severity="success"
                                    outlined
                                />
                            ) : null}
                            {(props.cparTip !== 'CREATE') ? (
                                <Button
                                    label={translations[selectedLanguage].Delete}
                                    icon="pi pi-trash"
                                    onClick={showDeleteDialog}
                                    className="p-button-outlined p-button-danger"
                                    outlined
                                />
                            ) : null}
                            {(props.cparTip !== 'CREATE') ? (
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
                inCmnCpar="delete"
                item={cmnCpar.roll}
                onHide={hideDeleteDialog}
                onDelete={handleDeleteClick}
            />
        </div>
    );
};

export default CmnCpar;
