import React, { useState, useRef, useEffect } from 'react';
import { classNames } from 'primereact/utils';
import { TicVenueService } from "../../service/model/TicVenueService";
import { CmnLocvenueService } from "../../service/model/CmnLocvenueService";
import './index.css';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Toast } from "primereact/toast";
import DeleteDialog from '../dialog/DeleteDialog';
import { translations } from "../../configs/translations";
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from "primereact/calendar";
import DateFunction from "../../utilities/DateFunction"
import SalPlace from './cmnSalPlace';

const CmnLocvenue = (props) => {
    console.log("Props", props)
    const selectedLanguage = localStorage.getItem('sl') || 'en'
    const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
    const [cmnLocvenue, setCmnLocvenue] = useState(props.cmnLocvenue);
    const [submitted, setSubmitted] = useState(false);
    const [ddCmnLocvenueItem, setDdCmnLocvenueItem] = useState(null);
    const [ddCmnLocvenueItems, setDdCmnLocvenueItems] = useState(null);
    const [cmnLocvenueItem, setCmnLocvenueItem] = useState(null);
    const [cmnLocvenueItems, setCmnLocvenueItems] = useState(null);
    const [venue_id, setVenue_id] = useState(null);
    const [begda, setBegda] = useState(new Date(DateFunction.formatJsDate(props.cmnLocvenue.begda || DateFunction.currDate())));
    const [endda, setEndda] = useState(new Date(DateFunction.formatJsDate(props.cmnLocvenue.endda || '99991231')))

    const calendarRef = useRef(null);

    const toast = useRef(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const ticVenueService = new TicVenueService();
                const data = await ticVenueService.getTicVenues();

                setCmnLocvenueItems(data)
                //console.log("******************", cmnLocvenueItem)

                const dataDD = data.map(({ venue_name, venue_id }) => ({ name: venue_name, code: venue_id }));
                setDdCmnLocvenueItems(dataDD);
                setDdCmnLocvenueItem(dataDD.find((item) => item.code === props.cmnLocvenue.venue) || null);
                if (props.cmnLocvenue.venue) {
                    const foundItem = data.find((item) => item.venue_id === props.cmnLocvenue.venue);
                    setCmnLocvenueItem(foundItem || null);
                    cmnLocvenue.cvenue = foundItem.code
                    cmnLocvenue.nvenue = foundItem.venue_name
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
            cmnLocvenue.begda = DateFunction.formatDateToDBFormat(DateFunction.dateGetValue(begda));
            cmnLocvenue.endda = DateFunction.formatDateToDBFormat(DateFunction.dateGetValue(endda));
            const cmnLocvenueService = new CmnLocvenueService();
            const data = await cmnLocvenueService.postCmnLocvenue(cmnLocvenue);
            cmnLocvenue.id = data
            props.handleDialogClose({ obj: cmnLocvenue, locvenueTip: props.locvenueTip });
            props.setVisible(false);
        } catch (err) {
            toast.current.show({
                severity: "error",
                summary: "CmnLocvenue ",
                detail: `${err.response.data.error}`,
                life: 5000,
            });
        }
    };

    const handleSaveClick = async () => {
        try {
            setSubmitted(true);
            cmnLocvenue.begda = DateFunction.formatDateToDBFormat(DateFunction.dateGetValue(begda));
            cmnLocvenue.endda = DateFunction.formatDateToDBFormat(DateFunction.dateGetValue(endda));
            const cmnLocvenueService = new CmnLocvenueService();

            await cmnLocvenueService.putCmnLocvenue(cmnLocvenue);
            props.handleDialogClose({ obj: cmnLocvenue, locvenueTip: props.locvenueTip });
            props.setVisible(false);
        } catch (err) {
            toast.current.show({
                severity: "error",
                summary: "CmnLocvenue ",
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
            const cmnLocvenueService = new CmnLocvenueService();
            await cmnLocvenueService.deleteCmnLocvenue(cmnLocvenue);
            props.handleDialogClose({ obj: cmnLocvenue, locvenueTip: 'DELETE' });
            props.setVisible(false);
            hideDeleteDialog();
        } catch (err) {
            toast.current.show({
                severity: "error",
                summary: "CmnLocvenue ",
                detail: `${err.response.data.error}`,
                life: 5000,
            });
        }
    };

    const onInputChange = (e, type, name, a) => {
        let val = ''

        if (type === "options") {
            val = (e.target && e.target.value && e.target.value.code) || null;
            console.log(cmnLocvenueItems, "*********HHHHHHHHHHHHH**************************", name)
            setDdCmnLocvenueItem(e.value);
            // setVenue_id = val
            const foundItem = cmnLocvenueItems.find((item) => item.venue_id === val);
            setCmnLocvenueItem(foundItem || null);
            cmnLocvenue.nvenue = e.value.name
            cmnLocvenue.cvenue = foundItem.code
        } else if (type === "Calendar") {
            const dateVal = DateFunction.dateGetValue(e.value)
            console.log(dateVal, "***********************************")
            val = (e.target && e.target.value) || '';
            switch (name) {
                case "begda":
                    setBegda(e.value)
                    //cmnLocvenue.begda = DateFunction.formatDateToDBFormat(dateVal)
                    break;
                case "endda":
                    setEndda(e.value)
                    //cmnLocvenue.endda = DateFunction.formatDateToDBFormat(dateVal)
                    break;
                default:
                    console.error("Pogresan naziv polja")
            }
        } else {
            val = (e.target && e.target.value) || '';
        }
        console.log(cmnLocvenue, "*****************cmnLocvenue******************")
        let _cmnLocvenue = { ...cmnLocvenue };
        _cmnLocvenue[`${name}`] = val;
        console.log(cmnLocvenue, "*****************_cmnLocvenue******************")
        setCmnLocvenue(_cmnLocvenue);
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
                                value={props.cmnLoc.code}
                                disabled={true}
                            />
                        </div>
                        <div className="field col-12 md:col-7">
                            <label htmlFor="text">{translations[selectedLanguage].Text}</label>
                            <InputText
                                id="text"
                                value={props.cmnLoc.text}
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
                            <label htmlFor="venue">{translations[selectedLanguage].Skica} *</label>
                            <Dropdown id="venue"
                                value={ddCmnLocvenueItem}
                                options={ddCmnLocvenueItems}
                                onChange={(e) => onInputChange(e, "options", 'venue')}
                                required
                                optionLabel="name"
                                placeholder="Select One"
                                className={classNames({ 'p-invalid': submitted && !cmnLocvenue.venue })}
                            />
                            {submitted && !cmnLocvenue.venue && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
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
                        {/* </div>
                    <div className="p-fluid formgrid grid"> */}
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
                            {(props.locvenueTip === 'CREATE') ? (
                                <Button
                                    label={translations[selectedLanguage].Create}
                                    icon="pi pi-check"
                                    onClick={handleCreateClick}
                                    severity="success"
                                    outlined
                                />
                            ) : null}
                            {(props.locvenueTip !== 'CREATE') ? (
                                <Button
                                    label={translations[selectedLanguage].Delete}
                                    icon="pi pi-trash"
                                    onClick={showDeleteDialog}
                                    className="p-button-outlined p-button-danger"
                                    outlined
                                />
                            ) : null}
                            {(props.locvenueTip !== 'CREATE') ? (
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

                <div className="p-fluid formgrid grid">
                    <div className="field col-12 md:col-12">
                        {(cmnLocvenue.venue && cmnLocvenue.venue != null) ? (
                            <SalPlace key={"III"} locId={null} cmnLoctpId={null} venue_id={cmnLocvenue.venue} TabView={false} dialog={false} loctpCode={"-1"} iframeHeight={"585px"} />
                        )
                            : null}
                    </div>

                </div>
            </div>


            <DeleteDialog
                visible={deleteDialogVisible}
                inCmnLocvenue="delete"
                item={cmnLocvenue.roll}
                onHide={hideDeleteDialog}
                onDelete={handleDeleteClick}
            />
        </div>
    );
};

export default CmnLocvenue;
