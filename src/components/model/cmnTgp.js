import React, { useState, useRef, useEffect } from 'react';
import { classNames } from 'primereact/utils';
import { CmnTgpService } from "../../service/model/CmnTgpService";
import { CmnTerrService } from "../../service/model/CmnTerrService";
import './index.css';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from "primereact/toast";
import DeleteDialog from '../dialog/DeleteDialog';
import { translations } from "../../configs/translations";
import env from "../../configs/env"
import axios from 'axios';
import Token from "../../utilities/Token";

const CmnTgp = (props) => {
    console.log(props)
    const selectedLanguage = localStorage.getItem('sl') || 'en'
    const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
    const [dropdownItem, setDropdownItem] = useState(null);
    const [dropdownItems, setDropdownItems] = useState(null);
    const [cmnTgp, setCmnTgp] = useState(props.cmnTgp);
    const [ddTerrItem, setDdTerrItem] = useState(null);
    const [ddTerrItems, setDdTerrItems] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [cmnTerrItem, setCmnTerrItem] = useState(null);
    const [cmnTerrItems, setCmnTerrItems] = useState(null);

    const toast = useRef(null);
    const items = [
        { name: `${translations[selectedLanguage].Yes}`, code: '1' },
        { name: `${translations[selectedLanguage].No}`, code: '0' }
    ];

    useEffect(() => {
        setDropdownItem(findDropdownItemByCode(props.cmnTgp.valid));
    }, []);

    useEffect(() => {
        async function fetchData() {
            try {
                try {
                    const cmnTerrService = new CmnTerrService();
                    const data = await cmnTerrService.getCmnTerrs();

                    setCmnTerrItems(data)
                    //console.log("******************", cmnCurrItem)
                    const dataDD = data.map(({ textx, id }) => ({ name: textx, code: id }));
                    setDdTerrItems(dataDD);
                    setDdTerrItem(dataDD.find((item) => item.code === props.cmnTgp.country) || null);
                    if (props.cmnTerr.country) {
                        const foundItem = data.find((item) => item.id === props.cmnTgp.country);
                        setCmnTerrItem(foundItem || null);
                        cmnTgp.ccountry = foundItem.code
                        cmnTgp.ncountry = foundItem.textx
                    }

                } catch (error) {
                    console.error(error);
                    // Obrada greške ako je potrebna
                }
            } catch (error) {
                console.error(error);
                // Obrada greške ako je potrebna
            }
        }
        fetchData();
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
            const cmnTgpService = new CmnTgpService();
            const data = await cmnTgpService.postCmnTgp(cmnTgp);
            cmnTgp.id = data
            props.handleDialogClose({ obj: cmnTgp, tgpTip: props.tgpTip });
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
            const cmnTgpService = new CmnTgpService();
            await cmnTgpService.putCmnTgp(cmnTgp);
            props.handleDialogClose({ obj: cmnTgp, tgpTip: props.tgpTip });
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
            const cmnTgpService = new CmnTgpService();
            await cmnTgpService.deleteCmnTgp(cmnTgp);
            props.handleDialogClose({ obj: cmnTgp, tgpTip: 'DELETE' });
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
            val = (e.target && e.target.value && e.target.value.code) || '';
            if (name == "country") {
                setDdTerrItem(e.value);
                const foundItem = cmnTerrItems.find((item) => item.id === val);
                setCmnTerrItem(foundItem)
                cmnTgp.ncountry = e.value.name
                cmnTgp.ccountry = foundItem.code
            } else {
                setDropdownItem(e.value);
            }
        } else {
            val = (e.target && e.target.value) || '';
        }

        let _cmnTgp = { ...cmnTgp };
        _cmnTgp[`${name}`] = val;
        if (name === `textx`) _cmnTgp[`text`] = val

        setCmnTgp(_cmnTgp);
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
                                value={cmnTgp.code} onChange={(e) => onInputChange(e, "text", 'code')}
                                required
                                className={classNames({ 'p-invalid': submitted && !cmnTgp.code })}
                            />
                            {submitted && !cmnTgp.code && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                        </div>
                        <div className="field col-12 md:col-9">
                            <label htmlFor="textx">{translations[selectedLanguage].Text}</label>
                            <InputText
                                id="textx"
                                value={cmnTgp.textx} onChange={(e) => onInputChange(e, "text", 'textx')}
                                required
                                className={classNames({ 'p-invalid': submitted && !cmnTgp.textx })}
                            />
                            {submitted && !cmnTgp.textx && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                        </div>
                        <div className="field col-12 md:col-8">
                            <label htmlFor="country">{translations[selectedLanguage].country} *</label>
                            <Dropdown id="country"
                                value={ddTerrItem}
                                options={ddTerrItems}
                                onChange={(e) => onInputChange(e, "options", 'country')}
                                required
                                optionLabel="name"
                                placeholder="Select One"
                                className={classNames({ 'p-invalid': submitted && !cmnTgp.country })}
                            />
                            {submitted && !cmnTgp.country && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
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
                                className={classNames({ 'p-invalid': submitted && !cmnTgp.valid })}
                            />
                            {submitted && !cmnTgp.valid && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
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
                            {(props.tgpTip === 'CREATE') ? (
                                <Button
                                    label={translations[selectedLanguage].Create}
                                    icon="pi pi-check"
                                    onClick={handleCreateClick}
                                    severity="success"
                                    outlined
                                />
                            ) : null}
                            {(props.tgpTip !== 'CREATE') ? (
                                <Button
                                    label={translations[selectedLanguage].Delete}
                                    icon="pi pi-trash"
                                    onClick={showDeleteDialog}
                                    className="p-button-outlined p-button-danger"
                                    outlined
                                />
                            ) : null}
                            {(props.tgpTip !== 'CREATE') ? (
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
                item={cmnTgp.text}
                onHide={hideDeleteDialog}
                onDelete={handleDeleteClick}
            />
        </div>
    );
};

export default CmnTgp;
