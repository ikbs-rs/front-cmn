import React, { useState, useRef, useEffect } from 'react';
import { classNames } from 'primereact/utils';
import { CmnObjattsService } from "../../service/model/CmnObjattsService";
import './index.css';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Toast } from "primereact/toast";
import DeleteDialog from '../dialog/DeleteDialog';
import { translations } from "../../configs/translations";
import { Dropdown } from 'primereact/dropdown';
import { CmnObjattService } from "../../service/model/CmnObjattService"
import { InputSwitch } from "primereact/inputswitch";
import { Calendar } from "primereact/calendar";
import DateFunction from "../../utilities/DateFunction.js"

const CmnObjatts = (props) => {
    const selectedLanguage = localStorage.getItem('sl') || 'en'
    const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
    const [cmnObjatts, setCmnObjatts] = useState(props.cmnObjatts);
    const [submitted, setSubmitted] = useState(false);
    const [ddCmnObjattItem, setDdCmnObjattItem] = useState(null);
    const [ddCmnObjattItems, setDdCmnObjattItems] = useState(null);
    const [begda, setBegda] = useState(new Date(DateFunction.formatJsDate(props.cmnObjatts.begda)));
    const [endda, setEndda] = useState(new Date(DateFunction.formatJsDate(props.cmnObjatts.endda || '99991231')))

    const calendarRef = useRef(null);

    const toast = useRef(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const cmnObjattService = new CmnObjattService();
                const data = await cmnObjattService.getCmnObjatts();
                const dataDD = data.map(({ textx, id }) => ({ name: textx, code: id }));
                setDdCmnObjattItems(dataDD);
                setDdCmnObjattItem(dataDD.find((item) => item.code === props.cmnObjatts.cmn_objatt) || null);
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
            cmnObjatts.begda = DateFunction.formatDateToDBFormat(DateFunction.dateGetValue(begda));
            cmnObjatts.endda = DateFunction.formatDateToDBFormat(DateFunction.dateGetValue(endda));

            const cmnObjattsService = new CmnObjattsService();
            const data = await cmnObjattsService.postCmnObjatts(cmnObjatts);
            cmnObjatts.id = data
            props.handleDialogClose({ obj: cmnObjatts, objattsTip: props.objattsTip });
            props.setVisible(false);
        } catch (err) {
            toast.current.show({
                severity: "error",
                summary: "CmnObjatt ",
                detail: `${err.response.data.error}`,
                life: 5000,
            });
        }
    };

    const handleSaveClick = async () => {
        try {


            cmnObjatts.begda = DateFunction.formatDateToDBFormat(DateFunction.dateGetValue(begda));
            cmnObjatts.endda = DateFunction.formatDateToDBFormat(DateFunction.dateGetValue(endda));
            const cmnObjattsService = new CmnObjattsService();

            await cmnObjattsService.putCmnObjatts(cmnObjatts);
            props.handleDialogClose({ obj: cmnObjatts, objattsTip: props.objattsTip });
            props.setVisible(false);
        } catch (err) {
            toast.current.show({
                severity: "error",
                summary: "CmnObjatt ",
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
            const cmnObjattsService = new CmnObjattsService();
            await cmnObjattsService.deleteCmnObjatts(cmnObjatts);
            props.handleDialogClose({ obj: cmnObjatts, objattsTip: 'DELETE' });
            props.setVisible(false);
            hideDeleteDialog();
        } catch (err) {
            toast.current.show({
                severity: "error",
                summary: "CmnObjatt ",
                detail: `${err.response.data.error}`,
                life: 5000,
            });
        }
    };

    const onInputChange = (e, type, name, a) => {
        let val = ''
        if (type === "options") {
            setDdCmnObjattItem(e.value);
            cmnObjatts.otext = e.value.name
            cmnObjatts.nobjatt1 = e.value.name
            cmnObjatts.ocode = e.value.code
            cmnObjatts.code1 = e.value.code
            val = (e.target && e.target.value && e.target.value.code) || '';
        } else if (type === "Calendar") {
            const dateVal = DateFunction.dateGetValue(e.value)
            val = (e.target && e.target.value) || '';
            switch (name) {
                case "begda":
                    setBegda(e.value)
                    cmnObjatts.begda = DateFunction.formatDateToDBFormat(dateVal)
                    break;
                case "endda":
                    setEndda(e.value)
                    cmnObjatts.endda = DateFunction.formatDateToDBFormat(dateVal)
                    break;
                default:
                    console.error("Pogresan naziv polja")
            }
        } else {
            val = (e.target && e.target.value) || '';
        }
        let _cmnObjatts = { ...cmnObjatts };
        _cmnObjatts[`${name}`] = val;

        setCmnObjatts(_cmnObjatts);
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
                            <label htmlFor="cmn_objatt">{translations[selectedLanguage].Attribute} *</label>
                            <Dropdown id="cmn_objatt"
                                value={ddCmnObjattItem}
                                options={ddCmnObjattItems}
                                onChange={(e) => onInputChange(e, "options", 'cmn_objatt')}
                                required
                                optionLabel="name"
                                placeholder="Select One"
                                className={classNames({ 'p-invalid': submitted && !cmnObjatts.cmn_objatt })}
                            />
                            {submitted && !cmnObjatts.cmn_objatt && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
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
                                value={cmnObjatts.value} onChange={(e) => onInputChange(e, "text", 'value')}
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
                            {(props.objattsTip === 'CREATE') ? (
                                <Button
                                    label={translations[selectedLanguage].Create}
                                    icon="pi pi-check"
                                    onClick={handleCreateClick}
                                    severity="success"
                                    outlined
                                />
                            ) : null}
                            {(props.objattsTip !== 'CREATE') ? (
                                <Button
                                    label={translations[selectedLanguage].Delete}
                                    icon="pi pi-trash"
                                    onClick={showDeleteDialog}
                                    className="p-button-outlined p-button-danger"
                                    outlined
                                />
                            ) : null}
                            {(props.objattsTip !== 'CREATE') ? (
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
                inCmnObjatt="delete"
                item={cmnObjatts.roll}
                onHide={hideDeleteDialog}
                onDelete={handleDeleteClick}
            />
        </div>
    );
};

export default CmnObjatts;
