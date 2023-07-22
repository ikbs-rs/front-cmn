import React, { useState, useRef, useEffect } from 'react';
import { classNames } from 'primereact/utils';
import { CmnTerrattsService } from "../../service/model/CmnTerrattsService";
import { CmnTerrattService } from "../../service/model/CmnTerrattService";
import './index.css';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Toast } from "primereact/toast";
import DeleteDialog from '../dialog/DeleteDialog';
import { translations } from "../../configs/translations";
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from "primereact/calendar";
import DateFunction from "../../utilities/DateFunction"

const CmnTerratts = (props) => {

    const selectedLanguage = localStorage.getItem('sl') || 'en'
    const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
    const [cmnTerratts, setCmnTerratts] = useState(props.cmnTerratts);
    const [submitted, setSubmitted] = useState(false);
    const [ddCmnTerrattsItem, setDdCmnTerrattsItem] = useState(null);
    const [ddCmnTerrattsItems, setDdCmnTerrattsItems] = useState(null);
    const [cmnTerrattsItem, setCmnTerrattsItem] = useState(null);
    const [cmnTerrattsItems, setCmnTerrattsItems] = useState(null);
    const [begda, setBegda] = useState(new Date(DateFunction.formatJsDate(props.cmnTerratts.begda || DateFunction.currDate())));
    const [endda, setEndda] = useState(new Date(DateFunction.formatJsDate(props.cmnTerratts.endda || DateFunction.currDate())))

    const calendarRef = useRef(null);

    const toast = useRef(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const cmnTerrattService = new CmnTerrattService();
                const data = await cmnTerrattService.getCmnTerratts();

                setCmnTerrattsItems(data)
                //console.log("******************", cmnTerrattsItem)

                const dataDD = data.map(({ textx, id }) => ({ name: textx, code: id }));
                setDdCmnTerrattsItems(dataDD);
                setDdCmnTerrattsItem(dataDD.find((item) => item.code === props.cmnTerratts.att) || null);
                if (props.cmnTerratts.att) {
                    const foundItem = data.find((item) => item.id === props.cmnTerratts.att);
                    setCmnTerrattsItem(foundItem || null);
                    cmnTerratts.ctp = foundItem.code
                    cmnTerratts.ntp = foundItem.textx
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
            cmnTerratts.begda = DateFunction.formatDateToDBFormat(DateFunction.dateGetValue(begda));
            cmnTerratts.endda = DateFunction.formatDateToDBFormat(DateFunction.dateGetValue(endda));
            const cmnTerrattsService = new CmnTerrattsService();
            const data = await cmnTerrattsService.postCmnTerratts(cmnTerratts);
            cmnTerratts.id = data
            props.handleDialogClose({ obj: cmnTerratts, terrattsTip: props.terrattsTip });
            props.setVisible(false);
        } catch (err) {
            toast.current.show({
                severity: "error",
                summary: "CmnTerratts ",
                detail: `${err.response.data.error}`,
                life: 5000,
            });
        }
    };

    const handleSaveClick = async () => {
        try {
            setSubmitted(true);
            cmnTerratts.begda = DateFunction.formatDateToDBFormat(DateFunction.dateGetValue(begda));
            cmnTerratts.endda = DateFunction.formatDateToDBFormat(DateFunction.dateGetValue(endda));            
            const cmnTerrattsService = new CmnTerrattsService();

            await cmnTerrattsService.putCmnTerratts(cmnTerratts);
            props.handleDialogClose({ obj: cmnTerratts, terrattsTip: props.terrattsTip });
            props.setVisible(false);
        } catch (err) {
            toast.current.show({
                severity: "error",
                summary: "CmnTerratts ",
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
            const cmnTerrattsService = new CmnTerrattsService();
            await cmnTerrattsService.deleteCmnTerratts(cmnTerratts);
            props.handleDialogClose({ obj: cmnTerratts, terrattsTip: 'DELETE' });
            props.setVisible(false);
            hideDeleteDialog();
        } catch (err) {
            toast.current.show({
                severity: "error",
                summary: "CmnTerratts ",
                detail: `${err.response.data.error}`,
                life: 5000,
            });
        }
    };

    const onInputChange = (e, type, name, a) => {
        let val = ''

        if (type === "options") {
            val = (e.target && e.target.value && e.target.value.code) || '';
            setDdCmnTerrattsItem(e.value);
            const foundItem = cmnTerrattsItems.find((item) => item.id === val);
            setCmnTerrattsItem(foundItem || null);
            cmnTerratts.ntp = e.value.name
            cmnTerratts.ctp = foundItem.code
        } else if (type === "Calendar") {
            const dateVal = DateFunction.dateGetValue(e.value)

            val = (e.target && e.target.value) || '';
            switch (name) {
                case "begda":
                    setBegda(e.value)
                    //cmnTerratts.begda = DateFunction.formatDateToDBFormat(dateVal)
                    break;
                case "endda":
                    setEndda(e.value)
                    //cmnTerratts.endda = DateFunction.formatDateToDBFormat(dateVal)
                    break;
                default:
                    console.error("Pogresan naziv polja")
            }
        } else {
            val = (e.target && e.target.value) || '';
        }
        let _cmnTerratts = { ...cmnTerratts };
        _cmnTerratts[`${name}`] = val;
        setCmnTerratts(_cmnTerratts);
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
                                value={props.cmnTerr.code}
                                disabled={true}
                            />
                        </div>
                        <div className="field col-12 md:col-7">
                            <label htmlFor="text">{translations[selectedLanguage].Text}</label>
                            <InputText
                                id="text"
                                value={props.cmnTerr.text}
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
                            <label htmlFor="att">{translations[selectedLanguage].Attribute} *</label>
                            <Dropdown id="att"
                                value={ddCmnTerrattsItem}
                                options={ddCmnTerrattsItems}
                                onChange={(e) => onInputChange(e, "options", 'att')}
                                required
                                optionLabel="name"
                                placeholder="Select One"
                                className={classNames({ 'p-invalid': submitted && !cmnTerratts.att })}
                            />
                            {submitted && !cmnTerratts.att && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                        </div>
                    </div>

                    <div className="p-fluid formgrid grid">
                        <div className="field col-12 md:col-11">
                            <label htmlFor="text">{translations[selectedLanguage].Value}</label>
                            <InputText
                                id="text"
                                value={cmnTerratts.text} onChange={(e) => onInputChange(e, "text", 'text')}
                            />
                        </div>
                    </div>
                    <div className="p-fluid formgrid grid">
                        <div className="field col-12 md:col-5">
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
                        <div className="field col-12 md:col-5">
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
                            {(props.terrattsTip === 'CREATE') ? (
                                <Button
                                    label={translations[selectedLanguage].Create}
                                    icon="pi pi-check"
                                    onClick={handleCreateClick}
                                    severity="success"
                                    outlined
                                />
                            ) : null}
                            {(props.terrattsTip !== 'CREATE') ? (
                                <Button
                                    label={translations[selectedLanguage].Delete}
                                    icon="pi pi-trash"
                                    onClick={showDeleteDialog}
                                    className="p-button-outlined p-button-danger"
                                    outlined
                                />
                            ) : null}
                            {(props.terrattsTip !== 'CREATE') ? (
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
                inCmnTerratts="delete"
                item={cmnTerratts.roll}
                onHide={hideDeleteDialog}
                onDelete={handleDeleteClick}
            />
        </div>
    );
};

export default CmnTerratts;
