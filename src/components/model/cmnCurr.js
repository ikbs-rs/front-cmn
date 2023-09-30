import React, { useState, useRef, useEffect } from 'react';
import { classNames } from 'primereact/utils';
import { CmnCurrService } from "../../service/model/CmnCurrService";
import { CmnTerrService } from "../../service/model/CmnTerrService";
import './index.css';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Toast } from "primereact/toast";
import DeleteDialog from '../dialog/DeleteDialog';
import { translations } from "../../configs/translations";
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from "primereact/calendar";
import DateFunction from "../../utilities/DateFunction"

const CmnCurr = (props) => {

    const selectedLanguage = localStorage.getItem('sl') || 'en'
    const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
    const [cmnCurr, setCmnCurr] = useState(props.cmnCurr);
    const [submitted, setSubmitted] = useState(false);
    const [ddCmnCurrItem, setDdCmnCurrItem] = useState(null);
    const [ddCmnCurrItems, setDdCmnCurrItems] = useState(null);
    const [cmnCurrItem, setCmnCurrItem] = useState(null);
    const [cmnCurrItems, setCmnCurrItems] = useState(null);
    const [begda, setBegda] = useState(new Date(DateFunction.formatJsDate(props.cmnCurr.begda || DateFunction.currDate())));
    const [endda, setEndda] = useState(new Date(DateFunction.formatJsDate('99991231' || DateFunction.currDate())))

    const calendarRef = useRef(null);

    const toast = useRef(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const cmnTerrService = new CmnTerrService();
                const data = await cmnTerrService.getCmnTerrs();

                setCmnCurrItems(data)
                //console.log("******************", cmnCurrItem)

                const dataDD = data.map(({ textx, id }) => ({ name: textx, code: id }));
                setDdCmnCurrItems(dataDD);
                setDdCmnCurrItem(dataDD.find((item) => item.code === props.cmnCurr.country) || null);
                if (props.cmnCurr.country) {
                    const foundItem = data.find((item) => item.id === props.cmnCurr.country);
                    setCmnCurrItem(foundItem || null);
                    cmnCurr.ccountry = foundItem.code
                    cmnCurr.ncountry = foundItem.textx
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
            cmnCurr.begda = DateFunction.formatDateToDBFormat(DateFunction.dateGetValue(begda));
            cmnCurr.endda = DateFunction.formatDateToDBFormat(DateFunction.dateGetValue(endda));
            const cmnCurrService = new CmnCurrService();
            const data = await cmnCurrService.postCmnCurr(cmnCurr);
            cmnCurr.id = data
            props.handleDialogClose({ obj: cmnCurr, currTip: props.currTip });
            props.setVisible(false);
        } catch (err) {
            toast.current.show({
                severity: "error",
                summary: "CmnCurr ",
                detail: `${err.response.data.error}`,
                life: 5000,
            });
        }
    };

    const handleSaveClick = async () => {
        try {
            setSubmitted(true);
            cmnCurr.begda = DateFunction.formatDateToDBFormat(DateFunction.dateGetValue(begda));
            cmnCurr.endda = DateFunction.formatDateToDBFormat(DateFunction.dateGetValue(endda));
            const cmnCurrService = new CmnCurrService();

            await cmnCurrService.putCmnCurr(cmnCurr);
            props.handleDialogClose({ obj: cmnCurr, currTip: props.currTip });
            props.setVisible(false);
        } catch (err) {
            toast.current.show({
                severity: "error",
                summary: "CmnCurr ",
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
            const cmnCurrService = new CmnCurrService();
            await cmnCurrService.deleteCmnCurr(cmnCurr);
            props.handleDialogClose({ obj: cmnCurr, currTip: 'DELETE' });
            props.setVisible(false);
            hideDeleteDialog();
        } catch (err) {
            toast.current.show({
                severity: "error",
                summary: "CmnCurr ",
                detail: `${err.response.data.error}`,
                life: 5000,
            });
        }
    };

    const onInputChange = (e, type, name, a) => {
        let val = ''

        if (type === "options") {
            val = (e.target && e.target.value && e.target.value.code) || '';
            setDdCmnCurrItem(e.value);
            const foundItem = cmnCurrItems.find((item) => item.id === val);
            setCmnCurrItem(foundItem || null);
            cmnCurr.ncountry = e.value.name
            cmnCurr.ccountry = foundItem.code
        } else if (type === "Calendar") {
            //const dateVal = DateFunction.dateGetValue(e.value)
            val = (e.target && e.target.value) || '';
            switch (name) {
                case "begda":
                    setBegda(e.value)
                    //cmnCurr.begda = DateFunction.formatDateToDBFormat(dateVal)
                    break;
                case "endda":
                    setEndda(e.value)
                    //cmnCurr.endda = DateFunction.formatDateToDBFormat(dateVal)
                    break;
                default:
                    console.error("Pogresan naziv polja")
            }
        } else {
            val = (e.target && e.target.value) || '';
        }
        let _cmnCurr = { ...cmnCurr };
        _cmnCurr[`${name}`] = val;
        setCmnCurr(_cmnCurr);
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
                                value={cmnCurr.code} onChange={(e) => onInputChange(e, "text", 'code')}
                                required
                                className={classNames({ 'p-invalid': submitted && !cmnCurr.code })}
                            />
                            {submitted && !cmnCurr.code && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                        </div>
                        <div className="field col-12 md:col-12">
                            <label htmlFor="text">{translations[selectedLanguage].Text}</label>
                            <InputText
                                id="text"
                                value={cmnCurr.text} onChange={(e) => onInputChange(e, "text", 'text')}
                                required
                                className={classNames({ 'p-invalid': submitted && !cmnCurr.text })}
                            />
                            {submitted && !cmnCurr.text && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                        </div>
                        <div className="field col-12 md:col-7">
                            <label htmlFor="country">{translations[selectedLanguage].country} *</label>
                            <Dropdown id="country"
                                value={ddCmnCurrItem}
                                options={ddCmnCurrItems}
                                onChange={(e) => onInputChange(e, "options", 'country')}
                                required
                                optionLabel="name"
                                placeholder="Select One"
                                className={classNames({ 'p-invalid': submitted && !cmnCurr.country })}
                            />
                            {submitted && !cmnCurr.country && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
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
                        <div className="field col-12 md:col-3">
                            <label htmlFor="tp">{translations[selectedLanguage].Text}</label>
                            <InputText
                                id="tp"
                                value={cmnCurr.tp} onChange={(e) => onInputChange(e, "text", 'tp')}
                                required
                                className={classNames({ 'p-invalid': submitted && !cmnCurr.tp })}
                            />
                            {submitted && !cmnCurr.tp && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
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
                            {(props.currTip === 'CREATE') ? (
                                <Button
                                    label={translations[selectedLanguage].Create}
                                    icon="pi pi-check"
                                    onClick={handleCreateClick}
                                    severity="success"
                                    outlined
                                />
                            ) : null}
                            {(props.currTip !== 'CREATE') ? (
                                <Button
                                    label={translations[selectedLanguage].Delete}
                                    icon="pi pi-trash"
                                    onClick={showDeleteDialog}
                                    className="p-button-outlined p-button-danger"
                                    outlined
                                />
                            ) : null}
                            {(props.currTip !== 'CREATE') ? (
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
                inCmnCurr="delete"
                item={cmnCurr.roll}
                onHide={hideDeleteDialog}
                onDelete={handleDeleteClick}
            />
        </div>
    );
};

export default CmnCurr;
