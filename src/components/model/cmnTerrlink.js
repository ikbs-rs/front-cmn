import React, { useState, useRef, useEffect } from 'react';
import { classNames } from 'primereact/utils';
import { CmnTerrlinkService } from "../../service/model/CmnTerrlinkService";
import { CmnTerrService } from "../../service/model/CmnTerrService";
import './index.css';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Toast } from "primereact/toast";
import DeleteDialog from '../dialog/DeleteDialog';
import { translations } from "../../configs/translations";
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from "primereact/calendar";
import DateFunction from "../../utilities/DateFunction"

const CmnTerrlink = (props) => {

    const selectedLanguage = localStorage.getItem('sl') || 'en'
    const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
    const [cmnTerrlink, setCmnTerrlink] = useState(props.cmnTerrlink);
    const [submitted, setSubmitted] = useState(false);
    const [ddCmnTerrlinkItem, setDdCmnTerrlinkItem] = useState(null);
    const [ddCmnTerrlinkItems, setDdCmnTerrlinkItems] = useState(null);
    const [cmnTerrlinkItem, setCmnTerrlinkItem] = useState(null);
    const [cmnTerrlinkItems, setCmnTerrlinkItems] = useState(null);
    const [begda, setBegda] = useState(new Date(DateFunction.formatJsDate(props.cmnTerrlink.begda || DateFunction.currDate())));
    const [endda, setEndda] = useState(new Date(DateFunction.formatJsDate(props.cmnTerrlink.endda || '99991231')))

    const calendarRef = useRef(null);

    const toast = useRef(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const cmnTerrService = new CmnTerrService();
                const data = await cmnTerrService.getCmnTerrs();

                setCmnTerrlinkItems(data)
                //console.log("******************", cmnTerrlinkItem)

                const dataDD = data.map(({ textx, id }) => ({ name: textx, code: id }));
                setDdCmnTerrlinkItems(dataDD);
                setDdCmnTerrlinkItem(dataDD.find((item) => item.code === props.cmnTerrlink.terr1) || null);
                if (props.cmnTerrlink.terr1) {
                    const foundItem = data.find((item) => item.id === props.cmnTerrlink.terr1);
                    setCmnTerrlinkItem(foundItem || null);
                    cmnTerrlink.cterr1 = foundItem.code
                    cmnTerrlink.nterr1 = foundItem.textx
                }

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
            cmnTerrlink.begda = DateFunction.formatDateToDBFormat(DateFunction.dateGetValue(begda));
            cmnTerrlink.endda = DateFunction.formatDateToDBFormat(DateFunction.dateGetValue(endda));
            const cmnTerrlinkService = new CmnTerrlinkService();
            const data = await cmnTerrlinkService.postCmnTerrlink(cmnTerrlink);
            cmnTerrlink.id = data
            props.handleDialogClose({ obj: cmnTerrlink, terrlinkTip: props.terrlinkTip });
            props.setVisible(false);
        } catch (err) {
            toast.current.show({
                severity: "error",
                summary: "CmnTerrlink ",
                detail: `${err.response.data.error}`,
                life: 5000,
            });
        }
    };

    const handleSaveClick = async () => {
        try {
            setSubmitted(true);
            cmnTerrlink.begda = DateFunction.formatDateToDBFormat(DateFunction.dateGetValue(begda));
            cmnTerrlink.endda = DateFunction.formatDateToDBFormat(DateFunction.dateGetValue(endda));            
            const cmnTerrlinkService = new CmnTerrlinkService();

            await cmnTerrlinkService.putCmnTerrlink(cmnTerrlink);
            props.handleDialogClose({ obj: cmnTerrlink, terrlinkTip: props.terrlinkTip });
            props.setVisible(false);
        } catch (err) {
            toast.current.show({
                severity: "error",
                summary: "CmnTerrlink ",
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
            const cmnTerrlinkService = new CmnTerrlinkService();
            await cmnTerrlinkService.deleteCmnTerrlink(cmnTerrlink);
            props.handleDialogClose({ obj: cmnTerrlink, terrlinkTip: 'DELETE' });
            props.setVisible(false);
            hideDeleteDialog();
        } catch (err) {
            toast.current.show({
                severity: "error",
                summary: "CmnTerrlink ",
                detail: `${err.response.data.error}`,
                life: 5000,
            });
        }
    };

    const onInputChange = (e, type, name, a) => {
        let val = ''

        if (type === "options") {
            val = (e.target && e.target.value && e.target.value.code) || '';
            setDdCmnTerrlinkItem(e.value);
            const foundItem = cmnTerrlinkItems.find((item) => item.id === val);
            setCmnTerrlinkItem(foundItem || null);
            cmnTerrlink.nterr1 = e.value.name
            cmnTerrlink.cterr1 = foundItem.code
        } else if (type === "Calendar") {
            const dateVal = DateFunction.dateGetValue(e.value)
            val = (e.target && e.target.value) || '';
            switch (name) {
                case "begda":
                    setBegda(e.value)
                    //cmnTerrlink.begda = DateFunction.formatDateToDBFormat(dateVal)
                    break;
                case "endda":
                    setEndda(e.value)
                    //cmnTerrlink.endda = DateFunction.formatDateToDBFormat(dateVal)
                    break;
                default:
                    console.error("Pogresan naziv polja")
            }
        } else {
            val = (e.target && e.target.value) || '';
        }
        let _cmnTerrlink = { ...cmnTerrlink };
        _cmnTerrlink[`${name}`] = val;
        setCmnTerrlink(_cmnTerrlink);
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
                                value={props.cmnTerr.code}
                                disabled={true}
                            />
                        </div>
                        <div className="field col-12 md:col-7">
                            <label htmlFor="text">{translations[selectedLanguage].Text}</label>
                            <InputText
                                id="text"
                                value={props.cmnTerr.text}
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
                            <label htmlFor="terr1">{translations[selectedLanguage].Attribute} *</label>
                            <Dropdown id="terr1"
                                value={ddCmnTerrlinkItem}
                                options={ddCmnTerrlinkItems}
                                onChange={(e) => onInputChange(e, "options", 'terr1')}
                                required
                                optionLabel="name"
                                placeholder="Select One"
                                className={classNames({ 'p-invalid': submitted && !cmnTerrlink.terr1 })}
                            />
                            {submitted && !cmnTerrlink.terr1 && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                        </div>
                    </div>

                    <div className="p-fluid formgrid grid">
                        <div className="field col-12 md:col-11">
                            <label htmlFor="text">{translations[selectedLanguage].Value}</label>
                            <InputText
                                id="text"
                                value={cmnTerrlink.text} onChange={(e) => onInputChange(e, "text", 'text')}
                            />
                        </div>
                    </div>
                    <div className="p-fluid formgrid grid">
                        <div className="field col-12 md:col-5">
                            <label htmlFor="begda">{translations[selectedLanguage].Begda} *</label>
                            <Calendar
                                value={begda}
                                onChange={(e) => onInputChange(e, "Calendar", 'begda', this)}
                                showIcon
                                dateFormat="dd.mm.yy"
                            />

                        </div>
                    </div>
                    <div className="p-fluid formgrid grid">
                        <div className="field col-12 md:col-5">
                            <label htmlFor="roenddal">{translations[selectedLanguage].Endda} *</label>
                            <Calendar
                                value={endda}
                                onChange={(e) => onInputChange(e, "Calendar", 'endda')}
                                showIcon
                                dateFormat="dd.mm.yy"
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
                            {(props.terrlinkTip === 'CREATE') ? (
                                <Button
                                    label={translations[selectedLanguage].Create}
                                    icon="pi pi-check"
                                    onClick={handleCreateClick}
                                    severity="success"
                                    outlined
                                />
                            ) : null}
                            {(props.terrlinkTip !== 'CREATE') ? (
                                <Button
                                    label={translations[selectedLanguage].Delete}
                                    icon="pi pi-trash"
                                    onClick={showDeleteDialog}
                                    className="p-button-outlined p-button-danger"
                                    outlined
                                />
                            ) : null}
                            {(props.terrlinkTip !== 'CREATE') ? (
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
                inCmnTerrlink="delete"
                item={cmnTerrlink.roll}
                onHide={hideDeleteDialog}
                onDelete={handleDeleteClick}
            />
        </div>
    );
};

export default CmnTerrlink;
