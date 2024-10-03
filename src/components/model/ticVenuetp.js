import React, { useState, useRef, useEffect } from 'react';
import { classNames } from 'primereact/utils';
import { TicVenuetpService } from "../../service/model/TicVenuetpService";
import './index.css';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from "primereact/toast";
import DeleteDialog from '../dialog/DeleteDialog';
import { translations } from "../../configs/translations";

const TicVenuetp = (props) => {
    const selectedLanguage = localStorage.getItem('sl')||'en'
    const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
    const [dropdownItem, setDropdownItem] = useState(null);
    const [dropdownItems, setDropdownItems] = useState(null);
    const [ticVenuetp, setTicVenuetp] = useState(props.ticVenuetp);
    const [submitted, setSubmitted] = useState(false);

    const toast = useRef(null);
    const items = [
        { name: `${translations[selectedLanguage].Yes}`, code: '1' },
        { name: `${translations[selectedLanguage].No}`, code: '0' }
    ];

    useEffect(() => {
        setDropdownItem(findDropdownItemByCode(props.ticVenuetp.valid));
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
                const ticVenuetpService = new TicVenuetpService();
                const data = await ticVenuetpService.postTicVenuetp(ticVenuetp);
                ticVenuetp.id = data
                props.handleDialogClose({ obj: ticVenuetp, venuetpTip: props.venuetpTip });
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
            const ticVenuetpService = new TicVenuetpService();
            await ticVenuetpService.putTicVenuetp(ticVenuetp);
            props.handleDialogClose({ obj: ticVenuetp, venuetpTip: props.venuetpTip });
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
            const ticVenuetpService = new TicVenuetpService();
            await ticVenuetpService.deleteTicVenuetp(ticVenuetp);
            props.handleDialogClose({ obj: ticVenuetp, venuetpTip: 'DELETE' });
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

        let _ticVenuetp = { ...ticVenuetp };
        _ticVenuetp[`${name}`] = val;
        // if (name===`textx`) _ticVenuetp[`text`] = val

        setTicVenuetp(_ticVenuetp);
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
                                value={ticVenuetp.code} onChange={(e) => onInputChange(e, "text", 'code')}
                                required
                                className={classNames({ 'p-invalid': submitted && !ticVenuetp.code })}
                            />
                            {submitted && !ticVenuetp.code && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                        </div>
                        <div className="field col-12 md:col-9">
                            <label htmlFor="text">{translations[selectedLanguage].Text}</label>
                            <InputText
                                id="text"
                                value={ticVenuetp.text} onChange={(e) => onInputChange(e, "text", 'text')}
                                required
                                className={classNames({ 'p-invalid': submitted && !ticVenuetp.text })}
                            />
                            {submitted && !ticVenuetp.text && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
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
                                className={classNames({ 'p-invalid': submitted && !ticVenuetp.valid })}
                            />
                            {submitted && !ticVenuetp.valid && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
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
                            {(props.venuetpTip === 'CREATE') ? (
                                <Button
                                    label={translations[selectedLanguage].Create}
                                    icon="pi pi-check"
                                    onClick={handleCreateClick}
                                    severity="success"
                                    outlined
                                />
                            ) : null}
                            {(props.venuetpTip !== 'CREATE') ? (
                                <Button
                                    label={translations[selectedLanguage].Delete}
                                    icon="pi pi-trash"
                                    onClick={showDeleteDialog}
                                    className="p-button-outlined p-button-danger"
                                    outlined
                                />
                            ) : null}                            
                            {(props.venuetpTip !== 'CREATE') ? (
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
                item={ticVenuetp.text}
                onHide={hideDeleteDialog}
                onDelete={handleDeleteClick}
            />
        </div>
    );
};

export default TicVenuetp;
