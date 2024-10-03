import React, { useState, useRef, useEffect } from 'react';
import { classNames } from 'primereact/utils';
import SalPlace from './cmnSalPlace';
import { TicVenueService } from "../../service/model/TicVenueService";
import { TicVenuetpService } from "../../service/model/TicVenuetpService";
import './index.css';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from "primereact/toast";
import DeleteDialog from '../dialog/DeleteDialog';
import { translations } from "../../configs/translations";

const TicVenue = (props) => {
    const selectedLanguage = localStorage.getItem('sl') || 'en'
    const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
    const [dropdownItem, setDropdownItem] = useState(null);
    const [dropdownItems, setDropdownItems] = useState(null);

    const [ddTicVenuetpItem, setDdTicVenuetpItem] = useState(props.ticVenue?.venue_type);
    const [ddTicVenuetpItems, setDdTicVenuetpItems] = useState(null);
    const [ticVenuetpItem, setTicVenuetpItem] = useState(null);
    const [ticVenuetpItems, setTicVenuetpItems] = useState(null);
    let [venueTip, setVenueTip] = useState(props.venueTip)

    const [ticVenue, setTicVenue] = useState(props.ticVenue);
    const [submitted, setSubmitted] = useState(false);

    const toast = useRef(null);
    const items = [
        { name: `${translations[selectedLanguage].Yes}`, code: '1' },
        { name: `${translations[selectedLanguage].No}`, code: '0' }
    ];


    useEffect(() => {
        async function fetchData() {
            try {
                const ticVenuetpService = new TicVenuetpService();
                const data = await ticVenuetpService.getTicVenuetps();

                setTicVenuetpItems(data);

                const dataDD = data.map(({ text, id }) => ({ name: text, code: id }));
                setDdTicVenuetpItems(dataDD);
                setDdTicVenuetpItem(dataDD.find((item) => item.code === props.ticVenue.venue_type) || null);

                if (props.ticVenue.venue_type) {
                    const foundItem = data.find((item) => item.id === props.ticVenue.venue_type);
                    setTicVenuetpItem(foundItem || null);
                    if (foundItem) {
                        ticVenue.ctp = foundItem.code || null;
                        ticVenue.ntp = foundItem.textx || null;
                    }
                }
            } catch (error) {
                console.error(error);
                // Obrada greške ako je potrebna
            }
        }
        fetchData();
    }, []);

    useEffect(() => {
        setDropdownItem(findDropdownItemByCode(props.ticVenue.valid));
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
            const ticVenueService = new TicVenueService();
            const data = await ticVenueService.postTicVenue(ticVenue);
            
            setTicVenue({...data})
            props.handleDialogClose({ obj: {...data}, venueTip: venueTip });
            props.setVisible(true);
            setVenueTip('UPDATE')
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
            const ticVenueService = new TicVenueService();
            const data = await ticVenueService.putTicVenue(ticVenue);
            props.handleDialogClose({ obj: ticVenue, venueTip: venueTip });
            // console.log({...data}, "HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH", data)
            props.setVisible(true);
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
            const ticVenueService = new TicVenueService();
            await ticVenueService.deleteTicVenue(ticVenue);
            props.handleDialogClose({ obj: ticVenue, venueTip: 'DELETE' });
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
            if (name == 'venue_type') {
                setDdTicVenuetpItem(e.value);
                const foundItem = ticVenuetpItems.find((item) => item.id === val);
                setTicVenuetpItem(foundItem || null);
                ticVenue.ntp = e.value.name;
                ticVenue.ctp = foundItem.code;
            } else {
                setDropdownItem(e.value);
            }
        } else {
            val = (e.target && e.target.value) || '';
        }

        let _ticVenue = { ...ticVenue };
        _ticVenue[`${name}`] = val;
        // if (name===`textx`) _ticVenue[`text`] = val

        setTicVenue(_ticVenue);
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
                        <div className="field col-12 md:col-2">
                            <label htmlFor="code">{translations[selectedLanguage].Code}</label>
                            <InputText id="code" autoFocus
                                value={ticVenue.code} onChange={(e) => onInputChange(e, "text", 'code')}
                                required
                                className={classNames({ 'p-invalid': submitted && !ticVenue.code })}
                            />
                            {submitted && !ticVenue.code && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                        </div>
                        <div className="field col-12 md:col-7">
                            <label htmlFor="venue_name">{translations[selectedLanguage].Text}</label>
                            <InputText
                                id="venue_name"
                                value={ticVenue.venue_name} onChange={(e) => onInputChange(e, "text", 'venue_name')}
                                required
                                className={classNames({ 'p-invalid': submitted && !ticVenue.venue_name })}
                            />
                            {submitted && !ticVenue.venue_name && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                        </div>
                        <div className="field col-12 md:col-3">
                            <label htmlFor="tp">{translations[selectedLanguage].Type} *</label>
                            <Dropdown
                                id="venue_type"
                                value={ddTicVenuetpItem}
                                options={ddTicVenuetpItems}
                                onChange={(e) => onInputChange(e, 'options', 'venue_type')}
                                required
                                optionLabel="name"
                                placeholder="Select One"
                                className={classNames({ 'p-invalid': submitted && !ticVenue.venue_type })}
                            />
                            {submitted && !ticVenue.venue_type && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
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
                            {(venueTip === 'CREATE') ? (
                                <Button
                                    label={translations[selectedLanguage].Create}
                                    icon="pi pi-check"
                                    onClick={handleCreateClick}
                                    severity="success"
                                    outlined
                                />
                            ) : null}
                            {(venueTip !== 'CREATE') ? (
                                <Button
                                    label={translations[selectedLanguage].Delete}
                                    icon="pi pi-trash"
                                    onClick={showDeleteDialog}
                                    className="p-button-outlined p-button-danger"
                                    outlined
                                />
                            ) : null}
                            {(venueTip !== 'CREATE') ? (
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

                    <SalPlace key={"III"} locId={null} venue_id={ticVenue.venue_id} cmnLoctpId={null} TabView={false} dialog={false} loctpCode={"-1"} iframeHeight={"585px"}/>

            </div>
            <DeleteDialog
                visible={deleteDialogVisible}
                inAction="delete"
                item={ticVenue.text}
                onHide={hideDeleteDialog}
                onDelete={handleDeleteClick}
            />
        </div>
    );
};

export default TicVenue;
