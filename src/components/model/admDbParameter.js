import React, { useState, useRef, useEffect } from 'react';
import { classNames } from 'primereact/utils';
import { AdmDbParameterService } from "../../service/model/AdmDbParameterService";
import './index.css';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Toast } from "primereact/toast";
import DeleteDialog from '../dialog/DeleteDialog';

const AdmDbParameter = (props) => {
    const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
    const [admDbParameter, setAdmDbParameter] = useState(props.admDbParameter);
    const [submitted, setSubmitted] = useState(false);

    const toast = useRef(null);

    const handleCancelClick = () => {
        props.setVisible(false);
    };

    const handleCreateClick = async () => {
        try {
            setSubmitted(true);
            const admDbParameterService = new AdmDbParameterService();
            const data = await admDbParameterService.postAdmDbParameter(admDbParameter);
            admDbParameter.id = data
            props.handleDialogClose({ obj: admDbParameter, dbParameterTip: props.dbParameterTip });
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
            const admDbParameterService = new AdmDbParameterService();
            await admDbParameterService.putAdmDbParameter(admDbParameter);
            props.handleDialogClose({ obj: admDbParameter, dbParameterTip: props.dbParameterTip });
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
            const admDbParameterService = new AdmDbParameterService();
            await admDbParameterService.deleteAdmDbParameter(admDbParameter);
            props.handleDialogClose({ obj: admDbParameter, dbParameterTip: 'DELETE' });
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

        let _admDbParameter = { ...admDbParameter };
        console.log("onInputChange", val)
        _admDbParameter[`${name}`] = val;

        setAdmDbParameter(_admDbParameter);
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
                                value={admDbParameter.code} onChange={(e) => onInputChange(e, "text", 'code')}
                                required
                                className={classNames({ 'p-invalid': submitted && !admDbParameter.code })}
                            />
                            {submitted && !admDbParameter.code && <small className="p-error">Code is required.</small>}
                        </div>
                        <div className="field col-12 md:col-6">
                            <label htmlFor="text">Text</label>
                            <InputText
                                id="text"
                                value={admDbParameter.text} onChange={(e) => onInputChange(e, "text", 'text')}
                                required
                                className={classNames({ 'p-invalid': submitted && !admDbParameter.text })}
                            />
                            {submitted && !admDbParameter.text && <small className="p-error">Text is required.</small>}
                        </div>
                        <div className="field col-12 md:col-6">
                            <label htmlFor="text">Comment</label>
                            <InputText
                                id="comment"
                                value={admDbParameter.comment} onChange={(e) => onInputChange(e, "text", 'comment')}
                            />
                        </div>
                        <div className="field col-12 md:col-6">
                            <label htmlFor="text">Version</label>
                            <InputText
                                id="version"
                                value={admDbParameter.version} onChange={(e) => onInputChange(e, "text", 'version')}
                                required
                                className={classNames({ 'p-invalid': submitted && !admDbParameter.version })}
                            />
                            {submitted && !admDbParameter.version && <small className="p-error">Version is required.</small>}
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
                            {(props.dbParameterTip === 'CREATE') ? (
                                <Button
                                    label="Create"
                                    icon="pi pi-check"
                                    onClick={handleCreateClick}
                                    severity="success"
                                    outlined
                                />
                            ) : null}
                            {(props.dbParameterTip !== 'CREATE') ? (
                                <Button
                                    label="Delete"
                                    icon="pi pi-trash"
                                    onClick={showDeleteDialog}
                                    className="p-button-outlined p-button-danger"
                                    outlined
                                />
                            ) : null}                            
                            {(props.dbParameterTip !== 'CREATE') ? (
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
                item={admDbParameter.text}
                onHide={hideDeleteDialog}
                onDelete={handleDeleteClick}
            />            
        </div>
    );
};

export default AdmDbParameter;
