import React, { useState, useRef, useEffect } from 'react';
import { classNames } from 'primereact/utils';
import { CmnLocService } from '../../service/model/CmnLocService';
import { CmnLoctpService } from '../../service/model/CmnLoctpService';
import './index.css';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import DeleteDialog from '../dialog/DeleteDialog';
import { translations } from '../../configs/translations';
import { Dropdown } from 'primereact/dropdown';
import { InputTextarea } from "primereact/inputtextarea";
import { Calendar } from 'primereact/calendar';
import DateFunction from '../../utilities/DateFunction';
import { ColorPicker } from 'primereact/colorpicker';

const CmnLoc = (props) => {
    const selectedLanguage = localStorage.getItem('sl') || 'en';
    const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
    const [cmnLoc, setCmnLoc] = useState(props.cmnLoc);
    const [submitted, setSubmitted] = useState(false);
    const [ddCmnLocItem, setDdCmnLocItem] = useState(null);
    const [ddCmnLocItems, setDdCmnLocItems] = useState(null);
    const [cmnLocItem, setCmnLocItem] = useState(null);
    const [cmnLocItems, setCmnLocItems] = useState(null);
    const [dropdownItem, setDropdownItem] = useState(null);
    const [dropdownItems, setDropdownItems] = useState(null);

    const calendarRef = useRef(null);

    const toast = useRef(null);
    const items = [
        { name: `${translations[selectedLanguage].Yes}`, code: '1' },
        { name: `${translations[selectedLanguage].No}`, code: '0' }
    ];

    useEffect(() => {
        setDropdownItem(findDropdownItemByCode(props.cmnLoc.valid));
    }, []);

    useEffect(() => {
        async function fetchData() {
            try {
                const cmnLoctpService = new CmnLoctpService();
                const data = await cmnLoctpService.getCmnLoctps();

                setCmnLocItems(data);
                //console.log("******************", cmnLocItem)

                const dataDD = data.map(({ textx, id }) => ({ name: textx, code: id }));
                setDdCmnLocItems(dataDD);
                setDdCmnLocItem(dataDD.find((item) => item.code === props.cmnLoc.tp) || null);
                if (props.cmnLoc.tp) {
                    const foundItem = data.find((item) => item.id === props.cmnLoc.tp);
                    setCmnLocItem(foundItem || null);
                    cmnLoc.ctp = foundItem.code;
                    cmnLoc.ntp = foundItem.textx;
                }
            } catch (error) {
                console.error(error);
                // Obrada greške ako je potrebna
            }
        }
        fetchData();
    }, []);
    // Autocomplit>

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
            const cmnLocService = new CmnLocService();
            const data = await cmnLocService.postCmnLoc(cmnLoc);
            cmnLoc.id = data;
            props.handleDialogClose({ obj: cmnLoc, locTip: props.locTip });
            props.setVisible(false);
        } catch (err) {
            toast.current.show({
                severity: 'error',
                summary: 'CmnLoc ',
                detail: `${err.response.data.error}`,
                life: 5000
            });
        }
    };

    const handleCreateAndAddNewClick = async () => {
        try {
            setSubmitted(true);
            const cmnLocService = new CmnLocService();
            const newCmnLoclink = { ...cmnLoc, id: null };
            const data = await cmnLocService.postCmnLoc(newCmnLoclink);
            cmnLoc.id = data;
            if (cmnLoc.code == "") cmnLoc.code = cmnLoc.id
            props.handleDialogClose({ obj: cmnLoc, locTip: props.locTip });
            cmnLoc.code = ""
            //props.setVisible(false);
        } catch (err) {
            toast.current.show({
                severity: 'error',
                summary: 'CmnLoc ',
                detail: `${err.response.data.error}`,
                life: 5000
            });
        }
    };
    const handleSaveClick = async () => {
        try {
            setSubmitted(true);
            const cmnLocService = new CmnLocService();

            await cmnLocService.putCmnLoc(cmnLoc);
            props.handleDialogClose({ obj: cmnLoc, locTip: props.locTip });
            props.setVisible(false);
        } catch (err) {
            toast.current.show({
                severity: 'error',
                summary: 'CmnLoc ',
                detail: `${err.response.data.error}`,
                life: 5000
            });
        }
    };

    const showDeleteDialog = () => {
        setDeleteDialogVisible(true);
    };

    const handleDeleteClick = async () => {
        try {
            setSubmitted(true);
            const cmnLocService = new CmnLocService();
            await cmnLocService.deleteCmnLoc(cmnLoc);
            props.handleDialogClose({ obj: cmnLoc, locTip: 'DELETE' });
            props.setVisible(false);
            hideDeleteDialog();
        } catch (err) {
            toast.current.show({
                severity: 'error',
                summary: 'CmnLoc ',
                detail: `${err.response.data.error}`,
                life: 5000
            });
        }
    };

    const onInputChange = (e, type, name, a) => {
        let val = '';

        if (type === 'options') {
            val = (e.target && e.target.value && e.target.value.code) || '';
            if (name == 'tp') {
                setDdCmnLocItem(e.value);
                const foundItem = cmnLocItems.find((item) => item.id === val);
                setCmnLocItem(foundItem || null);
                cmnLoc.ntp = e.value.name;
                cmnLoc.ctp = foundItem.code;
            } else {
                setDropdownItem(e.value);
            }
        } else {
            val = (e.target && e.target.value) || '';
        }
        let _cmnLoc = { ...cmnLoc };
        _cmnLoc[`${name}`] = val;
        console.log(e, "******************************onInputChange**********************************", _cmnLoc)
        setCmnLoc(_cmnLoc);
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
                        <div className="field col-12 md:col-3">
                            <label htmlFor="code">{translations[selectedLanguage].Code}</label>
                            <InputText id="code" autoFocus value={cmnLoc.code} onChange={(e) => onInputChange(e, 'text', 'code')} required className={classNames({ 'p-invalid': submitted && !cmnLoc.code })} />
                            {submitted && !cmnLoc.code && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                        </div>
                        <div className="field col-12 md:col-9">
                            <label htmlFor="text">{translations[selectedLanguage].Text}</label>
                            <InputText id="text" value={cmnLoc.text} onChange={(e) => onInputChange(e, 'text', 'text')} required className={classNames({ 'p-invalid': submitted && !cmnLoc.text })} />
                            {submitted && !cmnLoc.text && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                        </div>
                        <div className="field col-12 md:col-7">
                            <label htmlFor="tp">{translations[selectedLanguage].Type} *</label>
                            <Dropdown
                                id="tp"
                                value={ddCmnLocItem}
                                options={ddCmnLocItems}
                                onChange={(e) => onInputChange(e, 'options', 'tp')}
                                required
                                optionLabel="name"
                                placeholder="Select One"
                                className={classNames({ 'p-invalid': submitted && !cmnLoc.tp })}
                            />
                            {submitted && !cmnLoc.tp && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                        </div>
                    </div>

                    <div className="p-fluid formgrid grid">
                        <div className="field col-12 md:col-4">
                            <label htmlFor="longtext">{translations[selectedLanguage].Value}</label>
                            <InputText id="longtext" value={cmnLoc.longtext} onChange={(e) => onInputChange(e, 'text', 'longtext')} />
                        </div>
                    </div>
                    <div className="p-fluid formgrid grid">
                        <div className="field col-12 md:col-4">
                            <label htmlFor="valid">{translations[selectedLanguage].Valid}</label>
                            <Dropdown
                                id="valid"
                                value={dropdownItem}
                                options={dropdownItems}
                                onChange={(e) => onInputChange(e, 'options', 'valid')}
                                required
                                optionLabel="name"
                                placeholder="Select One"
                                className={classNames({ 'p-invalid': submitted && !cmnLoc.valid })}
                            />
                            {submitted && !cmnLoc.valid && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                        </div>
                    </div>
                </div>
                <div className="card">
                    <div className="p-fluid formgrid grid">
                        <div className="field col-12 md:col-4">
                            <label htmlFor="graftp">{translations[selectedLanguage].graftp}</label>
                            <InputText id="graftp" value={cmnLoc.graftp} onChange={(e) => onInputChange(e, 'text', 'graftp')} />
                        </div>
                        <div className="field col-12 md:col-4">
                            <label htmlFor="radius">{translations[selectedLanguage].radius}</label>
                            <InputText id="radius" value={cmnLoc.radius} onChange={(e) => onInputChange(e, 'text', 'radius')} />
                        </div>
                    </div>
                    <div className="p-fluid formgrid grid">
                        <div className="field col-12 md:col-12">
                            <label htmlFor="latlongs">{translations[selectedLanguage].latlongs}</label>
                            <InputTextarea id="latlongs" value={cmnLoc.latlongs} onChange={(e) => onInputChange(e, 'text', 'latlongs')} rows={5} />
                        </div>
                    </div>

                    <div className="p-fluid formgrid grid">
                        <div className="field col-12 md:col-4">
                            <label htmlFor="fillcolor">{translations[selectedLanguage].fillcolor}</label>
                            <InputText id="fillcolor" value={cmnLoc.fillcolor} onChange={(e) => onInputChange(e, 'text', 'fillcolor')} />
                        </div>
                        <div className="field col-12 md:col-4">
                            <label htmlFor="originfillcolor">{translations[selectedLanguage].originfillcolor}</label>
                            <InputText id="originfillcolor" value={cmnLoc.originfillcolor} onChange={(e) => onInputChange(e, 'text', 'originfillcolor')} />
                        </div>
                        <div className="field col-12 md:col-1">
                            <div className="flex-1 flex flex-column align-items-left">
                                <label htmlFor="color">{translations[selectedLanguage].color}</label>
                                <ColorPicker format="hex" id="color" value={cmnLoc.color} onChange={(e) => onInputChange(e, 'text', 'color')} className="mb-3" />
                            </div>

                        </div>                        
                    </div>
                    <div className="p-fluid formgrid grid">
                        <div className="field col-12 md:col-4">
                            <label htmlFor="rownum">{translations[selectedLanguage].rownum}</label>
                            <InputText id="rownum" value={cmnLoc.rownum} onChange={(e) => onInputChange(e, 'text', 'rownum')} />
                        </div>
                        <div className="field col-12 md:col-4">
                            <label htmlFor="seatnum">{translations[selectedLanguage].seatnum}</label>
                            <InputText id="seatnum" value={cmnLoc.seatnum} onChange={(e) => onInputChange(e, 'text', 'seatnum')} />
                        </div>
                        <div className="field col-12 md:col-4">
                            <label htmlFor="icon">{translations[selectedLanguage].icon}</label>
                            <InputText id="icon" value={cmnLoc.icon} onChange={(e) => onInputChange(e, 'text', 'icon')} />
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-1">
                        {props.dialog ? <Button label={translations[selectedLanguage].Cancel} icon="pi pi-times" className="p-button-outlined p-button-secondary" onClick={handleCancelClick} outlined /> : null}
                        <div className="flex-grow-1"></div>
                        <div className="flex flex-wrap gap-1">
                            {props.locTip === 'CREATE' ?
                                <>
                                    <Button label={translations[selectedLanguage].Create}
                                        icon="pi pi-check"
                                        onClick={handleCreateClick}
                                        severity="success"
                                        outlined />
                                    <Button label={translations[selectedLanguage].CreateAndAddNew}
                                        icon="pi pi-plus"
                                        onClick={handleCreateAndAddNewClick}
                                        severity="success"
                                        outlined />
                                </>
                                : null}
                            {props.locTip !== 'CREATE' ? <Button label={translations[selectedLanguage].Delete} icon="pi pi-trash" onClick={showDeleteDialog} className="p-button-outlined p-button-danger" outlined /> : null}
                            {props.locTip !== 'CREATE' ? <Button label={translations[selectedLanguage].Save} icon="pi pi-check" onClick={handleSaveClick} severity="success" outlined /> : null}
                        </div>
                    </div>
                </div>
            </div>
            <DeleteDialog visible={deleteDialogVisible} inCmnLoc="delete" item={cmnLoc.roll} onHide={hideDeleteDialog} onDelete={handleDeleteClick} />
        </div>
    );
};

export default CmnLoc;
