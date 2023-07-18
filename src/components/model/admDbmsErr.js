import React, { useState, useRef, useEffect } from 'react';
import { classNames } from 'primereact/utils';
import { AdmDbmsErrService } from "../../service/model/AdmDbmsErrService";
import './index.css';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Toast } from "primereact/toast";
import DeleteDialog from '../dialog/DeleteDialog';

const AdmDbmsErr = (props) => {
    const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
    const [admDbmsErr, setAdmDbmsErr] = useState(props.admDbmsErr);
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
            const admDbmsErrService = new AdmDbmsErrService();
            const data = await admDbmsErrService.postAdmDbmsErr(admDbmsErr);
            admDbmsErr.id = data
            props.handleDialogClose({ obj: admDbmsErr, dbmsErrTip: props.dbmsErrTip });
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
            const admDbmsErrService = new AdmDbmsErrService();
            await admDbmsErrService.putAdmDbmsErr(admDbmsErr);
            props.handleDialogClose({ obj: admDbmsErr, dbmsErrTip: props.dbmsErrTip });
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
            const admDbmsErrService = new AdmDbmsErrService();
            await admDbmsErrService.deleteAdmDbmsErr(admDbmsErr);
            props.handleDialogClose({ obj: admDbmsErr, dbmsErrTip: 'DELETE' });
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
        val = (e.target && e.target.value) || '';

        let _admDbmsErr = { ...admDbmsErr };
        console.log("onInputChange", val)
        _admDbmsErr[`${name}`] = val;

        setAdmDbmsErr(_admDbmsErr);
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
                        <div className="field col-12 md:col-6">
                            <label htmlFor="code">Code</label>
                            <InputText id="code" autoFocus
                                value={admDbmsErr.code} onChange={(e) => onInputChange(e, "text", 'code')}
                                required
                                className={classNames({ 'p-invalid': submitted && !admDbmsErr.code })}
                            />
                            {submitted && !admDbmsErr.code && <small className="p-error">Code is required.</small>}
                        </div>
                        <div className="field col-12 md:col-8">
                            <label htmlFor="text">Text</label>
                            <InputText
                                id="text"
                                value={admDbmsErr.text} onChange={(e) => onInputChange(e, "text", 'text')}
                                required
                                className={classNames({ 'p-invalid': submitted && !admDbmsErr.text })}
                            />
                            {submitted && !admDbmsErr.text && <small className="p-error">Text is required.</small>}
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
                            {(props.dbmsErrTip === 'CREATE') ? (
                                <Button
                                    label="Create"
                                    icon="pi pi-check"
                                    onClick={handleCreateClick}
                                    severity="success"
                                    outlined
                                />
                            ) : null}
                            {(props.dbmsErrTip !== 'CREATE') ? (
                                <Button
                                    label="Delete"
                                    icon="pi pi-trash"
                                    onClick={showDeleteDialog}
                                    className="p-button-outlined p-button-danger"
                                    outlined
                                />
                            ) : null}                            
                            {(props.dbmsErrTip !== 'CREATE') ? (
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
                item={admDbmsErr.text}
                onHide={hideDeleteDialog}
                onDelete={handleDeleteClick}
            />            
        </div>
    );
};

export default AdmDbmsErr;
