import React, { useState, useRef, useEffect } from 'react';
import { classNames } from 'primereact/utils';
import { AdmUserService } from "../../service/model/AdmUserService";
import './index.css';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Toast } from "primereact/toast";
import DeleteDialog from '../dialog/DeleteDialog';
import { Dropdown } from 'primereact/dropdown';
import { AdmUserGrpService } from "../../service/model/AdmUserGrpService";
import { translations } from "../../configs/translations";

const AdmUser = (props) => {
    const selectedLanguage = localStorage.getItem('sl')||'en'
    const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
    const [admUser, setAdmUser] = useState(props.admUser);
    const [submitted, setSubmitted] = useState(false);
    const [ddValidItem, setDdValidItem] = useState(null);
    const [ddValidItems, setDdValidItems] = useState(null);
    const [ddAdminItem, setDdAdminItem] = useState(null);
    const [ddAdminItems, setDdAdminItems] = useState(null);    
    const [ddUserGrpItem, setDdUserGrpItem] = useState(null);
    const [ddUserGrpItems, setDdUserGrpItems] = useState(null);

    const toast = useRef(null);
    const yesNoItems = [
        { name: `${translations[selectedLanguage].Yes}`, code: '1' },
        { name: `${translations[selectedLanguage].No}`, code: '0' }
    ];

    useEffect(() => {
        async function fetchData() {
          try {
            const admUserGrpService = new AdmUserGrpService();
            const data = await admUserGrpService.getAdmUserGrp();
            const dataDD = data.map(({ text, id }) => ({ name: text, code: id }));         
            setDdUserGrpItems(dataDD);
            setDdUserGrpItem(dataDD.find((item) => item.code === props.admUser.usergrp) || null);
          } catch (error) {
            console.error(error);
            // Obrada greške ako je potrebna
          }
        }
        fetchData();
    }, []);
   
    const findDdYesNoItemByCode = (code) => {
        return yesNoItems.find((item) => item.code === code) || null;
    }; 

    // Valid options
    useEffect(() => {
        setDdValidItem(findDdYesNoItemByCode(props.admUser.valid));
    }, []);
    useEffect(() => {
        setDdValidItems(yesNoItems);
    }, []);      
    // Admin options
    useEffect(() => {
        setDdAdminItem(findDdYesNoItemByCode(props.admUser.admin));
    }, []);
    useEffect(() => {
        setDdAdminItems(yesNoItems);
    }, []); 

    //Dugmici obrada
    const handleCancelClick = () => {
        props.setVisible(false);
    };

    const handleCreateClick = async () => {
        try {
            setSubmitted(true);            
                const admUserService = new AdmUserService();
                const data = await admUserService.postAdmUser(admUser);
                admUser.id = data
                props.handleDialogClose({ obj: admUser, userTip: props.userTip });
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
            const admUserService = new AdmUserService();
            await admUserService.putAdmUser(admUser);
            props.handleDialogClose({ obj: admUser, userTip: props.userTip });
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
            const admUserService = new AdmUserService();
            await admUserService.deleteAdmUser(admUser);
            props.handleDialogClose({ obj: admUser, userTip: 'DELETE' });
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
            if (name==='usergrp') {
                setDdUserGrpItem(e.value);
                admUser.gtext= e.value.name
            } else if (name==='valid') {
                setDdValidItem(e.value);
            } else {
                setDdAdminItem(e.value);
            }
            val = (e.target && e.target.value && e.target.value.code) || '';
        } else {
            val = (e.target && e.target.value) || '';
        }

        let _admUser = { ...admUser };
        _admUser[`${name}`] = val;

        setAdmUser(_admUser);
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
                            <label htmlFor="username">{translations[selectedLanguage].Username} *</label>
                            <InputText id="username" autoFocus
                                value={admUser.username} onChange={(e) => onInputChange(e, "text", 'username')}
                                required
                                className={classNames({ 'p-invalid': submitted && !admUser.username })}
                            />
                            {submitted && !admUser.username && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                        </div>
                        <div className="field col-12 md:col-7">
                            <label htmlFor="mail">{translations[selectedLanguage].Mail} *</label>
                            <InputText
                                id="mail"
                                value={admUser.mail} onChange={(e) => onInputChange(e, "text", 'mail')}
                                required
                                className={classNames({ 'p-invalid': submitted && !admUser.mail })}
                            />
                            {submitted && !admUser.mail && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                        </div>                        
                        <div className="field col-12 md:col-6">
                            <label htmlFor="firstname">{translations[selectedLanguage].FirstName}</label>
                            <InputText
                                id="firstname"
                                value={admUser.firstname} onChange={(e) => onInputChange(e, "text", 'firstname')}
                            />
                        </div>   
                        <div className="field col-12 md:col-6">
                            <label htmlFor="lastname">{translations[selectedLanguage].LastName}</label>
                            <InputText
                                id="lastname"
                                value={admUser.lastname} onChange={(e) => onInputChange(e, "text", 'lastname')}
                            />
                        </div> 
                        <div className="field col-12 md:col-6">
                            <label htmlFor="usergrp">{translations[selectedLanguage].Usergroup} *</label>
                            <Dropdown id="usergrp"
                                value={ddUserGrpItem}
                                options={ddUserGrpItems}
                                onChange={(e) => onInputChange(e, "options", 'usergrp')}
                                required
                                optionLabel="name"
                                placeholder="Select One"
                                className={classNames({ 'p-invalid': submitted && !admUser.usergrp })}
                            />
                            {submitted && !admUser.usergrp && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                        </div>                                                      
                        <div className="field col-12 md:col-6">
                            <label htmlFor="admin">{translations[selectedLanguage].Admin} *</label>
                            <Dropdown id="admin"
                                value={ddAdminItem}
                                options={ddAdminItems}
                                onChange={(e) => onInputChange(e, "options", 'admin')}
                                required
                                optionLabel="name"
                                placeholder="Select One"
                                className={classNames({ 'p-invalid': submitted && !admUser.admin })}
                            />
                            {submitted && !admUser.admin && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                        </div>   
                        <div className="field col-12 md:col-7">
                            <label htmlFor="tip">{translations[selectedLanguage].Type} *</label>
                            <InputText
                                id="tip"
                                value={admUser.tip} onChange={(e) => onInputChange(e, "text", 'tip')}
                                required
                                className={classNames({ 'p-invalid': submitted && !admUser.tip })}
                            />
                            {submitted && !admUser.tip && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                        </div>                         
                        <div className="field col-12 md:col-6">
                            <label htmlFor="sapuser">{translations[selectedLanguage].Sapuser}</label>
                            <InputText
                                id="sapuser"
                                value={admUser.sapuser} onChange={(e) => onInputChange(e, "text", 'sapuser')}
                            />
                        </div> 
                        <div className="field col-12 md:col-6">
                            <label htmlFor="aduser">{translations[selectedLanguage].ADuser}</label>
                            <InputText
                                id="aduser"
                                value={admUser.aduser} onChange={(e) => onInputChange(e, "text", 'aduser')}
                            />
                        </div>                                                                                             
                        <div className="field col-12 md:col-3">
                            <label htmlFor="valid">{translations[selectedLanguage].Valid} *</label>
                            <Dropdown id="valid"
                                value={ddValidItem}
                                options={ddValidItems}
                                onChange={(e) => onInputChange(e, "options", 'valid')}
                                required
                                optionLabel="name"
                                placeholder="Select One"
                                className={classNames({ 'p-invalid': submitted && !admUser.valid })}
                            />
                            {submitted && !admUser.valid && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                        </div>                                                                                                                                        
                    </div>

                    <div className="flex flex-wrap gap-1">
                        {props.dialog ? (
                            <Button
                                label="Cancel"
                                icon="pi pi-times"
                                className="p-button-outlined p-button-secondary"
                                onClick={handleCancelClick}
                                outlined
                            />
                        ) : null}
                        <div className="flex-grow-1"></div>
                        <div className="flex flex-wrap gap-1">
                            {(props.userTip === 'CREATE') ? (
                                <Button
                                    label="Create"
                                    icon="pi pi-check"
                                    onClick={handleCreateClick}
                                    severity="success"
                                    outlined
                                />
                            ) : null}
                            {(props.userTip !== 'CREATE') ? (
                                <Button
                                    label="Delete"
                                    icon="pi pi-trash"
                                    onClick={showDeleteDialog}
                                    className="p-button-outlined p-button-danger"
                                    outlined
                                />
                            ) : null}                            
                            {(props.userTip !== 'CREATE') ? (
                                <Button
                                    label="Save"
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
                item={admUser.mail}
                onHide={hideDeleteDialog}
                onDelete={handleDeleteClick}
            />            
        </div>
    );
};

export default AdmUser;
