import React, { useState, useEffect, useRef } from "react";
import { classNames } from "primereact/utils";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { TriStateCheckbox } from "primereact/tristatecheckbox";
import { Toast } from "primereact/toast";
import { CmnObjlinkService } from "../../service/model/CmnObjlinkService";
import CmnObjlink from './cmnObjlink';
import { EmptyEntities } from '../../service/model/EmptyEntities';
import { Dialog } from 'primereact/dialog';
import './index.css';
import { translations } from "../../configs/translations";
import DateFunction from "../../utilities/DateFunction";


export default function CmnObjlinkL(props) {

  const objName = "cmn_objlink"
  const selectedLanguage = localStorage.getItem('sl') || 'en'
  const emptyCmnObjlink = EmptyEntities[objName]
  emptyCmnObjlink.obj2 = props.cmnObj.id
  emptyCmnObjlink.objtp2 = props.cmnObj.tp
  const [showMyComponent, setShowMyComponent] = useState(true);
  const [cmnObjlinks, setCmnObjlinks] = useState([]);
  const [cmnObjlink, setCmnObjlink] = useState(emptyCmnObjlink);
  const [filters, setFilters] = useState('');
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useRef(null);
  const [visible, setVisible] = useState(false);
  const [objlinkTip, setObjlinkTip] = useState('');
  let i = 0
  const handleCancelClick = () => {
    props.setCmnObjlinkLVisible(false);
  };

  useEffect(() => {
    async function fetchData() {
      try {
        ++i
        if (i < 2) {
          const cmnObjlinkService = new CmnObjlinkService();
          const data = await cmnObjlinkService.getLista(props.cmnObj.id);
          setCmnObjlinks(data);
          initFilters();
        }
      } catch (error) {
        console.error(error);
        // Obrada greške ako je potrebna
      }
    }
    fetchData();
  }, []);

  const handleDialogClose = (newObj) => {
    const localObj = { newObj };

    let _cmnObjlinks = [...cmnObjlinks];
    let _cmnObjlink = { ...localObj.newObj.obj };
    //setSubmitted(true);
    if (localObj.newObj.objlinkTip === "CREATE") {
      _cmnObjlinks.push(_cmnObjlink);
    } else if (localObj.newObj.objlinkTip === "UPDATE") {
      const index = findIndexById(localObj.newObj.obj.id);
      _cmnObjlinks[index] = _cmnObjlink;
    } else if ((localObj.newObj.objlinkTip === "DELETE")) {
      _cmnObjlinks = cmnObjlinks.filter((val) => val.id !== localObj.newObj.obj.id);
      toast.current.show({ severity: 'success', summary: 'Successful', detail: 'CmnObjlink Delete', life: 3000 });
    } else {
      toast.current.show({ severity: 'success', summary: 'Successful', detail: 'CmnObjlink ?', life: 3000 });
    }
    toast.current.show({ severity: 'success', summary: 'Successful', detail: `{${objName}} ${localObj.newObj.objlinkTip}`, life: 3000 });
    setCmnObjlinks(_cmnObjlinks);
    setCmnObjlink(emptyCmnObjlink);
  };

  const findIndexById = (id) => {
    let index = -1;

    for (let i = 0; i < cmnObjlinks.length; i++) {
      if (cmnObjlinks[i].id === id) {
        index = i;
        break;
      }
    }

    return index;
  };

  const openNew = () => {
    setCmnObjlinkDialog(emptyCmnObjlink);
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
        <Button label={translations[selectedLanguage].Cancel} icon="pi pi-times" onClick={handleCancelClick} text raised
        />
        <div className="flex flex-wrap gap-1">
          <Button label={translations[selectedLanguage].New} icon="pi pi-plus" severity="success" onClick={openNew} text raised />
        </div>
        <div className="flex-grow-1"></div>
        <b>{translations[selectedLanguage].ObjlinkList}</b>
        <div className="flex-grow-1"></div>
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
  const setCmnObjlinkDialog = (cmnObjlink) => {
    setVisible(true)
    setObjlinkTip("CREATE")
    setCmnObjlink({ ...cmnObjlink });
  }
  //  Dialog --->

  const header = renderHeader();
  // heder za filter/>

  const objlinkTemplate = (rowData) => {
    return (
      <div className="flex flex-wrap gap-1">

        <Button
          type="button"
          icon="pi pi-pencil"
          style={{ width: '24px', height: '24px' }}
          onClick={() => {
            setCmnObjlinkDialog(rowData)
            setObjlinkTip("UPDATE")
          }}
          text
          raised ></Button>

      </div>
    );
  };

  return (
    <div className="card">
      <Toast ref={toast} />
      <div className="col-12">
        <div className="card">
          <div className="p-fluid formgrid grid">
            <div className="field col-12 md:col-6">
              <label htmlFor="code">{translations[selectedLanguage].Code}</label>
              <InputText id="code"
                value={props.cmnObj.code}
                disabled={true}
              />
            </div>
            <div className="field col-12 md:col-6">
              <label htmlFor="text">{translations[selectedLanguage].Text}</label>
              <InputText
                id="text"
                value={props.cmnObj.textx}
                disabled={true}
              />
            </div>
          </div>
        </div>
      </div>
      <DataTable
        dataKey="id"
        selectionMode="single"
        selection={cmnObjlink}
        loading={loading}
        value={cmnObjlinks}
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
        rows={10}
        rowsPerPageOptions={[5, 10, 25, 50]}
        onSelectionChange={(e) => setCmnObjlink(e.value)}
        onRowSelect={onRowSelect}
        onRowUnselect={onRowUnselect}
      >
        <Column
          //bodyClassName="text-center"
          body={objlinkTemplate}
          exportable={false}
          headerClassName="w-10rem"
          style={{ minWidth: '4rem' }}
        />
        <Column
          field="cobjtp1"
          header={translations[selectedLanguage].CodeObjTp}
          sortable
          filter
          style={{ width: "10%" }}
        ></Column>
        <Column
          field="nobjtp1"
          header={translations[selectedLanguage].TextObjTp}
          sortable
          filter
          style={{ width: "20%" }}
        ></Column>
        <Column
          field="cobj1"
          header={translations[selectedLanguage].CodeObj}
          sortable
          filter
          style={{ width: "10%" }}
        ></Column>
        <Column
          field="nobj1"
          header={translations[selectedLanguage].TextObj}
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
      </DataTable>
      <Dialog
        header={translations[selectedLanguage].Objlink}
        visible={visible}
        style={{ width: '60%' }}
        onHide={() => {
          setVisible(false);
          setShowMyComponent(false);
        }}
      >
        {showMyComponent && (
          <CmnObjlink
            parameter={"inputTextValue"}
            cmnObjlink={cmnObjlink}
            cmnObj={props.cmnObj}
            handleDialogClose={handleDialogClose}
            setVisible={setVisible}
            dialog={true}
            objlinkTip={objlinkTip}
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
