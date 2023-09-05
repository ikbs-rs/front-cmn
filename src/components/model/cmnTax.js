import React, { useState, useRef, useEffect } from 'react';
import { classNames } from 'primereact/utils';
import { CmnTaxService } from "../../service/model/CmnTaxService";
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

const CmnTax = (props) => {
    console.log(props)
    const selectedLanguage = localStorage.getItem('sl') || 'en'
    const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
    const [dropdownItem, setDropdownItem] = useState(null);
    const [dropdownItems, setDropdownItems] = useState(null);
    const [cmnTax, setCmnTax] = useState(props.cmnTax);
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
        setDropdownItem(findDropdownItemByCode(props.cmnTax.valid));
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
                    setDdTerrItem(dataDD.find((item) => item.code === props.cmnTax.country) || null);
                    if (props.cmnTerr.country) {
                        const foundItem = data.find((item) => item.id === props.cmnTax.country);
                        setCmnTerrItem(foundItem || null);
                        cmnTax.ccountry = foundItem.code
                        cmnTax.ncountry = foundItem.textx
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
            const cmnTaxService = new CmnTaxService();
            const data = await cmnTaxService.postCmnTax(cmnTax);
            cmnTax.id = data
            props.handleDialogClose({ obj: cmnTax, taxTip: props.taxTip });
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
            const cmnTaxService = new CmnTaxService();
            await cmnTaxService.putCmnTax(cmnTax);
            props.handleDialogClose({ obj: cmnTax, taxTip: props.taxTip });
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
            const cmnTaxService = new CmnTaxService();
            await cmnTaxService.deleteCmnTax(cmnTax);
            props.handleDialogClose({ obj: cmnTax, taxTip: 'DELETE' });
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
                cmnTax.ncountry = e.value.name
                cmnTax.ccountry = foundItem.code
            } else {
                setDropdownItem(e.value);
            }
        } else {
            val = (e.target && e.target.value) || '';
        }

        let _cmnTax = { ...cmnTax };
        _cmnTax[`${name}`] = val;
        if (name === `textx`) _cmnTax[`text`] = val

        setCmnTax(_cmnTax);
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
                                value={cmnTax.code} onChange={(e) => onInputChange(e, "text", 'code')}
                                required
                                className={classNames({ 'p-invalid': submitted && !cmnTax.code })}
                            />
                            {submitted && !cmnTax.code && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                        </div>
                        <div className="field col-12 md:col-9">
                            <label htmlFor="textx">{translations[selectedLanguage].Text}</label>
                            <InputText
                                id="textx"
                                value={cmnTax.textx} onChange={(e) => onInputChange(e, "text", 'textx')}
                                required
                                className={classNames({ 'p-invalid': submitted && !cmnTax.textx })}
                            />
                            {submitted && !cmnTax.textx && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
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
                                className={classNames({ 'p-invalid': submitted && !cmnTax.country })}
                            />
                            {submitted && !cmnTax.country && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
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
                                className={classNames({ 'p-invalid': submitted && !cmnTax.valid })}
                            />
                            {submitted && !cmnTax.valid && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
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
                            {(props.taxTip === 'CREATE') ? (
                                <Button
                                    label={translations[selectedLanguage].Create}
                                    icon="pi pi-check"
                                    onClick={handleCreateClick}
                                    severity="success"
                                    outlined
                                />
                            ) : null}
                            {(props.taxTip !== 'CREATE') ? (
                                <Button
                                    label={translations[selectedLanguage].Delete}
                                    icon="pi pi-trash"
                                    onClick={showDeleteDialog}
                                    className="p-button-outlined p-button-danger"
                                    outlined
                                />
                            ) : null}
                            {(props.taxTip !== 'CREATE') ? (
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
                item={cmnTax.text}
                onHide={hideDeleteDialog}
                onDelete={handleDeleteClick}
            />
        </div>
    );
};

export default CmnTax;
