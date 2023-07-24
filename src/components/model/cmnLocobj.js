import React, { useState, useRef, useEffect } from 'react';
import { classNames } from 'primereact/utils';
import { CmnLocobjService } from "../../service/model/CmnLocobjService";
import { CmnLocService } from "../../service/model/CmnLocService";
import './index.css';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Toast } from "primereact/toast";
import DeleteDialog from '../dialog/DeleteDialog';
import { translations } from "../../configs/translations";
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from "primereact/calendar";
import DateFunction from "../../utilities/DateFunction"

const CmnLocobj = (props) => {

    const selectedLanguage = localStorage.getItem('sl') || 'en'
    const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
    const [cmnLocobj, setCmnLocobj] = useState(props.cmnLocobj);
    const [submitted, setSubmitted] = useState(false);
    const [ddCmnLocobjItem, setDdCmnLocobjItem] = useState(null);
    const [ddCmnLocobjItems, setDdCmnLocobjItems] = useState(null);
    const [cmnLocobjItem, setCmnLocobjItem] = useState(null);
    const [cmnLocobjItems, setCmnLocobjItems] = useState(null);

    const calendarRef = useRef(null);

    const toast = useRef(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const cmnCmnService = new CmnLocService();
                const data = await cmnCmnService.getCmnLocs();

                setCmnLocobjItems(data)
                //console.log("******************", cmnLocobjItem)

                const dataDD = data.map(({ textx, id }) => ({ name: textx, code: id }));
                setDdCmnLocobjItems(dataDD);
                setDdCmnLocobjItem(dataDD.find((item) => item.code === props.cmnLocobj.loc) || null);
                if (props.cmnLocobj.loc) {
                    const foundItem = data.find((item) => item.id === props.cmnLocobj.loc);
                    setCmnLocobjItem(foundItem || null);
                    cmnLocobj.cloc = foundItem.code
                    cmnLocobj.nloc = foundItem.textx
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
            const cmnLocobjService = new CmnLocobjService();
            const data = await cmnLocobjService.postCmnLocobj(cmnLocobj);
            cmnLocobj.id = data
            props.handleDialogClose({ obj: cmnLocobj, locobjTip: props.locobjTip });
            props.setVisible(false);
        } catch (err) {
            toast.current.show({
                severity: "error",
                summary: "CmnLocobj ",
                detail: `${err.response.data.error}`,
                life: 5000,
            });
        }
    };

    const handleSaveClick = async () => {
        try {
            setSubmitted(true);          
            const cmnLocobjService = new CmnLocobjService();

            await cmnLocobjService.putCmnLocobj(cmnLocobj);
            props.handleDialogClose({ obj: cmnLocobj, locobjTip: props.locobjTip });
            props.setVisible(false);
        } catch (err) {
            toast.current.show({
                severity: "error",
                summary: "CmnLocobj ",
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
            const cmnLocobjService = new CmnLocobjService();
            await cmnLocobjService.deleteCmnLocobj(cmnLocobj);
            props.handleDialogClose({ obj: cmnLocobj, locobjTip: 'DELETE' });
            props.setVisible(false);
            hideDeleteDialog();
        } catch (err) {
            toast.current.show({
                severity: "error",
                summary: "CmnLocobj ",
                detail: `${err.response.data.error}`,
                life: 5000,
            });
        }
    };

    const onInputChange = (e, type, name, a) => {
        let val = ''

        if (type === "options") {
            val = (e.target && e.target.value && e.target.value.code) || '';
            setDdCmnLocobjItem(e.value);
            const foundItem = cmnLocobjItems.find((item) => item.id === val);
            setCmnLocobjItem(foundItem || null);
            cmnLocobj.nloc = e.value.name
            cmnLocobj.cloc = foundItem.code
        } else {
            val = (e.target && e.target.value) || '';
        }
        let _cmnLocobj = { ...cmnLocobj };
        _cmnLocobj[`${name}`] = val;
        setCmnLocobj(_cmnLocobj);
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
                                id="text"
                                value={props.cmnObj.text}
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
                            <label htmlFor="loc">{translations[selectedLanguage].Attribute} *</label>
                            <Dropdown id="loc"
                                value={ddCmnLocobjItem}
                                options={ddCmnLocobjItems}
                                onChange={(e) => onInputChange(e, "options", 'loc')}
                                required
                                optionLabel="name"
                                placeholder="Select One"
                                className={classNames({ 'p-invalid': submitted && !cmnLocobj.loc })}
                            />
                            {submitted && !cmnLocobj.loc && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
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
                            {(props.locobjTip === 'CREATE') ? (
                                <Button
                                    label={translations[selectedLanguage].Create}
                                    icon="pi pi-check"
                                    onClick={handleCreateClick}
                                    severity="success"
                                    outlined
                                />
                            ) : null}
                            {(props.locobjTip !== 'CREATE') ? (
                                <Button
                                    label={translations[selectedLanguage].Delete}
                                    icon="pi pi-trash"
                                    onClick={showDeleteDialog}
                                    className="p-button-outlined p-button-danger"
                                    outlined
                                />
                            ) : null}
                            {(props.locobjTip !== 'CREATE') ? (
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
                inCmnLocobj="delete"
                item={cmnLocobj.roll}
                onHide={hideDeleteDialog}
                onDelete={handleDeleteClick}
            />
        </div>
    );
};

export default CmnLocobj;
