import React, { useState, useRef, useEffect } from 'react';
import { classNames } from 'primereact/utils';
import { CmnLocattsService } from "../../service/model/CmnLocattsService";
import './index.css';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Toast } from "primereact/toast";
import DeleteDialog from '../dialog/DeleteDialog';
import { translations } from "../../configs/translations";
import { Dropdown } from 'primereact/dropdown';
import { CmnLocattService } from "../../service/model/CmnLocattService"
import { InputSwitch } from "primereact/inputswitch";
import { Calendar } from "primereact/calendar";
import DateFunction from "../../utilities/DateFunction.js"

const CmnLocatts = (props) => {
    const selectedLanguage = localStorage.getItem('sl') || 'en'
    const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
    const [cmnLocatts, setCmnLocatts] = useState(props.cmnLocatts);
    const [submitted, setSubmitted] = useState(false);
    const [ddCmnLocattItem, setDdCmnLocattItem] = useState(null);
    const [ddCmnLocattItems, setDdCmnLocattItems] = useState(null);
    const [begda, setBegda] = useState(new Date(DateFunction.formatJsDate(props.cmnLocatts.begda)));
    const [endda, setEndda] = useState(new Date(DateFunction.formatJsDate(props.cmnLocatts.endda || '99991231')))

    const calendarRef = useRef(null);

    const toast = useRef(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const cmnLocattService = new CmnLocattService();
                const data = await cmnLocattService.getCmnLocatts();
                const dataDD = data.map(({ textx, id }) => ({ name: textx, code: id }));
                setDdCmnLocattItems(dataDD);
                setDdCmnLocattItem(dataDD.find((item) => item.code === props.cmnLocatts.locatt) || null);
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
            cmnLocatts.begda = DateFunction.formatDateToDBFormat(DateFunction.dateGetValue(begda));
            cmnLocatts.endda = DateFunction.formatDateToDBFormat(DateFunction.dateGetValue(endda));

            const cmnLocattsService = new CmnLocattsService();
            const data = await cmnLocattsService.postCmnLocatts(cmnLocatts);
            cmnLocatts.id = data
            props.handleDialogClose({ obj: cmnLocatts, locattsTip: props.locattsTip });
            props.setVisible(false);
        } catch (err) {
            toast.current.show({
                severity: "error",
                summary: "CmnLocatt ",
                detail: `${err.response.data.error}`,
                life: 5000,
            });
        }
    };

    const handleSaveClick = async () => {
        try {


            cmnLocatts.begda = DateFunction.formatDateToDBFormat(DateFunction.dateGetValue(begda));
            cmnLocatts.endda = DateFunction.formatDateToDBFormat(DateFunction.dateGetValue(endda));
            const cmnLocattsService = new CmnLocattsService();

            await cmnLocattsService.putCmnLocatts(cmnLocatts);
            props.handleDialogClose({ obj: cmnLocatts, locattsTip: props.locattsTip });
            props.setVisible(false);
        } catch (err) {
            toast.current.show({
                severity: "error",
                summary: "CmnLocatt ",
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
            const cmnLocattsService = new CmnLocattsService();
            await cmnLocattsService.deleteCmnLocatts(cmnLocatts);
            props.handleDialogClose({ obj: cmnLocatts, locattsTip: 'DELETE' });
            props.setVisible(false);
            hideDeleteDialog();
        } catch (err) {
            toast.current.show({
                severity: "error",
                summary: "CmnLocatt ",
                detail: `${err.response.data.error}`,
                life: 5000,
            });
        }
    };

    const onInputChange = (e, type, name, a) => {
        let val = ''
        if (type === "options") {
            setDdCmnLocattItem(e.value);
            cmnLocatts.otext = e.value.name
            cmnLocatts.nlocatt1 = e.value.name
            cmnLocatts.ocode = e.value.code
            cmnLocatts.code1 = e.value.code
            val = (e.target && e.target.value && e.target.value.code) || '';
        } else if (type === "Calendar") {
            const dateVal = DateFunction.dateGetValue(e.value)
            val = (e.target && e.target.value) || '';
            switch (name) {
                case "begda":
                    setBegda(e.value)
                    cmnLocatts.begda = DateFunction.formatDateToDBFormat(dateVal)
                    break;
                case "endda":
                    setEndda(e.value)
                    cmnLocatts.endda = DateFunction.formatDateToDBFormat(dateVal)
                    break;
                default:
                    console.error("Pogresan naziv polja")
            }
        } else {
            val = (e.target && e.target.value) || '';
        }
        let _cmnLocatts = { ...cmnLocatts };
        _cmnLocatts[`${name}`] = val;

        setCmnLocatts(_cmnLocatts);
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
                                value={props.cmnLoc.code}
                                disabled={true}
                            />
                        </div>
                        <div className="field col-12 md:col-7">
                            <label htmlFor="text">{translations[selectedLanguage].Text}</label>
                            <InputText
                                id="textx"
                                value={props.cmnLoc.textx}
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
                            <label htmlFor="cmn_locatt">{translations[selectedLanguage].Attribute} *</label>
                            <Dropdown id="cmn_locatt"
                                value={ddCmnLocattItem}
                                options={ddCmnLocattItems}
                                onChange={(e) => onInputChange(e, "options", 'locatt')}
                                required
                                optionLabel="name"
                                placeholder="Select One"
                                className={classNames({ 'p-invalid': submitted && !cmnLocatts.cmn_locatt })}
                            />
                            {submitted && !cmnLocatts.cmn_locatt && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
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
                            <label htmlFor="text">{translations[selectedLanguage].Value}</label>
                            <InputText
                                id="text"
                                value={cmnLocatts.text} onChange={(e) => onInputChange(e, "text", 'text')}
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
                            {(props.locattsTip === 'CREATE') ? (
                                <Button
                                    label={translations[selectedLanguage].Create}
                                    icon="pi pi-check"
                                    onClick={handleCreateClick}
                                    severity="success"
                                    outlined
                                />
                            ) : null}
                            {(props.locattsTip !== 'CREATE') ? (
                                <Button
                                    label={translations[selectedLanguage].Delete}
                                    icon="pi pi-trash"
                                    onClick={showDeleteDialog}
                                    className="p-button-outlined p-button-danger"
                                    outlined
                                />
                            ) : null}
                            {(props.locattsTip !== 'CREATE') ? (
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
                inCmnLocatt="delete"
                item={cmnLocatts.roll}
                onHide={hideDeleteDialog}
                onDelete={handleDeleteClick}
            />
        </div>
    );
};

export default CmnLocatts;
