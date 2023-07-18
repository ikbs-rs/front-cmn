import React, { useState, useRef, useEffect } from 'react';
import { classNames } from 'primereact/utils';
import { AdmRolllinkService } from "../../service/model/AdmRolllinkService";
import './index.css';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Toast } from "primereact/toast";
import DeleteDialog from '../dialog/DeleteDialog';
import { Dropdown } from 'primereact/dropdown';
import { AdmRollService } from "../../service/model/AdmRollService";
import { translations } from "../../configs/translations";

const AdmRolllink = (props) => {
    const selectedLanguage = localStorage.getItem('sl')||'en'
    const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
    const [admRolllink, setAdmRolllink] = useState(props.admRolllink);
    const [submitted, setSubmitted] = useState(false);
    const [ddRollItem, setDdRollItem] = useState(null);
    const [ddRollItems, setDdRollItems] = useState(null);

    const toast = useRef(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const admRollService = new AdmRollService();
                const data = await admRollService.getAdmRollX();
                const dataDD = data.map(({ textx, id }) => ({ name: textx, code: id }));
                setDdRollItems(dataDD);
                setDdRollItem(dataDD.find((item) => item.code === props.admRolllink.roll1) || null);
            } catch (error) {
                console.error(error);
                // Obrada greške ako je potrebna
            }
        }
        fetchData();
    }, []);

    const handleCancelClick = () => {
        props.setVisible(false);
    };

    const handleCreateClick = async () => {
        try {
            setSubmitted(true);
            const admRolllinkService = new AdmRolllinkService();
            const data = await admRolllinkService.postAdmRolllink(admRolllink);
            admRolllink.id = data
            props.handleDialogClose({ obj: admRolllink, rollLinkTip: props.rollLinkTip });
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
            const admRolllinkService = new AdmRolllinkService();
            await admRolllinkService.putAdmRolllink(admRolllink);
            props.handleDialogClose({ obj: admRolllink, rollLinkTip: props.rollLinkTip });
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
            const admRolllinkService = new AdmRolllinkService();
            await admRolllinkService.deleteAdmRolllink(admRolllink);
            props.handleDialogClose({ obj: admRolllink, rollLinkTip: 'DELETE' });
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
            setDdRollItem(e.value);
            admRolllink.otext= e.value.name
            admRolllink.ocode= e.value.code
            val = (e.target && e.target.value && e.target.value.code) || '';
        } else {
            val = (e.target && e.target.value) || '';
        }

        let _admRolllink = { ...admRolllink };
        _admRolllink[`${name}`] = val;

        setAdmRolllink(_admRolllink);
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
                            <InputText id="code"
                                value={props.admRoll.code}
                                disabled={true}
                            />
                        </div>
                        <div className="field col-12 md:col-7">
                            <label htmlFor="text">{translations[selectedLanguage].Text}</label>
                            <InputText
                                id="textx"
                                value={props.admRoll.textx}
                                disabled={true}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-12">
                <div className="card">
                    <div className="p-fluid formgrid grid">
                        <div className="field col-12 md:col-6">
                            <label htmlFor="roll1">{translations[selectedLanguage].Roll} *</label>
                            <Dropdown id="roll1"
                                value={ddRollItem}
                                options={ddRollItems}
                                onChange={(e) => onInputChange(e, "options", 'roll1')}
                                required
                                optionLabel="name"
                                placeholder="Select One"
                                className={classNames({ 'p-invalid': submitted && !admRolllink.roll1 })}
                            />
                            {submitted && !admRolllink.roll1 && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                        </div>
                        <div className="field col-12 md:col-12">
                            <label htmlFor="link">{translations[selectedLanguage].Link}</label>
                            <InputText
                                id="link"
                                value={admRolllink.link} onChange={(e) => onInputChange(e, "text", 'link')}
                            />
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
                            {(props.rollLinkTip === 'CREATE') ? (
                                <Button
                                    label={translations[selectedLanguage].Create}
                                    icon="pi pi-check"
                                    onClick={handleCreateClick}
                                    severity="success"
                                    outlined
                                />
                            ) : null}
                            {(props.rollLinkTip !== 'CREATE') ? (
                                <Button
                                    label={translations[selectedLanguage].Delete}
                                    icon="pi pi-trash"
                                    onClick={showDeleteDialog}
                                    className="p-button-outlined p-button-danger"
                                    outlined
                                />
                            ) : null}
                            {(props.rollLinkTip !== 'CREATE') ? (
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
                item={admRolllink.roll1}
                onHide={hideDeleteDialog}
                onDelete={handleDeleteClick}
            />
        </div>
    );
};

export default AdmRolllink;
