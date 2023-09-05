import React, { useState, useRef, useEffect } from 'react';
import { classNames } from 'primereact/utils';
import { CmnTgptaxService } from "../../service/model/CmnTgptaxService";
import { CmnTaxService } from "../../service/model/CmnTaxService";
import './index.css';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Toast } from "primereact/toast";
import DeleteDialog from '../dialog/DeleteDialog';
import { translations } from "../../configs/translations";
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from "primereact/calendar";
import DateFunction from "../../utilities/DateFunction"

const CmnTgptax = (props) => {

    const selectedLanguage = localStorage.getItem('sl') || 'en'
    const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
    const [cmnTgptax, setCmnTgptax] = useState(props.cmnTgptax);
    const [submitted, setSubmitted] = useState(false);
    const [ddCmnTgptaxItem, setDdCmnTgptaxItem] = useState(null);
    const [ddCmnTgptaxItems, setDdCmnTgptaxItems] = useState(null);
    const [cmnTgptaxItem, setCmnTgptaxItem] = useState(null);
    const [cmnTgptaxItems, setCmnTgptaxItems] = useState(null);
    const [begda, setBegda] = useState(new Date(DateFunction.formatJsDate(props.cmnTgptax.begda || DateFunction.currDate())));
    const [endda, setEndda] = useState(new Date(DateFunction.formatJsDate(props.cmnTgptax.endda || DateFunction.currDate())))

    const calendarRef = useRef(null);

    const toast = useRef(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const cmnTaxService = new CmnTaxService();
                const data = await cmnTaxService.getCmnTaxs();

                setCmnTgptaxItems(data)
                //console.log("******************", cmnTgptaxItem)

                const dataDD = data.map(({ textx, id }) => ({ name: textx, code: id }));
                setDdCmnTgptaxItems(dataDD);
                setDdCmnTgptaxItem(dataDD.find((item) => item.code === props.cmnTgptax.tax) || null);
                if (props.cmnTgptax.tax) {
                    const foundItem = data.find((item) => item.id === props.cmnTgptax.tax);
                    setCmnTgptaxItem(foundItem || null);
                    cmnTgptax.ctax = foundItem.code
                    cmnTgptax.ntax = foundItem.textx
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
            cmnTgptax.begda = DateFunction.formatDateToDBFormat(DateFunction.dateGetValue(begda));
            cmnTgptax.endda = DateFunction.formatDateToDBFormat(DateFunction.dateGetValue(endda));
            const cmnTgptaxService = new CmnTgptaxService();
            const data = await cmnTgptaxService.postCmnTgptax(cmnTgptax);
            cmnTgptax.id = data
            props.handleDialogClose({ obj: cmnTgptax, tgptaxTip: props.tgptaxTip });
            props.setVisible(false);
        } catch (err) {
            toast.current.show({
                severity: "error",
                summary: "CmnTgptax ",
                detail: `${err.response.data.error}`,
                life: 5000,
            });
        }
    };

    const handleSaveClick = async () => {
        try {
            setSubmitted(true);
            cmnTgptax.begda = DateFunction.formatDateToDBFormat(DateFunction.dateGetValue(begda));
            cmnTgptax.endda = DateFunction.formatDateToDBFormat(DateFunction.dateGetValue(endda));            
            const cmnTgptaxService = new CmnTgptaxService();

            await cmnTgptaxService.putCmnTgptax(cmnTgptax);
            props.handleDialogClose({ obj: cmnTgptax, tgptaxTip: props.tgptaxTip });
            props.setVisible(false);
        } catch (err) {
            toast.current.show({
                severity: "error",
                summary: "CmnTgptax ",
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
            const cmnTgptaxService = new CmnTgptaxService();
            await cmnTgptaxService.deleteCmnTgptax(cmnTgptax);
            props.handleDialogClose({ obj: cmnTgptax, tgptaxTip: 'DELETE' });
            props.setVisible(false);
            hideDeleteDialog();
        } catch (err) {
            toast.current.show({
                severity: "error",
                summary: "CmnTgptax ",
                detail: `${err.response.data.error}`,
                life: 5000,
            });
        }
    };

    const onInputChange = (e, type, name, a) => {
        let val = ''

        if (type === "options") {
            val = (e.target && e.target.value && e.target.value.code) || '';
            setDdCmnTgptaxItem(e.value);
            const foundItem = cmnTgptaxItems.find((item) => item.id === val);
            setCmnTgptaxItem(foundItem || null);
            cmnTgptax.ntp = e.value.name
            cmnTgptax.ctp = foundItem.code
        } else if (type === "Calendar") {
            //const dateVal = DateFunction.dateGetValue(e.value)

            val = (e.target && e.target.value) || '';
            switch (name) {
                case "begda":
                    setBegda(e.value)
                    //cmnTgptax.begda = DateFunction.formatDateToDBFormat(dateVal)
                    break;
                case "endda":
                    setEndda(e.value)
                    //cmnTgptax.endda = DateFunction.formatDateToDBFormat(dateVal)
                    break;
                default:
                    console.error("Pogresan naziv polja")
            }
        } else {
            val = (e.target && e.target.value) || '';
        }
        let _cmnTgptax = { ...cmnTgptax };
        _cmnTgptax[`${name}`] = val;
        setCmnTgptax(_cmnTgptax);
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
                                value={props.cmnTgp.code}
                                disabled={true}
                            />
                        </div>
                        <div className="field col-12 md:col-7">
                            <label htmlFor="text">{translations[selectedLanguage].Text}</label>
                            <InputText
                                id="text"
                                value={props.cmnTgp.text}
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
                            <label htmlFor="tax">{translations[selectedLanguage].Tax} *</label>
                            <Dropdown id="tax"
                                value={ddCmnTgptaxItem}
                                options={ddCmnTgptaxItems}
                                onChange={(e) => onInputChange(e, "options", 'tax')}
                                required
                                optionLabel="name"
                                placeholder="Select One"
                                className={classNames({ 'p-invalid': submitted && !cmnTgptax.tax })}
                            />
                            {submitted && !cmnTgptax.tax && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
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
                            {(props.tgptaxTip === 'CREATE') ? (
                                <Button
                                    label={translations[selectedLanguage].Create}
                                    icon="pi pi-check"
                                    onClick={handleCreateClick}
                                    severity="success"
                                    outlined
                                />
                            ) : null}
                            {(props.tgptaxTip !== 'CREATE') ? (
                                <Button
                                    label={translations[selectedLanguage].Delete}
                                    icon="pi pi-trash"
                                    onClick={showDeleteDialog}
                                    className="p-button-outlined p-button-danger"
                                    outlined
                                />
                            ) : null}
                            {(props.tgptaxTip !== 'CREATE') ? (
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
                inCmnTgptax="delete"
                item={cmnTgptax.roll}
                onHide={hideDeleteDialog}
                onDelete={handleDeleteClick}
            />
        </div>
    );
};

export default CmnTgptax;
