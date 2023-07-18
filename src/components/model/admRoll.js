import React, { useState, useRef, useEffect } from 'react';
import { classNames } from 'primereact/utils';
import { AdmRollService } from "../../service/model/AdmRollService";
import './index.css';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from "primereact/toast";
import DeleteDialog from '../dialog/DeleteDialog';
import { translations } from "../../configs/translations";

const AdmRoll = (props) => {
    const selectedLanguage = localStorage.getItem('sl')||'en'
    const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
    const [dropdownItem, setDropdownItem] = useState(null);
    const [dropdownDNItem, setDropdownDNItem] = useState(null);
    const [dropdownItems, setDropdownItems] = useState(null);
    const [dropdownDNItems, setDropdownDNItems] = useState(null);
    const [admRoll, setAdmRoll] = useState(props.admRoll);
    const [submitted, setSubmitted] = useState(false);

    const toast = useRef(null);
    const items01 = [ 
        { name: `${translations[selectedLanguage].Yes}`, code: '1' },
        { name: `${translations[selectedLanguage].No}`, code: '0' }
    ];

    const itemsDN = [ 
        { name: `${translations[selectedLanguage].Yes}`, code: 'D' },
        { name: `${translations[selectedLanguage].No}`, code: 'N' }
    ];

    useEffect(() => {
        setDropdownItem(findDropdownItemByCode(props.admRoll.valid));
    }, []);

    
    useEffect(() => {
        setDropdownDNItem(findDropdownItemDNByCode(props.admRoll.strukturna));
    }, []);

    const findDropdownItemByCode = (code) => {
        return items01.find((item) => item.code === code) || null;
    };

    const findDropdownItemDNByCode = (code) => {
        return itemsDN.find((itemDN) => itemDN.code === code) || null;
    };

    useEffect(() => {
        setDropdownItems(items01);
    }, []);

    useEffect(() => {
        setDropdownDNItems(itemsDN);
    }, []);

    const handleCancelClick = () => {
        props.setVisible(false);
    };

    const handleCreateClick = async () => {
        try {
            setSubmitted(true);            
                const admRollService = new AdmRollService();
                const data = await admRollService.postAdmRoll(admRoll);
                admRoll.id = data
                props.handleDialogClose({ obj: admRoll, rollTip: props.rollTip });
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
            const admRollService = new AdmRollService();
            await admRollService.putAdmRoll(admRoll);
            props.handleDialogClose({ obj: admRoll, rollTip: props.rollTip });
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
            const admRollService = new AdmRollService();
            await admRollService.deleteAdmRoll(admRoll);
            props.handleDialogClose({ obj: admRoll, rollTip: 'DELETE' });
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
            if (name==="strukturna") {
                setDropdownDNItem(e.value);
            }
            if (name==="valid") {
                setDropdownItem(e.value);
            }            
            val = (e.target && e.target.value && e.target.value.code) || '';
        } else {
            val = (e.target && e.target.value) || '';
        }

        let _admRoll = { ...admRoll };
        _admRoll[`${name}`] = val;
        if (name===`textx`) _admRoll[`text`] = val

        setAdmRoll(_admRoll);
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
                                value={admRoll.code} onChange={(e) => onInputChange(e, "text", 'code')}
                                required
                                className={classNames({ 'p-invalid': submitted && !admRoll.code })}
                            />
                            {submitted && !admRoll.code && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                        </div>
                        <div className="field col-12 md:col-12">
                            <label htmlFor="textx">{translations[selectedLanguage].Text}</label>
                            <InputText
                                id="textx"
                                value={admRoll.textx} onChange={(e) => onInputChange(e, "text", 'textx')}
                                required
                                className={classNames({ 'p-invalid': submitted && !admRoll.textx })}
                            />
                            {submitted && !admRoll.textx && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                        </div>
                        <div className="field col-6 md:col-4">
                            <label htmlFor="strukturna">{translations[selectedLanguage].Structures}</label>
                            <Dropdown id="strukturna"
                                value={dropdownDNItem}
                                options={dropdownDNItems}
                                onChange={(e) => onInputChange(e, "options", 'strukturna')}
                                required
                                optionLabel="name"
                                placeholder="Select One"
                                className={classNames({ 'p-invalid': submitted && !admRoll.strukturna })}
                            />
                            {submitted && !admRoll.strukturna && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                        </div>                         
                        <div className="field col-6 md:col-4">
                            <label htmlFor="valid">{translations[selectedLanguage].Valid}</label>
                            <Dropdown id="valid"
                                value={dropdownItem}
                                options={dropdownItems}
                                onChange={(e) => onInputChange(e, "options", 'valid')}
                                required
                                optionLabel="name"
                                placeholder="Select One"
                                className={classNames({ 'p-invalid': submitted && !admRoll.valid })}
                            />
                            {submitted && !admRoll.valid && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
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
                            {(props.rollTip === 'CREATE') ? (
                                <Button
                                    label={translations[selectedLanguage].Create}
                                    icon="pi pi-check"
                                    onClick={handleCreateClick}
                                    severity="success"
                                    outlined
                                />
                            ) : null}
                            {(props.rollTip !== 'CREATE') ? (
                                <Button
                                    label={translations[selectedLanguage].Delete}
                                    icon="pi pi-trash"
                                    onClick={showDeleteDialog}
                                    className="p-button-outlined p-button-danger"
                                    outlined
                                />
                            ) : null}                            
                            {(props.rollTip !== 'CREATE') ? (
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
                item={admRoll.name}
                onHide={hideDeleteDialog}
                onDelete={handleDeleteClick}
            />
        </div>
    );
};

export default AdmRoll;
