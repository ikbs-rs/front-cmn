import React, { useState, useRef, useEffect } from 'react';
import { classNames } from 'primereact/utils';
import { AdmMessageService } from "../../service/model/AdmMessageService";
import './index.css';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from "primereact/toast";

const AdmMessage = (props) => {
    const [admMessage, setAdmMessage] = useState(props.admMessage);
    const [submitted, setSubmitted] = useState(false);

    const toast = useRef(null);
    const items = [
        { name: 'Yes', code: '1' },
        { name: 'No', code: '0' }
    ];

    const handleCancelClick = () => {
        props.setVisible(false);
    };

    const handleCreateClick = async () => {
        try {
            setSubmitted(true);            
                const admMessageService = new AdmMessageService();
                const data = await admMessageService.postAdmMessage(admMessage);
                admMessage.id = data
                props.handleDialogClose({ obj: admMessage, messageTip: props.messageTip });
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
            const admMessageService = new AdmMessageService();
            await admMessageService.putAdmMessage(admMessage);
            props.handleDialogClose({ obj: admMessage, messageTip: props.messageTip });
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
            const admMessageService = new AdmMessageService();
            await admMessageService.deleteAdmMessage(admMessage);
            props.handleDialogClose({ obj: admMessage, messageTip: 'DELETE' });
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
            val = (e.target && e.target.value) || '';

        let _admMessage = { ...admMessage };
        console.log("onInputChange", val)
        _admMessage[`${name}`] = val;

        setAdmMessage(_admMessage);
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
                                value={admMessage.code} onChange={(e) => onInputChange(e, "text", 'code')}
                                required
                                className={classNames({ 'p-invalid': submitted && !admMessage.code })}
                            />
                            {submitted && !admMessage.code && <small className="p-error">Code is required.</small>}
                        </div>
                        <div className="field col-12 md:col-6">
                            <label htmlFor="text">Text</label>
                            <InputText
                                id="text"
                                value={admMessage.text} onChange={(e) => onInputChange(e, "text", 'text')}
                                required
                                className={classNames({ 'p-invalid': submitted && !admMessage.text })}
                            />
                            {submitted && !admMessage.text && <small className="p-error">Text is required.</small>}
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
                            {(props.messageTip === 'CREATE') ? (
                                <Button
                                    label="Create"
                                    icon="pi pi-check"
                                    onClick={handleCreateClick}
                                    severity="success"
                                    outlined
                                />
                            ) : null}
                            {(props.messageTip !== 'CREATE') ? (
                                <Button
                                    label="Save"
                                    icon="pi pi-check"
                                    onClick={handleSaveClick}
                                    severity="success"
                                    outlined
                                />
                            ) : null}
                            {(props.messageTip !== 'CREATE') ? (
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

export default AdmMessage;
