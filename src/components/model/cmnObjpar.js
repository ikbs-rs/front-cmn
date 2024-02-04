import React, { useState, useRef, useEffect } from 'react';
import { classNames } from 'primereact/utils';
import { CmnObjparService } from "../../service/model/CmnObjparService.js";
import './index.css';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Toast } from "primereact/toast";
import DeleteDialog from '../dialog/DeleteDialog.js';
import { translations } from "../../configs/translations.js";
import { Dropdown } from 'primereact/dropdown';
import { CmnParService } from "../../service/model/CmnParService.js"
import { InputSwitch } from "primereact/inputswitch";
import { Calendar } from "primereact/calendar";
import DateFunction from "../../utilities/DateFunction.js"

const CmnObjpar = (props) => {
    const selectedLanguage = localStorage.getItem('sl') || 'en'
    const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
    const [cmnObjpar, setCmnObjpar] = useState(props.cmnObjpar);
    const [submitted, setSubmitted] = useState(false);
    const [ddCmnParItem, setDdCmnParItem] = useState(null);
    const [ddCmnParItems, setDdCmnParItems] = useState(null);
    const [begda, setBegda] = useState(new Date(DateFunction.formatJsDate(props.cmnObjpar.begda)));
    const [endda, setEndda] = useState(new Date(DateFunction.formatJsDate(props.cmnObjpar.endda || '99991231')))

    const calendarRef = useRef(null);

    const toast = useRef(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const cmnParService = new CmnParService();
                const data = await cmnParService.getCmnObjpar();
                const dataDD = data.map(({ textx, id }) => ({ name: textx, code: id }));
                setDdCmnParItems(dataDD);
                setDdCmnParItem(dataDD.find((item) => item.code === props.cmnObjpar.par) || null);
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
            cmnObjpar.begda = DateFunction.formatDateToDBFormat(DateFunction.dateGetValue(begda));
            cmnObjpar.endda = DateFunction.formatDateToDBFormat(DateFunction.dateGetValue(endda));

            const cmnObjparService = new CmnObjparService();
            const data = await cmnObjparService.postCmnObjpar(cmnObjpar);
            cmnObjpar.id = data
            props.handleDialogClose({ obj: cmnObjpar, objparTip: props.objparTip });
            props.setVisible(false);
        } catch (err) {
            toast.current.show({
                severity: "error",
                summary: "CmnPar ",
                detail: `${err.response.data.error}`,
                life: 5000,
            });
        }
    };

    const handleSaveClick = async () => {
        try {


            cmnObjpar.begda = DateFunction.formatDateToDBFormat(DateFunction.dateGetValue(begda));
            cmnObjpar.endda = DateFunction.formatDateToDBFormat(DateFunction.dateGetValue(endda));
            const cmnObjparService = new CmnObjparService();

            await cmnObjparService.putCmnObjpar(cmnObjpar);
            props.handleDialogClose({ obj: cmnObjpar, objparTip: props.objparTip });
            props.setVisible(false);
        } catch (err) {
            toast.current.show({
                severity: "error",
                summary: "CmnPar ",
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
            const cmnObjparService = new CmnObjparService();
            await cmnObjparService.deleteCmnObjpar(cmnObjpar);
            props.handleDialogClose({ obj: cmnObjpar, objparTip: 'DELETE' });
            props.setVisible(false);
            hideDeleteDialog();
        } catch (err) {
            toast.current.show({
                severity: "error",
                summary: "CmnPar ",
                detail: `${err.response.data.error}`,
                life: 5000,
            });
        }
    };

    const onInputChange = (e, type, name, a) => {
        let val = ''
        if (type === "options") {
            setDdCmnParItem(e.value);
            cmnObjpar.otext = e.value.name
            cmnObjpar.npar = e.value.name
            cmnObjpar.ocode = e.value.code
            cmnObjpar.cpar = e.value.code
            val = (e.target && e.target.value && e.target.value.code) || '';
        } else if (type === "Calendar") {
            const dateVal = DateFunction.dateGetValue(e.value)
            val = (e.target && e.target.value) || '';
            switch (name) {
                case "begda":
                    setBegda(e.value)
                    cmnObjpar.begda = DateFunction.formatDateToDBFormat(dateVal)
                    break;
                case "endda":
                    setEndda(e.value)
                    cmnObjpar.endda = DateFunction.formatDateToDBFormat(dateVal)
                    break;
                default:
                    console.error("Pogresan naziv polja")
            }
        } else {
            val = (e.target && e.target.value) || '';
        }
        let _cmnObjpar = { ...cmnObjpar };
        _cmnObjpar[`${name}`] = val;

        setCmnObjpar(_cmnObjpar);
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
                            <label htmlFor="par">{translations[selectedLanguage].Attribute} *</label>
                            <Dropdown id="par"
                                value={ddCmnParItem}
                                options={ddCmnParItems}
                                onChange={(e) => onInputChange(e, "options", 'par')}
                                required
                                optionLabel="name"
                                placeholder="Select One"
                                className={classNames({ 'p-invalid': submitted && !cmnObjpar.par })}
                            />
                            {submitted && !cmnObjpar.par && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <div className="p-fluid formgrid grid">
                            <div className="field col-12 md:col-7">
                                <label htmlFor="begda">{translations[selectedLanguage].Begda}</label>
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
                                <label htmlFor="roenddal">{translations[selectedLanguage].Endda}</label>
                                <Calendar
                                    value={endda}
                                    onChange={(e) => onInputChange(e, "Calendar", 'endda')}
                                    showIcon
                                    dateFormat="dd.mm.yy"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="p-fluid formgrid grid">
                        <div className="field col-12 md:col-11">
                            <label htmlFor="value">{translations[selectedLanguage].Value}</label>
                            <InputText
                                id="value"
                                value={cmnObjpar.value} onChange={(e) => onInputChange(e, "text", 'value')}
                            />
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
                            {(props.objparTip === 'CREATE') ? (
                                <Button
                                    label={translations[selectedLanguage].Create}
                                    icon="pi pi-check"
                                    onClick={handleCreateClick}
                                    severity="success"
                                    outlined
                                />
                            ) : null}
                            {(props.objparTip !== 'CREATE') ? (
                                <Button
                                    label={translations[selectedLanguage].Delete}
                                    icon="pi pi-trash"
                                    onClick={showDeleteDialog}
                                    className="p-button-outlined p-button-danger"
                                    outlined
                                />
                            ) : null}
                            {(props.objparTip !== 'CREATE') ? (
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
                inCmnPar="delete"
                item={cmnObjpar.roll}
                onHide={hideDeleteDialog}
                onDelete={handleDeleteClick}
            />
        </div>
    );
};

export default CmnObjpar;
