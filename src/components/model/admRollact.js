import React, { useState, useRef, useEffect } from 'react';
import { classNames } from 'primereact/utils';
import { AdmRollactService } from "../../service/model/AdmRollactService";
import './index.css';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Toast } from "primereact/toast";
import DeleteDialog from '../dialog/DeleteDialog';
import { translations } from "../../configs/translations";
import { Dropdown } from 'primereact/dropdown';
import { CmnLoctpService } from "../../service/model/CmnLoctpService"
import { InputSwitch } from "primereact/inputswitch";

const AdmRollact = (props) => {
    const selectedLanguage = localStorage.getItem('sl') || 'en'
    const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
    const [admRollact, setAdmRollact] = useState(props.admRollact);
    const [submitted, setSubmitted] = useState(false);
    const [ddActionItem, setDdActionItem] = useState(null);
    const [ddActionItems, setDdActionItems] = useState(null);
    const [cre_action, setCre_action] = useState(props.admRollact.cre_action == 1);
    const [upd_action, setUpd_action] = useState(props.admRollact.upd_action == 1);
    const [del_action, setDel_action] = useState(props.admRollact.del_action == 1);
    const [exe_action, setExe_action] = useState(props.admRollact.exe_action == 1);
    const [all_action, setAll_action] = useState(props.admRollact.all_action == 1);

    const toast = useRef(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const admActionService = new CmnLoctpService();
                const data = await admActionService.getAdmActions();
                const dataDD = data.map(({ textx, id }) => ({ name: textx, code: id }));
                setDdActionItems(dataDD);
                setDdActionItem(dataDD.find((item) => item.code === props.admRollact.action) || null);
            } catch (error) {
                console.error(error);
                // Obrada greške ako je potrebna
            }
        }
        fetchData();
    }, []);
    // Autocomplit>

    const handleCancelClick = () => {
        props.setVisible(false);
    };

    const handleCreateClick = async () => {
        try {
            setSubmitted(true);
            admRollact.cre_action = cre_action ? 1 : null;

            const admRollactService = new AdmRollactService();
            const data = await admRollactService.postAdmRollAct(admRollact);
            admRollact.id = data
            props.handleDialogClose({ obj: admRollact, rollactTip: props.rollactTip });
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
            admRollact.cre_action = cre_action ? 1 : null;
            const admRollactService = new AdmRollactService();
            await admRollactService.putAdmRollAct(admRollact);
            props.handleDialogClose({ obj: admRollact, rollactTip: props.rollactTip });
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
            const admRollactService = new AdmRollactService();
            await admRollactService.deleteAdmRollAct(admRollact);
            props.handleDialogClose({ obj: admRollact, rollactTip: 'DELETE' });
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
            setDdActionItem(e.value);
            admRollact.otext = e.value.name
            admRollact.ocode = e.value.code
            val = (e.target && e.target.value && e.target.value.code) || '';
        } else if (type === "inputSwitch") {
            val = (e.target && e.target.value)?1:null
            switch (name) {
                case "cre_action":
                    setCre_action(e.value)
                  break;
                case "upd_action":
                    setUpd_action(e.value)
                  break;
                case "del_action":
                    setDel_action(e.value)
                  break;
                case "exe_action":
                    setExe_action(e.value)
                  break;
                case "all_action":
                    setAll_action(e.value)
                  break;
                default:
                  console.error("Pogresan naziv polja")
              }
        } else {
            val = (e.target && e.target.value) || '';
        }

        let _admRollact = { ...admRollact };
        _admRollact[`${name}`] = val;

        setAdmRollact(_admRollact);
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
                        <div className="field col-12 md:col-7">
                            <label htmlFor="roll">{translations[selectedLanguage].Action} *</label>
                            <Dropdown id="action"
                                value={ddActionItem}
                                options={ddActionItems}
                                onChange={(e) => onInputChange(e, "options", 'action')}
                                required
                                optionLabel="name"
                                placeholder="Select One"
                                className={classNames({ 'p-invalid': submitted && !admRollact.action })}
                            />
                            {submitted && !admRollact.action && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-1">
                        <div className="p-fluid formgrid grid">
                            <div className="field col-12 md:col-7">
                                <label htmlFor="roll">{translations[selectedLanguage].Creation}</label>
                                <InputSwitch inputId="cre_action" checked={cre_action} onChange={(e) => onInputChange(e, "inputSwitch", 'cre_action')} />
                            </div>
                        </div>
                        <div className="p-fluid formgrid grid">
                            <div className="field col-12 md:col-7">
                                <label htmlFor="roll">{translations[selectedLanguage].Updation}</label>
                                <InputSwitch inputId="upd_action" checked={upd_action} onChange={(e) => onInputChange(e, "inputSwitch", 'upd_action')} />
                            </div>
                        </div>   
                        <div className="p-fluid formgrid grid">
                            <div className="field col-12 md:col-7">
                                <label htmlFor="roll">{translations[selectedLanguage].Deletion}</label>
                                <InputSwitch inputId="del_action" checked={del_action} onChange={(e) => onInputChange(e, "inputSwitch", 'del_action')} />
                            </div>
                        </div>  
                        <div className="p-fluid formgrid grid">
                            <div className="field col-12 md:col-7">
                                <label htmlFor="roll">{translations[selectedLanguage].Execute}</label>
                                <InputSwitch inputId="exe_action" checked={exe_action} onChange={(e) => onInputChange(e, "inputSwitch", 'exe_action')} />
                            </div>
                        </div>   
                        <div className="p-fluid formgrid grid">
                            <div className="field col-12 md:col-7">
                                <label htmlFor="roll">{translations[selectedLanguage].All}</label>
                                <InputSwitch inputId="all_action" checked={all_action} onChange={(e) => onInputChange(e, "inputSwitch", 'all_action')} />
                            </div>
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
                            {(props.rollactTip === 'CREATE') ? (
                                <Button
                                    label={translations[selectedLanguage].Create}
                                    icon="pi pi-check"
                                    onClick={handleCreateClick}
                                    severity="success"
                                    outlined
                                />
                            ) : null}
                            {(props.rollactTip !== 'CREATE') ? (
                                <Button
                                    label={translations[selectedLanguage].Delete}
                                    icon="pi pi-trash"
                                    onClick={showDeleteDialog}
                                    className="p-button-outlined p-button-danger"
                                    outlined
                                />
                            ) : null}
                            {(props.rollactTip !== 'CREATE') ? (
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
                item={admRollact.roll}
                onHide={hideDeleteDialog}
                onDelete={handleDeleteClick}
            />
        </div>
    );
};

export default AdmRollact;
