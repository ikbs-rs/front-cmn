import React, { useState, useEffect, useRef } from "react";
import { classNames } from "primereact/utils";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { TriStateCheckbox } from "primereact/tristatecheckbox";
import { Toast } from "primereact/toast";
import { CmnLoclinkService } from "../../service/model/CmnLoclinkService";
import { CmnLoctpService } from "../../service/model/CmnLoctpService";
import CmnLoclink from './cmnLoclink';
import CmnLoc from './cmnLoc';
import CmnLoclinkgrpL from './cmnLoclinkgrpL';
import { EmptyEntities } from '../../service/model/EmptyEntities';
import { Dialog } from 'primereact/dialog';
import './index.css';
import { translations } from "../../configs/translations";
import DateFunction from "../../utilities/DateFunction";
import { Dropdown } from 'primereact/dropdown';
import { useParams } from 'react-router-dom';
import { CmnLocService } from "../../service/model/CmnLocService";


export default function CmnLoclinkL(props) {
  console.log(props, "*********props*********************CmnLoclinkL***********************************@@@@@@", props.cmnLoctpId)
  const objName = "cmn_loclink"
  const selectedLanguage = localStorage.getItem('sl') || 'en'
  const emptyCmnLoclink = EmptyEntities[objName]
  emptyCmnLoclink.loc2 = props.cmnLoc.id
  emptyCmnLoclink.loctp2 = props.cmnLoc.tp
  emptyCmnLoclink.loctp1 = props.cmnLoctpId


  const [showMyComponent, setShowMyComponent] = useState(true);
  const [cmnLoclinks, setCmnLoclinks] = useState([]);
  const [cmnLoclink, setCmnLoclink] = useState(emptyCmnLoclink);

  const [cmnLoctpId, setCmnLoctpId] = useState(props.cmnLoctpId);
  const [locTip, setLocTip] = useState('');
  const [cmnLoc, setCmnLoc] = useState();
  const [loctpCode, setLoctpCode] = useState(props.loctpCode);
  const [locVisible, setLocVisible] = useState(false);

  if (!cmnLoclink?.cloctp1) {
    setCmnLoclink({ ...cmnLoclink, cloctp1: props.loctpCode });
  }
  // setCmnLoclink(_cmnLoclink)
  const [filters, setFilters] = useState('');
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useRef(null);
  const [visible, setVisible] = useState(false);

  const [cmnLoclinkgrpLVisible, setCmnLoclinkgrpLVisible] = useState(false);
  const [loclinkTip, setLoclinkTip] = useState('');

  let [refresh, setRefresh] = useState(null);
  const [componentKey, setComponentKey] = useState(0);
  const [ddCmnLoctpItem, setDdCmnLoctpItem] = useState(null);
  const [ddCmnLoctpItems, setDdCmnLoctpItems] = useState(null);
  const [cmnLoctp, setCmnLoctp] = useState({});
  const [cmnLoctps, setCmnLoctps] = useState([]);
  const [refCode, setRefCode] = useState(props.loctpCode);



  let i = 0
  const handleCancelClick = () => {
    props.setCmnLoclinkLVisible(false);
  };

  useEffect(() => {
    async function fetchData() {
      try {
        ++i
        if (i < 2) {
          let loctpCode = props.loctpCode ? refCode : props.cmnLoc.loctpCode
          const cmnLoclinkService = new CmnLoclinkService();
          console.log(props.loctpCode, "/////////////////////////////////////////////////////////////getListaLL////////////////////////////////////////////////////////////////////////")
          const data = await cmnLoclinkService.getListaLL(props.cmnLoc.id, loctpCode);
          setCmnLoclinks(data);
          initFilters();
        }
      } catch (error) {
        console.error(error);
        // Obrada greške ako je potrebna
      }
    }
    fetchData();
  }, [refresh, componentKey, refCode]);

  useEffect(() => {
    async function fetchData() {
      try {
        const cmnLoctpService = new CmnLoctpService();
        const data = await cmnLoctpService.getCmnLoctps();

        setCmnLoctps(data)
        //console.log("******************", ticLoctpItem)

        const dataDD = data.map(({ textx, id }) => ({ name: textx, code: id }));
        setDdCmnLoctpItems(dataDD);
        //setDdTicLoctpItem(dataDD.find((item) => item.code === props.ticEventatt.tp) || null);
      } catch (error) {
        console.error(error);
        // Obrada greške ako je potrebna
      }
    }
    fetchData();
  }, []);

  const handleCmnLoclinkgrpLDialogClose = (newObj) => {
    const localObj = { newObj };
    setRefresh(++refresh);
  }

  const handleDialogClose = (newObj) => {
    const localObj = { newObj };

    let _cmnLoclinks = [...cmnLoclinks];
    let _cmnLoclink = { ...localObj.newObj.obj };
    //setSubmitted(true);
    if (localObj.newObj.loclinkTip === "CREATE") {
      _cmnLoclinks.push(_cmnLoclink);
      setRefresh(newObj.id);
      setComponentKey((prevKey) => prevKey + 1);
    } else if (localObj.newObj.loclinkTip === "UPDATE") {
      const index = findIndexById(localObj.newObj.obj.id);
      _cmnLoclinks[index] = _cmnLoclink;
    } else if ((localObj.newObj.loclinkTip === "DELETE")) {
      _cmnLoclinks = cmnLoclinks.filter((val) => val.id !== localObj.newObj.obj.id);
      toast.current.show({ severity: 'success', summary: 'Successful', detail: 'CmnLoclink Delete', life: 3000 });
    } else {
      toast.current.show({ severity: 'success', summary: 'Successful', detail: 'CmnLoclink ?', life: 3000 });
    }
    toast.current.show({ severity: 'success', summary: 'Successful', detail: `{${objName}} ${localObj.newObj.loclinkTip}`, life: 3000 });
    setCmnLoclinks(_cmnLoclinks);
    setCmnLoclink(emptyCmnLoclink);
  };

  const findIndexById = (id) => {
    let index = -1;

    for (let i = 0; i < cmnLoclinks.length; i++) {
      if (cmnLoclinks[i].id === id) {
        index = i;
        break;
      }
    }

    return index;
  };

  const openNew = () => {
    setCmnLoclinkDialog(emptyCmnLoclink);
  };


  const openGrpLink = () => {
    setCmnLoclinkgrpDialog();
  };
  const onRowSelect = (event) => {
    toast.current.show({
      severity: "info",
      summary: "Action Selected",
      detail: `Id: ${event.data.id} Name: ${event.data.text}`,
      life: 3000,
    });
  };

  const onRowUnselect = (event) => {
    toast.current.show({
      severity: "warn",
      summary: "Action Unselected",
      detail: `Id: ${event.data.id} Name: ${event.data.text}`,
      life: 3000,
    });
  };

  const onLoctpChange = (e) => {
    let _cmnLoclink = { ...cmnLoclink };
    let val = (e.target && e.target.value && e.target.value.code) || '';
    setDdCmnLoctpItem(e.value);
    const foundItem = cmnLoctps.find((item) => item.id === val);
    setCmnLoctp(foundItem || null);
    _cmnLoclink.tp = val;
    //emptyTicEventloc.tp = val;
    setCmnLoclink(_cmnLoclink);
    setRefCode(foundItem?.code || '-1')
    setRefresh(++refresh);
  }

  // <heder za filter
  const initFilters = () => {
    setFilters({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      ocode: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
      },
      otext: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
      },
    });
    setGlobalFilterValue("");
  };

  const clearFilter = () => {
    initFilters();
  };

  const onGlobalFilterChange = (e) => {
    let value1 = e.target.value
    let _filters = { ...filters };

    _filters["global"].value = value1;

    setFilters(_filters);
    setGlobalFilterValue(value1);
  };

  const renderHeader = () => {
    return (
      <div className="flex card-container">
        <div className="flex flex-wrap gap-1" />
        {props.dialog && (
          <Button label={translations[selectedLanguage].Cancel} icon="pi pi-times" onClick={handleCancelClick} text raised />
        )}
        <div className="flex flex-wrap gap-1">
          <Button label={translations[selectedLanguage].New} icon="pi pi-plus" severity="success" onClick={openNew} text raised />
        </div>
        <div className="flex flex-wrap gap-1">
          <Button label={translations[selectedLanguage].GrpLink} icon="pi pi-plus" severity="warning" onClick={openGrpLink}  raised />
        </div>
        <div className="flex-grow-1"></div>
        <b>{translations[selectedLanguage].LoclinkList}</b>
        <div className="flex-grow-1"></div>

        {props.loctpCode == -1 && (
          <div className="flex-grow-1 ">
            <label htmlFor="tp">{translations[selectedLanguage].Type} *</label>
            <Dropdown id="tp"
              value={ddCmnLoctpItem}
              options={ddCmnLoctpItems}
              onChange={(e) => onLoctpChange(e)}
              showClear
              optionLabel="name"
              placeholder="Select One"
            />
          </div>
        )}


        <div className="flex flex-wrap gap-1">
          <span className="p-input-icon-left">
            <i className="pi pi-search" />
            <InputText
              value={globalFilterValue}
              onChange={onGlobalFilterChange}
              placeholder={translations[selectedLanguage].KeywordSearch}
            />
          </span>
          <Button
            type="button"
            icon="pi pi-filter-slash"
            label={translations[selectedLanguage].Clear}
            outlined
            onClick={clearFilter}
            text raised
          />
        </div>
      </div>
    );
  };

  const formatDateColumn = (rowData, field) => {
    return DateFunction.formatDate(rowData[field]);
  };

  const onoffBodyTemplate = (rowData) => {
    const valid = rowData.onoff == 1 ? true : false
    return (
      <i
        className={classNames("pi", {
          "text-green-500 pi-check-circle": valid,
          "text-red-500 pi-times-circle": !valid
        })}
      ></i>
    );
  };
  const hijerarhijaBodyTemplate = (rowData) => {
    const valid = rowData.hijerarhija == 1 ? true : false
    return (
      <i
        className={classNames("pi", {
          "text-green-500 pi-check-circle": valid,
          "text-red-500 pi-times-circle": !valid
        })}
      ></i>
    );
  };
  const onoffFilterTemplate = (options) => {
    return (
      <div className="flex align-items-center gap-2">
        <label htmlFor="verified-filter" className="font-bold">
          {translations[selectedLanguage].On_off}
        </label>
        <TriStateCheckbox
          inputId="verified-filter"
          value={options.value}
          onChange={(e) => options.filterCallback(e.value)}
        />
      </div>
    );
  };
  const hijerarhijaFilterTemplate = (options) => {
    return (
      <div className="flex align-items-center gap-2">
        <label htmlFor="verified-filter" className="font-bold">
          {translations[selectedLanguage].Hijerarhija}
        </label>
        <TriStateCheckbox
          inputId="verified-filter"
          value={options.value}
          onChange={(e) => options.filterCallback(e.value)}
        />
      </div>
    );
  };

  // <--- Dialog
  const setCmnLoclinkDialog = (cmnLoclink) => {
    setVisible(true)
    setLoclinkTip("CREATE")
    setCmnLoclink({ ...cmnLoclink });
  }

  const setCmnLoclinkgrpDialog = () => {
    setCmnLoclinkgrpLVisible(true)
  }

  const setCmnLocDialog = async (cmnLoclink) => {

    const cmnLocService = new CmnLocService();
    const data = await cmnLocService.getCmnLoc(cmnLoclink.loc1);
    await setCmnLoc({ ...data });
    console.log(cmnLoc, "HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHS")
    setLocTip("CREATE")
    setCmnLoctpId(props.cmnLoctpId)
    // setShowMyComponent(true)
    setLocVisible(true)
  }
  //  Dialog --->

  const header = renderHeader();
  // heder za filter/>

  const loclinkTemplate = (rowData) => {
    return (
      <div className="flex flex-wrap gap-1">

        <Button
          type="button"
          icon="pi pi-pencil"
          style={{ width: '24px', height: '24px' }}
          onClick={() => {
            setCmnLoclinkDialog(rowData)
            setLoclinkTip("UPDATE")
          }}
          text
          raised ></Button>

      </div>
    );
  };

  const locTemplate = (rowData) => {
    return (
      <div className="flex flex-wrap gap-1">

        <Button
          type="button"
          icon="pi pi-wrench"
          severity="warning"
          style={{ width: '24px', height: '24px' }}
          onClick={() => {
            setCmnLocDialog(rowData)
            setLocTip("UPDATE")
          }}
          raised ></Button>

      </div>
    );
  };
  return (
    <div className="card">
      <Toast ref={toast} />
      {!props.TabView && (
        <div className="col-12">
          <div className="card">
            <div className="p-fluid formgrid grid">
              <div className="field col-12 md:col-6">
                <label htmlFor="code">{translations[selectedLanguage].Code}</label>
                <InputText id="code"
                  value={props.cmnLoc.code}
                  disabled={true}
                />
              </div>
              <div className="field col-12 md:col-6">
                <label htmlFor="text">{translations[selectedLanguage].Text}</label>
                <InputText
                  id="text"
                  value={props.cmnLoc.textx}
                  disabled={true}
                />
              </div>
            </div>
          </div>
        </div>
      )}
      <DataTable
        key={componentKey}
        dataKey="id"
        size={"small"}
        selectionMode="single"
        selection={cmnLoclink}
        loading={loading}
        value={cmnLoclinks}
        header={header}
        showGridlines
        removableSort
        filters={filters}
        scrollable
        scrollHeight="550px"
        virtualScrollerOptions={{ itemSize: 46 }}
        tableStyle={{ minWidth: "50rem" }}
        metaKeySelection={false}
        paginator
        rows={50}
        rowsPerPageOptions={[50, 100, 250, 500]}
        onSelectionChange={(e) => setCmnLoclink(e.value)}
        onRowSelect={onRowSelect}
        onRowUnselect={onRowUnselect}
      >
        <Column
          //bodyClassName="text-center"
          body={loclinkTemplate}
          exportable={false}
          headerClassName="w-10rem"
          style={{ minWidth: '4rem' }}
        />
        <Column
          field="cloctp1"
          header={translations[selectedLanguage].CodeLocTp}
          sortable
          filter
          style={{ width: "10%" }}
        ></Column>
        <Column
          field="nloctp1"
          header={translations[selectedLanguage].TextLocTp}
          sortable
          filter
          style={{ width: "20%" }}
        ></Column>
        <Column
          field="cloc1"
          header={translations[selectedLanguage].CodeLoc}
          sortable
          filter
          style={{ width: "10%" }}
        ></Column>
        <Column
          field="nloc1"
          header={translations[selectedLanguage].TextLoc}
          sortable
          filter
          style={{ width: "20%" }}
        ></Column>
        <Column
          field="onoff"
          header={translations[selectedLanguage].On_off}
          sortable
          filter
          filterElement={onoffFilterTemplate}
          style={{ width: "5%" }}
          bodyClassName="text-center"
          body={onoffBodyTemplate}
        ></Column>
        <Column
          field="hijerarhija"
          header={translations[selectedLanguage].Hijerarhija}
          sortable
          filter
          filterElement={hijerarhijaFilterTemplate}
          style={{ width: "5%" }}
          bodyClassName="text-center"
          body={hijerarhijaBodyTemplate}
        ></Column>
        <Column
          field="begda"
          header={translations[selectedLanguage].Begda}
          sortable
          filter
          style={{ width: "10%" }}
          body={(rowData) => formatDateColumn(rowData, "begda")}
        ></Column>
        <Column
          field="endda"
          header={translations[selectedLanguage].Endda}
          sortable
          filter
          style={{ width: "10%" }}
          body={(rowData) => formatDateColumn(rowData, "endda")}
        ></Column>
        <Column
          //bodyClassName="text-center"
          body={locTemplate}
          exportable={false}
          headerClassName="w-10rem"
          style={{ minWidth: '4rem' }}
        />
      </DataTable>
      <Dialog
        header={translations[selectedLanguage].Loclink}
        visible={visible}
        style={{ width: '60%' }}
        onHide={() => {
          setVisible(false);
          setShowMyComponent(false);
        }}
      >
        {showMyComponent && (
          <CmnLoclink
            parameter={"inputTextValue"}
            cmnLoclink={cmnLoclink}
            cmnLoc={props.cmnLoc}
            handleDialogClose={handleDialogClose}
            setVisible={setVisible}
            dialog={true}
            loclinkTip={loclinkTip}
            cmnLoctpId={props.cmnLoctpId}
            loctpCode={props.loctpCode}
          />
        )}
        <div className="p-dialog-header-icons" style={{ display: 'none' }}>
          <button className="p-dialog-header-close p-link">
            <span className="p-dialog-header-close-icon pi pi-times"></span>
          </button>
        </div>
      </Dialog>
      <Dialog
        header={translations[selectedLanguage].Loclinkgrp}
        visible={cmnLoclinkgrpLVisible}
        style={{ width: '60%' }}
        onHide={() => {
          setCmnLoclinkgrpLVisible(false);
          setShowMyComponent(false);
        }}
      >
        {showMyComponent && (
          <CmnLoclinkgrpL
            parameter={"inputTextValue"}
            cmnLoc={props.cmnLoc}
            // handleDialogClose={handleDialogClose}
            handleCmnLoclinkgrpLDialogClose={handleCmnLoclinkgrpLDialogClose}
            setCmnLoclinkgrpLVisible={setCmnLoclinkgrpLVisible}
            dialog={true}
            cmnLoctpId={props.cmnLoctpId}
            loctpCode={props.loctpCode}
          />
        )}
        <div className="p-dialog-header-icons" style={{ display: 'none' }}>
          <button className="p-dialog-header-close p-link">
            <span className="p-dialog-header-close-icon pi pi-times"></span>
          </button>
        </div>
      </Dialog>
      <Dialog
        header={`${translations[selectedLanguage][props.loctpId]||'Локација '}`}
        visible={locVisible}
        style={{ width: '95%' }}
        onHide={() => {
          setLocVisible(false);
          setShowMyComponent(false);
        }}
      >
        {locVisible && (
          <CmnLoc
            parameter={props}
            cmnLoctpId={props.cmnLoctpId}
            loctpCode={loctpCode}
            cmnLoc={cmnLoc}
            handleDialogClose={handleDialogClose}
            setVisible={setLocVisible}
            dialog={true}
            locTip={locTip}

          />
        )}
        <div className="p-dialog-header-icons" style={{ display: 'none' }}>
          <button className="p-dialog-header-close p-link">
            <span className="p-dialog-header-close-icon pi pi-times"></span>
          </button>
        </div>
      </Dialog>

    </div>
  );
}
