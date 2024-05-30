import React, { useState, useEffect, useRef } from "react";
import { classNames } from "primereact/utils";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { TriStateCheckbox } from "primereact/tristatecheckbox";
import { Toast } from "primereact/toast";
import { CmnLocattsService } from "../../service/model/CmnLocattsService";
import CmnLocatts from './cmnLocatts';
import { EmptyEntities } from '../../service/model/EmptyEntities';
import { Dialog } from 'primereact/dialog';
import './index.css';
import { translations } from "../../configs/translations";
import DateFunction from "../../utilities/DateFunction";


export default function CmnLocattsL(props) {

  const objName = "cmn_locatts"
  const selectedLanguage = localStorage.getItem('sl')||'en'
  const emptyCmnLocatts = EmptyEntities[objName]
  emptyCmnLocatts.loc = props.cmnLoc.id
  const [showMyComponent, setShowMyComponent] = useState(true);
  const [cmnLocattss, setCmnLocattss] = useState([]);
  const [cmnLocatts, setCmnLocatts] = useState(emptyCmnLocatts);
  const [filters, setFilters] = useState('');
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useRef(null);
  const [visible, setVisible] = useState(false);
  const [locattsTip, setLocattsTip] = useState('');
  let i = 0
  const handleCancelClick = () => {
    props.setCmnLocattsLVisible(false);
  };

  useEffect(() => {
    async function fetchData() {
      try {
        ++i
        if (i < 2) {
          const cmnLocattsService = new CmnLocattsService();
          const data = await cmnLocattsService.getLista(props.cmnLoc.id);
          setCmnLocattss(data);
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

    let _cmnLocattss = [...cmnLocattss];
    let _cmnLocatts = { ...localObj.newObj.obj };
    //setSubmitted(true);
    if (localObj.newObj.locattsTip === "CREATE") {
      _cmnLocattss.push(_cmnLocatts);
    } else if (localObj.newObj.locattsTip === "UPDATE") {
      const index = findIndexById(localObj.newObj.obj.id);
      _cmnLocattss[index] = _cmnLocatts;
    } else if ((localObj.newObj.locattsTip === "DELETE")) {
      _cmnLocattss = cmnLocattss.filter((val) => val.id !== localObj.newObj.obj.id);
      toast.current.show({ severity: 'success', summary: 'Successful', detail: 'CmnLocatts Delete', life: 3000 });
    } else {
      toast.current.show({ severity: 'success', summary: 'Successful', detail: 'CmnLocatts ?', life: 3000 });
    }
    toast.current.show({ severity: 'success', summary: 'Successful', detail: `{${objName}} ${localObj.newObj.locattsTip}`, life: 3000 });
    setCmnLocattss(_cmnLocattss);
    setCmnLocatts(emptyCmnLocatts);
  };

  const findIndexById = (id) => {
    let index = -1;

    for (let i = 0; i < cmnLocattss.length; i++) {
      if (cmnLocattss[i].id === id) {
        index = i;
        break;
      }
    }

    return index;
  };

  const openNew = () => {
    setCmnLocattsDialog(emptyCmnLocatts);
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
      cre_action: { value: null, matchMode: FilterMatchMode.EQUALS },
      upd_action: { value: null, matchMode: FilterMatchMode.EQUALS },
      del_action: { value: null, matchMode: FilterMatchMode.EQUALS },
      exe_action: { value: null, matchMode: FilterMatchMode.EQUALS },
      all_action: { value: null, matchMode: FilterMatchMode.EQUALS },       
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
        <b>{translations[selectedLanguage].RollsList}</b>
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

  // <--- Dialog
  const setCmnLocattsDialog = (cmnLocatts) => {
    setVisible(true)
    setLocattsTip("CREATE")
    setCmnLocatts({ ...cmnLocatts });
  }
  //  Dialog --->

  const header = renderHeader();
  // heder za filter/>

  const locattsTemplate = (rowData) => {
    return (
      <div className="flex flex-wrap gap-1">

        <Button
          type="button"
          icon="pi pi-pencil"
          style={{ width: '24px', height: '24px' }}
          onClick={() => {
            setCmnLocattsDialog(rowData)
            setLocattsTip("UPDATE")
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
      <DataTable
        dataKey="id"
        selectionMode="single"
        selection={cmnLocatts}
        loading={loading}
        value={cmnLocattss}
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
        onSelectionChange={(e) => setCmnLocatts(e.value)}
        onRowSelect={onRowSelect}
        onRowUnselect={onRowUnselect}
      >
        <Column
          //bodyClassName="text-center"
          body={locattsTemplate}
          exportable={false}
          headerClassName="w-10rem"
          style={{ minWidth: '4rem' }}
        />
        <Column
          field="code1"
          header={translations[selectedLanguage].Code}
          sortable
          filter
          style={{ width: "10%" }}
        ></Column>
        <Column
          field="nlocatt1"
          header={translations[selectedLanguage].Text}
          sortable
          filter
          style={{ width: "30%" }}
        ></Column>
        <Column
          field="text"
          header={translations[selectedLanguage].Value}
          sortable
          filter
          style={{ width: "30%" }}
        ></Column>        
        <Column
          field="begda"
          header={translations[selectedLanguage].Begda}
          sortable
          filter
          style={{ width: "5%" }}
          body={(rowData) => formatDateColumn(rowData, "begda")}
        ></Column> 
        <Column
          field="endda"
          header={translations[selectedLanguage].Endda}
          sortable
          filter
          style={{ width: "5%" }}
          body={(rowData) => formatDateColumn(rowData, "endda")}
        ></Column>  
      </DataTable>
      <Dialog
        header={translations[selectedLanguage].Locatts}
        visible={visible}
        style={{ width: '60%' }}
        onHide={() => {
          setVisible(false);
          setShowMyComponent(false);
        }}
      >
        {showMyComponent && (
          <CmnLocatts
            parameter={"inputTextValue"}
            cmnLocatts={cmnLocatts}
            cmnLoc={props.cmnLoc}
            handleDialogClose={handleDialogClose}
            setVisible={setVisible}
            dialog={true}
            locattsTip={locattsTip}
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
