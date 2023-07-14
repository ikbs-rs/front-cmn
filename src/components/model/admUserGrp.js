import React, { useState, useRef, useEffect } from 'react';
import { classNames } from 'primereact/utils';
import { AdmUserGrpService } from "../../service/model/AdmUserGrpService";
import './index.css';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from "primereact/toast";

const AdmUserGrp = (props) => {
    const [dropdownItem, setDropdownItem] = useState(null);
    const [dropdownItems, setDropdownItems] = useState(null);
    const [admUserGrp, setAdmUserGrp] = useState(props.admUserGrp);
    const [submitted, setSubmitted] = useState(false);

    const toast = useRef(null);
    const items = [
        { name: 'Yes', code: '1' },
        { name: 'No', code: '0' }
    ];

    useEffect(() => {
        setDropdownItem(findDropdownItemByCode(props.admUserGrp.valid));
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
                const admUserGrpService = new AdmUserGrpService();
                const data = await admUserGrpService.postAdmUserGrp(admUserGrp);
                admUserGrp.id = data
                props.handleDialogClose({ obj: admUserGrp, userGrpTip: props.userGrpTip });
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
            const admUserGrpService = new AdmUserGrpService();
            await admUserGrpService.putAdmUserGrp(admUserGrp);
            props.handleDialogClose({ obj: admUserGrp, userGrpTip: props.userGrpTip });
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

    const handleDeleteClick = async () => {
        try {
            setSubmitted(true);
            const admUserGrpService = new AdmUserGrpService();
            await admUserGrpService.deleteAdmUserGrp(admUserGrp);
            props.handleDialogClose({ obj: admUserGrp, userGrpTip: 'DELETE' });
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

    const onInputChange = (e, type, name) => {
        let val = ''
        if (type === "options") {
            setDropdownItem(e.value);
            val = (e.target && e.target.value && e.target.value.code) || '';
        } else {
            val = (e.target && e.target.value) || '';
        }

        let _admUserGrp = { ...admUserGrp };
        console.log("onInputChange", val)
        _admUserGrp[`${name}`] = val;

        setAdmUserGrp(_admUserGrp);
    };

    return (
        <div className="grid">
            <Toast ref={toast} />
            <div className="col-12">
                <div className="card">
                    <div className="p-fluid formgrid grid">
                        <div className="field col-12 md:col-6">
                            <label htmlFor="code">Code</label>
                            <InputText id="code" autoFocus
                                value={admUserGrp.code} onChange={(e) => onInputChange(e, "text", 'code')}
                                required
                                className={classNames({ 'p-invalid': submitted && !admUserGrp.code })}
                            />
                            {submitted && !admUserGrp.code && <small className="p-error">Code is required.</small>}
                        </div>
                        <div className="field col-12 md:col-6">
                            <label htmlFor="text">Text</label>
                            <InputText
                                id="text"
                                value={admUserGrp.text} onChange={(e) => onInputChange(e, "text", 'text')}
                                required
                                className={classNames({ 'p-invalid': submitted && !admUserGrp.text })}
                            />
                            {submitted && !admUserGrp.text && <small className="p-error">Text is required.</small>}
                        </div>
                        <div className="field col-12 md:col-3">
                            <label htmlFor="valid">Valid</label>
                            <Dropdown id="valid"
                                value={dropdownItem}
                                options={dropdownItems}
                                onChange={(e) => onInputChange(e, "options", 'valid')}
                                required
                                optionLabel="name"
                                placeholder="Select One"
                                className={classNames({ 'p-invalid': submitted && !admUserGrp.valid })}
                            />
                            {submitted && !admUserGrp.valid && <small className="p-error">Valid is required.</small>}
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
                            {(props.userGrpTip === 'CREATE') ? (
                                <Button
                                    label="Create"
                                    icon="pi pi-check"
                                    onClick={handleCreateClick}
                                    severity="success"
                                    outlined
                                />
                            ) : null}
                            {(props.userGrpTip !== 'CREATE') ? (
                                <Button
                                    label="Save"
                                    icon="pi pi-check"
                                    onClick={handleSaveClick}
                                    severity="success"
                                    outlined
                                />
                            ) : null}
                            {(props.userGrpTip !== 'CREATE') ? (
                                <Button
                                    label="Delete"
                                    icon="pi pi-trash"
                                    onClick={handleDeleteClick}
                                    className="p-button-outlined p-button-danger"
                                    outlined
                                />
                            ) : null}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdmUserGrp;
