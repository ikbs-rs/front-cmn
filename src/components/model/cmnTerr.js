import React, { useState, useRef, useEffect } from 'react';
import { classNames } from 'primereact/utils';
import { CmnTerrService } from "../../service/model/CmnTerrService";
import { CmnTerrtpService } from "../../service/model/CmnTerrtpService";
import './index.css';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Toast } from "primereact/toast";
import DeleteDialog from '../dialog/DeleteDialog';
import { translations } from "../../configs/translations";
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from "primereact/calendar";
import DateFunction from "../../utilities/DateFunction"

const CmnTerr = (props) => {

    const selectedLanguage = localStorage.getItem('sl') || 'en'
    const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
    const [cmnTerr, setCmnTerr] = useState(props.cmnTerr);
    const [submitted, setSubmitted] = useState(false);
    const [ddCmnTerrItem, setDdCmnTerrItem] = useState(null);
    const [ddCmnTerrItems, setDdCmnTerrItems] = useState(null);
    const [cmnTerrItem, setCmnTerrItem] = useState(null);
    const [cmnTerrItems, setCmnTerrItems] = useState(null);
    const [begda, setBegda] = useState(new Date(DateFunction.formatJsDate(props.cmnTerr.begda || DateFunction.currDate())));
    const [endda, setEndda] = useState(new Date(DateFunction.formatJsDate('99991231' || DateFunction.currDate())))

    const calendarRef = useRef(null);

    const toast = useRef(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const cmnTerrtpService = new CmnTerrtpService();
                const data = await cmnTerrtpService.getCmnTerrtps();

                setCmnTerrItems(data)
                //console.log("******************", cmnTerrItem)

                const dataDD = data.map(({ textx, id }) => ({ name: textx, code: id }));
                setDdCmnTerrItems(dataDD);
                setDdCmnTerrItem(dataDD.find((item) => item.code === props.cmnTerr.tp) || null);
                if (props.cmnTerr.tp) {
                    const foundItem = data.find((item) => item.id === props.cmnTerr.tp);
                    setCmnTerrItem(foundItem || null);
                    cmnTerr.ctp = foundItem.code
                    cmnTerr.ntp = foundItem.textx
                }

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
            cmnTerr.begda = DateFunction.formatDateToDBFormat(DateFunction.dateGetValue(begda));
            cmnTerr.endda = DateFunction.formatDateToDBFormat(DateFunction.dateGetValue(endda));
            const cmnTerrService = new CmnTerrService();
            const data = await cmnTerrService.postCmnTerr(cmnTerr);
            cmnTerr.id = data
            props.handleDialogClose({ obj: cmnTerr, terrTip: props.terrTip });
            props.setVisible(false);
        } catch (err) {
            toast.current.show({
                severity: "error",
                summary: "CmnTerr ",
                detail: `${err.response.data.error}`,
                life: 5000,
            });
        }
    };

    const handleSaveClick = async () => {
        try {
            setSubmitted(true);
            cmnTerr.begda = DateFunction.formatDateToDBFormat(DateFunction.dateGetValue(begda));
            cmnTerr.endda = DateFunction.formatDateToDBFormat(DateFunction.dateGetValue(endda));
            const cmnTerrService = new CmnTerrService();

            await cmnTerrService.putCmnTerr(cmnTerr);
            props.handleDialogClose({ obj: cmnTerr, terrTip: props.terrTip });
            props.setVisible(false);
        } catch (err) {
            toast.current.show({
                severity: "error",
                summary: "CmnTerr ",
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
            const cmnTerrService = new CmnTerrService();
            await cmnTerrService.deleteCmnTerr(cmnTerr);
            props.handleDialogClose({ obj: cmnTerr, terrTip: 'DELETE' });
            props.setVisible(false);
            hideDeleteDialog();
        } catch (err) {
            toast.current.show({
                severity: "error",
                summary: "CmnTerr ",
                detail: `${err.response.data.error}`,
                life: 5000,
            });
        }
    };

    const onInputChange = (e, type, name, a) => {
        let val = ''

        if (type === "options") {
            val = (e.target && e.target.value && e.target.value.code) || '';
            setDdCmnTerrItem(e.value);
            const foundItem = cmnTerrItems.find((item) => item.id === val);
            setCmnTerrItem(foundItem || null);
            cmnTerr.ntp = e.value.name
            cmnTerr.ctp = foundItem.code
        } else if (type === "Calendar") {
            //const dateVal = DateFunction.dateGetValue(e.value)
            val = (e.target && e.target.value) || '';
            switch (name) {
                case "begda":
                    setBegda(e.value)
                    //cmnTerr.begda = DateFunction.formatDateToDBFormat(dateVal)
                    break;
                case "endda":
                    setEndda(e.value)
                    //cmnTerr.endda = DateFunction.formatDateToDBFormat(dateVal)
                    break;
                default:
                    console.error("Pogresan naziv polja")
            }
        } else {
            val = (e.target && e.target.value) || '';
        }
        let _cmnTerr = { ...cmnTerr };
        _cmnTerr[`${name}`] = val;
        setCmnTerr(_cmnTerr);
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
                            <InputText id="code" autoFocus
                                value={cmnTerr.code} onChange={(e) => onInputChange(e, "text", 'code')}
                                required
                                className={classNames({ 'p-invalid': submitted && !cmnTerr.code })}
                            />
                            {submitted && !cmnTerr.code && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                        </div>
                        <div className="field col-12 md:col-12">
                            <label htmlFor="text">{translations[selectedLanguage].Text}</label>
                            <InputText
                                id="text"
                                value={cmnTerr.text} onChange={(e) => onInputChange(e, "text", 'text')}
                                required
                                className={classNames({ 'p-invalid': submitted && !cmnTerr.text })}
                            />
                            {submitted && !cmnTerr.text && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                        </div>
                        <div className="field col-12 md:col-7">
                            <label htmlFor="tp">{translations[selectedLanguage].Type} *</label>
                            <Dropdown id="tp"
                                value={ddCmnTerrItem}
                                options={ddCmnTerrItems}
                                onChange={(e) => onInputChange(e, "options", 'tp')}
                                required
                                optionLabel="name"
                                placeholder="Select One"
                                className={classNames({ 'p-invalid': submitted && !cmnTerr.tp })}
                            />
                            {submitted && !cmnTerr.tp && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                        </div>

                        <div className="field col-12 md:col-4">
                            <label htmlFor="postcode">{translations[selectedLanguage].postcode}</label>
                            <InputText
                                id="postcode"
                                value={cmnTerr.postcode} onChange={(e) => onInputChange(e, "text", 'postcode')}
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
                            <label htmlFor="roenddal">{translations[selectedLanguage].Endda} *</label>
                            <Calendar
                                value={endda}
                                onChange={(e) => onInputChange(e, "Calendar", 'endda')}
                                showIcon
                                dateFormat="dd.mm.yy"
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
                            {(props.terrTip === 'CREATE') ? (
                                <Button
                                    label={translations[selectedLanguage].Create}
                                    icon="pi pi-check"
                                    onClick={handleCreateClick}
                                    severity="success"
                                    outlined
                                />
                            ) : null}
                            {(props.terrTip !== 'CREATE') ? (
                                <Button
                                    label={translations[selectedLanguage].Delete}
                                    icon="pi pi-trash"
                                    onClick={showDeleteDialog}
                                    className="p-button-outlined p-button-danger"
                                    outlined
                                />
                            ) : null}
                            {(props.terrTip !== 'CREATE') ? (
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
                inCmnTerr="delete"
                item={cmnTerr.roll}
                onHide={hideDeleteDialog}
                onDelete={handleDeleteClick}
            />
        </div>
    );
};

export default CmnTerr;
