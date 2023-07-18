import React, { useState, useRef, useEffect } from 'react';
import { classNames } from 'primereact/utils';
import { CmnLinkService } from "../../service/model/CmnLinkService";
import './index.css';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from "primereact/toast";
import DeleteDialog from '../dialog/DeleteDialog';
import { translations } from "../../configs/translations";
import { CmnObjtpService } from "../../service/model/CmnObjtpService"

const CmnLink = (props) => {
    const selectedLanguage = localStorage.getItem('sl')||'en'
    const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
    const [dropdownItem, setDropdownItem] = useState(null);
    const [dropdownItems, setDropdownItems] = useState(null);
    const [cmnLink, setCmnLink] = useState(props.cmnLink);
    const [submitted, setSubmitted] = useState(false);
    const [ddObjtp1Item, setDdObjtp1Item] = useState(null);
    const [ddObjtp1Items, setDdObjtp1Items] = useState(null);   
    const [ddObjtp2Item, setDdObjtp2Item] = useState(null);
    const [ddObjtp2Items, setDdObjtp2Items] = useState(null);  

    const toast = useRef(null);
    const items = [
        { name: `${translations[selectedLanguage].Yes}`, code: '1' },
        { name: `${translations[selectedLanguage].No}`, code: '0' }
    ];

    useEffect(() => {
        async function fetchData() {
            try {
                const cmnObjtpService = new CmnObjtpService();
                const data = await cmnObjtpService.getCmnObjtps();
                const dataDD = data.map(({ textx, id }) => ({ name: textx, code: id }));
                setDdObjtp1Items(dataDD);
                setDdObjtp1Item(dataDD.find((item) => item.code === props.cmnLink.objtp1) || null);
            } catch (error) {
                console.error(error);
                // Obrada greške ako je potrebna
            }
        }
        fetchData();
    }, []);    

    useEffect(() => {
        async function fetchData() {
            try {
                const cmnObjtpService = new CmnObjtpService();
                const data = await cmnObjtpService.getCmnObjtps();
                const dataDD = data.map(({ textx, id }) => ({ name: textx, code: id }));
                setDdObjtp2Items(dataDD);
                setDdObjtp2Item(dataDD.find((item) => item.code === props.cmnLink.objtp2) || null);
            } catch (error) {
                console.error(error);
                // Obrada greške ako je potrebna
            }
        }
        fetchData();
    }, []);     

    useEffect(() => {
        setDropdownItem(findDropdownItemByCode(props.cmnLink.valid));
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
                const cmnLinkService = new CmnLinkService();
                const data = await cmnLinkService.postCmnLink(cmnLink);
                cmnLink.id = data
                props.handleDialogClose({ obj: cmnLink, linkTip: props.linkTip });
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
            const cmnLinkService = new CmnLinkService();
            await cmnLinkService.putCmnLink(cmnLink);
            props.handleDialogClose({ obj: cmnLink, linkTip: props.linkTip });
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
            const cmnLinkService = new CmnLinkService();
            await cmnLinkService.deleteCmnLink(cmnLink);
            props.handleDialogClose({ obj: cmnLink, linkTip: 'DELETE' });
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
            if (name==='objtp1') {
                setDdObjtp1Item(e.value);
                cmnLink.nobjtp1 = e.value.name
            } else if (name==='objtp2') {
                setDdObjtp2Item(e.value);
                cmnLink.nobjtp2 = e.value.name
            } else {
                setDropdownItem(e.value);
            }
            val = (e.target && e.target.value && e.target.value.code) || '';
        } else {
            val = (e.target && e.target.value) || '';
        }

        let _cmnLink = { ...cmnLink };
        _cmnLink[`${name}`] = val;
        if (name===`textx`) _cmnLink[`text`] = val

        setCmnLink(_cmnLink);
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
                                value={cmnLink.code} onChange={(e) => onInputChange(e, "text", 'code')}
                                required
                                className={classNames({ 'p-invalid': submitted && !cmnLink.code })}
                            />
                            {submitted && !cmnLink.code && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                        </div>
                        <div className="field col-12 md:col-9">
                            <label htmlFor="textx">{translations[selectedLanguage].Text}</label>
                            <InputText
                                id="textx"
                                value={cmnLink.textx} onChange={(e) => onInputChange(e, "text", 'textx')}
                                required
                                className={classNames({ 'p-invalid': submitted && !cmnLink.textx })}
                            />
                            {submitted && !cmnLink.textx && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                        </div>  
                        <div className="field col-12 md:col-8">
                            <label htmlFor="objtp1">{translations[selectedLanguage].Objtp1} *</label>
                            <Dropdown id="objtp1"
                                value={ddObjtp1Item}
                                options={ddObjtp1Items}
                                onChange={(e) => onInputChange(e, "options", 'objtp1')}
                                required
                                optionLabel="name"
                                placeholder="Select One"
                                className={classNames({ 'p-invalid': submitted && !cmnLink.objtp1 })}
                            />
                            {submitted && !cmnLink.objtp1 && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                        </div>    
                        <div className="field col-12 md:col-8">
                            <label htmlFor="objtp2">{translations[selectedLanguage].Objtp2} *</label>
                            <Dropdown id="objtp2"
                                value={ddObjtp2Item}
                                options={ddObjtp2Items}
                                onChange={(e) => onInputChange(e, "options", 'objtp2')}
                                required
                                optionLabel="name"
                                placeholder="Select One"
                                className={classNames({ 'p-invalid': submitted && !cmnLink.objtp2 })}
                            />
                            {submitted && !cmnLink.objtp2 && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
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
                                className={classNames({ 'p-invalid': submitted && !cmnLink.valid })}
                            />
                            {submitted && !cmnLink.valid && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
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
                            {(props.linkTip === 'CREATE') ? (
                                <Button
                                    label={translations[selectedLanguage].Create}
                                    icon="pi pi-check"
                                    onClick={handleCreateClick}
                                    severity="success"
                                    outlined
                                />
                            ) : null}
                            {(props.linkTip !== 'CREATE') ? (
                                <Button
                                    label={translations[selectedLanguage].Delete}
                                    icon="pi pi-trash"
                                    onClick={showDeleteDialog}
                                    className="p-button-outlined p-button-danger"
                                    outlined
                                />
                            ) : null}                            
                            {(props.linkTip !== 'CREATE') ? (
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
                item={cmnLink.text}
                onHide={hideDeleteDialog}
                onDelete={handleDeleteClick}
            />
        </div>
    );
};

export default CmnLink;
