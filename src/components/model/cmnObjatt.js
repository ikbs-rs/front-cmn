import React, { useState, useRef, useEffect } from 'react';
import { classNames } from 'primereact/utils';
import { CmnObjattService } from "../../service/model/CmnObjattService";
import './index.css';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from "primereact/toast";
import DeleteDialog from '../dialog/DeleteDialog';
import { translations } from "../../configs/translations";
import { CmnObjatttpService } from "../../service/model/CmnObjatttpService"

const CmnObjatt = (props) => {
    const selectedLanguage = localStorage.getItem('sl')||'en'
    const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
    const [dropdownItem, setDropdownItem] = useState(null);
    const [dropdownItems, setDropdownItems] = useState(null);
    const [cmnObjatt, setCmnObjatt] = useState(props.cmnObjatt);
    const [submitted, setSubmitted] = useState(false);
    const [ddObjatttpItem, setDdObjatttpItem] = useState(null);
    const [ddObjatttpItems, setDdObjatttpItems] = useState(null);    

    const toast = useRef(null);
    const items = [
        { name: `${translations[selectedLanguage].Yes}`, code: '1' },
        { name: `${translations[selectedLanguage].No}`, code: '0' }
    ];

    useEffect(() => {
        async function fetchData() {
            try {
                const cmnObjatttpService = new CmnObjatttpService();
                const data = await cmnObjatttpService.getCmnObjatttps();
                const dataDD = data.map(({ textx, id }) => ({ name: textx, code: id }));
                setDdObjatttpItems(dataDD);
                setDdObjatttpItem(dataDD.find((item) => item.code === props.cmnObjatt.cmn_objatttp) || null);
            } catch (error) {
                console.error(error);
                // Obrada greške ako je potrebna
            }
        }
        fetchData();
    }, []);    

    useEffect(() => {
        setDropdownItem(findDropdownItemByCode(props.cmnObjatt.valid));
    }, []);

    const findDropdownItemByCode = (code) => {
        return items.find((item) => item.code === code) || null;
    };


    useEffect(() => {
        setDropdownItems(items);
    }, []);

    const handleCancelClick = () => {
        props.setVisible(false);
    };

    const handleCreateClick = async () => {
        try {
            setSubmitted(true);            
                const cmnObjattService = new CmnObjattService();
                const data = await cmnObjattService.postCmnObjatt(cmnObjatt);
                cmnObjatt.id = data
                props.handleDialogClose({ obj: cmnObjatt, objattTip: props.objattTip });
            props.setVisible(false);
        } catch (err) {
            toast.current.show({
                severity: "error",
                summary: "Action ",
                detail: `${err.response.data.error}`,
                life: 5000,
            });
        }
    };

    const handleSaveClick = async () => {
        try {
            setSubmitted(true);
            const cmnObjattService = new CmnObjattService();
            await cmnObjattService.putCmnObjatt(cmnObjatt);
            props.handleDialogClose({ obj: cmnObjatt, objattTip: props.objattTip });
            props.setVisible(false);
        } catch (err) {
            toast.current.show({
                severity: "error",
                summary: "Action ",
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
            const cmnObjattService = new CmnObjattService();
            await cmnObjattService.deleteCmnObjatt(cmnObjatt);
            props.handleDialogClose({ obj: cmnObjatt, objattTip: 'DELETE' });
            props.setVisible(false);
            hideDeleteDialog();
        } catch (err) {
            toast.current.show({
                severity: "error",
                summary: "Action ",
                detail: `${err.response.data.error}`,
                life: 5000,
            });
        }
    };

    const onInputChange = (e, type, name) => {
        let val = ''
        if (type === "options") {
            if (name==='cmn_objatttp') {
                setDdObjatttpItem(e.value);
                cmnObjatt.otext = e.value.name
            } else {
                setDropdownItem(e.value);
            }
            val = (e.target && e.target.value && e.target.value.code) || '';
        } else {
            val = (e.target && e.target.value) || '';
        }

        let _cmnObjatt = { ...cmnObjatt };
        _cmnObjatt[`${name}`] = val;
        if (name===`textx`) _cmnObjatt[`text`] = val

        setCmnObjatt(_cmnObjatt);
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
                        <div className="field col-12 md:col-7">
                            <label htmlFor="code">{translations[selectedLanguage].Code}</label>
                            <InputText id="code" autoFocus
                                value={cmnObjatt.code} onChange={(e) => onInputChange(e, "text", 'code')}
                                required
                                className={classNames({ 'p-invalid': submitted && !cmnObjatt.code })}
                            />
                            {submitted && !cmnObjatt.code && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                        </div>
                        <div className="field col-12 md:col-9">
                            <label htmlFor="textx">{translations[selectedLanguage].Text}</label>
                            <InputText
                                id="textx"
                                value={cmnObjatt.textx} onChange={(e) => onInputChange(e, "text", 'textx')}
                                required
                                className={classNames({ 'p-invalid': submitted && !cmnObjatt.textx })}
                            />
                            {submitted && !cmnObjatt.textx && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                        </div>  
                        <div className="field col-12 md:col-8">
                            <label htmlFor="cmn_objatttp">{translations[selectedLanguage].Objatttp} *</label>
                            <Dropdown id="cmn_objatttp"
                                value={ddObjatttpItem}
                                options={ddObjatttpItems}
                                onChange={(e) => onInputChange(e, "options", 'cmn_objatttp')}
                                required
                                optionLabel="name"
                                placeholder="Select One"
                                className={classNames({ 'p-invalid': submitted && !cmnObjatt.cmn_objatttp })}
                            />
                            {submitted && !cmnObjatt.cmn_objatttp && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                        </div>                                             
                        <div className="field col-12 md:col-5">
                            <label htmlFor="valid">{translations[selectedLanguage].Valid}</label>
                            <Dropdown id="valid"
                                value={dropdownItem}
                                options={dropdownItems}
                                onChange={(e) => onInputChange(e, "options", 'valid')}
                                required
                                optionLabel="name"
                                placeholder="Select One"
                                className={classNames({ 'p-invalid': submitted && !cmnObjatt.valid })}
                            />
                            {submitted && !cmnObjatt.valid && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
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
                            {(props.objattTip === 'CREATE') ? (
                                <Button
                                    label={translations[selectedLanguage].Create}
                                    icon="pi pi-check"
                                    onClick={handleCreateClick}
                                    severity="success"
                                    outlined
                                />
                            ) : null}
                            {(props.objattTip !== 'CREATE') ? (
                                <Button
                                    label={translations[selectedLanguage].Delete}
                                    icon="pi pi-trash"
                                    onClick={showDeleteDialog}
                                    className="p-button-outlined p-button-danger"
                                    outlined
                                />
                            ) : null}                            
                            {(props.objattTip !== 'CREATE') ? (
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
                inAction="delete"
                item={cmnObjatt.text}
                onHide={hideDeleteDialog}
                onDelete={handleDeleteClick}
            />
        </div>
    );
};

export default CmnObjatt;
