import React, { useState, useEffect, useRef } from "react";
import { classNames } from "primereact/utils";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { TriStateCheckbox } from "primereact/tristatecheckbox";
import { Toast } from "primereact/toast";
import { CmnCurrService } from "../../service/model/CmnCurrService";
import CmnCurr from './cmnCurr';
import { EmptyEntities } from '../../service/model/EmptyEntities';
import { Dialog } from 'primereact/dialog';
import './index.css';
import { translations } from "../../configs/translations";
import DateFunction from "../../utilities/DateFunction";
import CmnCurrrateL from './cmnCurrrateL';


export default function CmnCurrL(props) {

  const objName = "cmn_curr"
  const selectedLanguage = localStorage.getItem('sl') || 'en'
  const emptyCmnCurr = EmptyEntities[objName]
  const [showMyComponent, setShowMyComponent] = useState(true);
  const [cmnCurrs, setCmnCurrs] = useState([]);
  const [cmnCurr, setCmnCurr] = useState(emptyCmnCurr);
  const [filters, setFilters] = useState('');
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useRef(null);
  const [visible, setVisible] = useState(false);
  const [currTip, setCurrTip] = useState('');
  const [cmnCurrattsLVisible, setCmnCurrattsLVisible] = useState(false);
  const [cmnCurrrateLVisible, setCmnCurrrateLVisible] = useState(false);
  let i = 0
  const handleCancelClick = () => {
    props.setCmnCurrLVisible(false);
  };

  useEffect(() => {
    async function fetchData() {
      try {
        ++i
        if (i < 2) {
          const cmnCurrService = new CmnCurrService();
          const data = await cmnCurrService.getLista();
          setCmnCurrs(data);

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

    let _cmnCurrs = [...cmnCurrs];
    let _cmnCurr = { ...localObj.newObj.obj };
    //setSubmitted(true);
    if (localObj.newObj.currTip === "CREATE") {
      _cmnCurrs.push(_cmnCurr);
    } else if (localObj.newObj.currTip === "UPDATE") {
      const index = findIndexById(localObj.newObj.obj.id);
      _cmnCurrs[index] = _cmnCurr;
    } else if ((localObj.newObj.currTip === "DELETE")) {
      _cmnCurrs = cmnCurrs.filter((val) => val.id !== localObj.newObj.obj.id);
      toast.current.show({ severity: 'success', summary: 'Successful', detail: 'CmnCurr Delete', life: 3000 });
    } else {
      toast.current.show({ severity: 'success', summary: 'Successful', detail: 'CmnCurr ?', life: 3000 });
    }
    toast.current.show({ severity: 'success', summary: 'Successful', detail: `{${objName}} ${localObj.newObj.currTip}`, life: 3000 });
    setCmnCurrs(_cmnCurrs);
    setCmnCurr(emptyCmnCurr);
  };

  const handleCmnCurrattsLDialogClose = (newObj) => {
    const localObj = { newObj };
  };

  const handleCmnCurrrateLDialogClose = (newObj) => {
    const localObj = { newObj };
  };

  const findIndexById = (id) => {
    let index = -1;

    for (let i = 0; i < cmnCurrs.length; i++) {
      if (cmnCurrs[i].id === id) {
        index = i;
        break;
      }
    }

    return index;
  };

  const openNew = () => {
    setCmnCurrDialog(emptyCmnCurr);
  };

  const openParAtt = () => {
    setCmnCurrattsLDialog();
  };

  const openParLink = () => {
    setCmnCurrrateLDialog();
  };

  const onRowSelect = (event) => {
    //cmnCurr.begda = event.data.begda
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
      ctp: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
      },
      ntp: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
      },
      endda: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
      },
      begda: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
      }
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
        <div className="flex flex-wrap gap-1">
          <Button label={translations[selectedLanguage].Ratecurr} icon="pi pi-sitemap" onClick={openParLink} text raised disabled={!cmnCurr} />
        </div>                
        <div className="flex-grow-1"></div>
        <b>{translations[selectedLanguage].CurrLista}</b>
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

  const setCmnCurrattsLDialog = () => {
    setShowMyComponent(true);
    setCmnCurrattsLVisible(true);
  } 

  const setCmnCurrrateLDialog = () => {
    setShowMyComponent(true);
    setCmnCurrrateLVisible(true);
  } 

  const setCmnCurrDialog = (cmnCurr) => {
    setVisible(true)
    setCurrTip("CREATE")
    setCmnCurr({ ...cmnCurr });
  }
  //  Dialog --->

  const header = renderHeader();
  // heder za filter/>

  const currTemplate = (rowData) => {
    return (
      <div className="flex flex-wrap gap-1">

        <Button
          type="button"
          icon="pi pi-pencil"
          style={{ width: '24px', height: '24px' }}
          onClick={() => {
            setCmnCurrDialog(rowData)
            setCurrTip("UPDATE")
          }}
          text
          raised ></Button>

      </div>
    );
  };

  return (
    <div className="card">
      <Toast ref={toast} />

      <DataTable
        dataKey="id"
        selectionMode="single"
        selection={cmnCurr}
        loading={loading}
        value={cmnCurrs}
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
        onSelectionChange={(e) => setCmnCurr(e.value)}
        onRowSelect={onRowSelect}
        onRowUnselect={onRowUnselect}
      >
        <Column
          //bodyClassName="text-center"
          body={currTemplate}
          exportable={false}
          headerClassName="w-10rem"
          style={{ minWidth: '4rem' }}
        />
        <Column
          field="code"
          header={translations[selectedLanguage].Code}
          sortable
          filter
          style={{ width: "20%" }}
        ></Column> 
        <Column
          field="text"
          header={translations[selectedLanguage].Text}
          sortable
          filter
          style={{ width: "40%" }}
        ></Column>                
        <Column
          field="ncountry"
          header={translations[selectedLanguage].country}
          sortable
          filter
          style={{ width: "40%" }}
        ></Column>
      </DataTable>
      <Dialog
        header={translations[selectedLanguage].Curr}
        visible={visible}
        style={{ width: '60%' }}
        onHide={() => {
          setVisible(false);
          setShowMyComponent(false);
        }}
      >
        {showMyComponent && (
          <CmnCurr
            parameter={"inputTextValue"}
            cmnCurr={cmnCurr}
            handleDialogClose={handleDialogClose}
            setVisible={setVisible}
            dialog={true}
            currTip={currTip}
          />
        )}
        <div className="p-dialog-header-icons" style={{ display: 'none' }}>
          <button className="p-dialog-header-close p-link">
            <span className="p-dialog-header-close-icon pi pi-times"></span>
          </button>
        </div>
      </Dialog>     
      <Dialog
        header={translations[selectedLanguage].CurrRateLista}
        visible={cmnCurrrateLVisible}
        style={{ width: '70%' }}
        onHide={() => {
          setCmnCurrrateLVisible(false);
          setShowMyComponent(false);
        }}
      >
        {showMyComponent && (
          <CmnCurrrateL
            parameter={"inputTextValue"}
            cmnCurr={cmnCurr}
            handleCmnCurrrateLDialogClose={handleCmnCurrrateLDialogClose}
            setCmnCurrrateLVisible={setCmnCurrrateLVisible}
            dialog={true}
            lookUp={false}
          />
        )}
      </Dialog>        
    </div>
  );
}
