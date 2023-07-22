import React, { useState, useRef, useEffect } from 'react';
import { classNames } from 'primereact/utils';
import { CmnParattService } from "../../service/model/CmnParattService";
import './index.css';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from "primereact/toast";
import DeleteDialog from '../dialog/DeleteDialog';
import { translations } from "../../configs/translations";

const CmnParatt = (props) => {
    const selectedLanguage = localStorage.getItem('sl')||'en'
    const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
    const [dropdownItem, setDropdownItem] = useState(null);
    const [dropdownItems, setDropdownItems] = useState(null);
    const [cmnParatt, setCmnParatt] = useState(props.cmnParatt);
    const [submitted, setSubmitted] = useState(false);

    const toast = useRef(null);
    const items = [
        { name: `${translations[selectedLanguage].Yes}`, code: '1' },
        { name: `${translations[selectedLanguage].No}`, code: '0' }
    ];

    useEffect(() => {
        setDropdownItem(findDropdownItemByCode(props.cmnParatt.valid));
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
                const cmnParattService = new CmnParattService();
                const data = await cmnParattService.postCmnParatt(cmnParatt);
                cmnParatt.id = data
                props.handleDialogClose({ obj: cmnParatt, parattTip: props.parattTip });
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
            const cmnParattService = new CmnParattService();
            await cmnParattService.putCmnParatt(cmnParatt);
            props.handleDialogClose({ obj: cmnParatt, parattTip: props.parattTip });
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
            const cmnParattService = new CmnParattService();
            await cmnParattService.deleteCmnParatt(cmnParatt);
            props.handleDialogClose({ obj: cmnParatt, parattTip: 'DELETE' });
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
            setDropdownItem(e.value);
            val = (e.target && e.target.value && e.target.value.code) || '';
        } else {
            val = (e.target && e.target.value) || '';
        }

        let _cmnParatt = { ...cmnParatt };
        _cmnParatt[`${name}`] = val;
        if (name===`textx`) _cmnParatt[`text`] = val

        setCmnParatt(_cmnParatt);
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
                                value={cmnParatt.code} onChange={(e) => onInputChange(e, "text", 'code')}
                                required
                                className={classNames({ 'p-invalid': submitted && !cmnParatt.code })}
                            />
                            {submitted && !cmnParatt.code && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                        </div>
                        <div className="field col-12 md:col-12">
                            <label htmlFor="textx">{translations[selectedLanguage].Text}</label>
                            <InputText
                                id="textx"
                                value={cmnParatt.textx} onChange={(e) => onInputChange(e, "text", 'textx')}
                                required
                                className={classNames({ 'p-invalid': submitted && !cmnParatt.textx })}
                            />
                            {submitted && !cmnParatt.textx && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                        </div>                       
                        <div className="field col-12 md:col-4">
                            <label htmlFor="valid">{translations[selectedLanguage].Valid}</label>
                            <Dropdown id="valid"
                                value={dropdownItem}
                                options={dropdownItems}
                                onChange={(e) => onInputChange(e, "options", 'valid')}
                                required
                                optionLabel="name"
                                placeholder="Select One"
                                className={classNames({ 'p-invalid': submitted && !cmnParatt.valid })}
                            />
                            {submitted && !cmnParatt.valid && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
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
                            {(props.parattTip === 'CREATE') ? (
                                <Button
                                    label={translations[selectedLanguage].Create}
                                    icon="pi pi-check"
                                    onClick={handleCreateClick}
                                    severity="success"
                                    outlined
                                />
                            ) : null}
                            {(props.parattTip !== 'CREATE') ? (
                                <Button
                                    label={translations[selectedLanguage].Delete}
                                    icon="pi pi-trash"
                                    onClick={showDeleteDialog}
                                    className="p-button-outlined p-button-danger"
                                    outlined
                                />
                            ) : null}                            
                            {(props.parattTip !== 'CREATE') ? (
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
                item={cmnParatt.text}
                onHide={hideDeleteDialog}
                onDelete={handleDeleteClick}
            />
        </div>
    );
};

export default CmnParatt;
