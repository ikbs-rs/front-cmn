import React, { useState, useEffect, useRef } from "react";
import { classNames } from "primereact/utils";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { TriStateCheckbox } from "primereact/tristatecheckbox";
import { Toast } from "primereact/toast";
import { CmnObjparService } from "../../service/model/CmnObjparService";
import CmnObjpar from './cmnObjpar';
import { EmptyEntities } from '../../service/model/EmptyEntities';
import { Dialog } from 'primereact/dialog';
import './index.css';
import { translations } from "../../configs/translations";
import DateFunction from "../../utilities/DateFunction";


export default function CmnObjparL(props) {
console.log(props, "*****************************CmnObjparL************************************")
  const objName = "cmn_objpar"
  const selectedLanguage = localStorage.getItem('sl')||'en'
  const emptyCmnObjpar = EmptyEntities[objName]
  emptyCmnObjpar.obj = props.cmnObj.id
  const [showMyComponent, setShowMyComponent] = useState(true);
  const [cmnObjpars, setCmnObjpars] = useState([]);
  const [cmnObjpar, setCmnObjpar] = useState(emptyCmnObjpar);
  const [filters, setFilters] = useState('');
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useRef(null);
  const [visible, setVisible] = useState(false);
  const [objparTip, setObjparTip] = useState('');
  let i = 0
  const handleCancelClick = () => {
    props.setCmnObjparLVisible(false);
  };

  useEffect(() => {
    async function fetchData() {
      try {
        ++i
        if (i < 2) {
          const cmnObjparService = new CmnObjparService();
          const data = await cmnObjparService.getLista(props.cmnObj.id);
          setCmnObjpars(data);
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

    let _cmnObjpars = [...cmnObjpars];
    let _cmnObjpar = { ...localObj.newObj.obj };
    //setSubmitted(true);
    if (localObj.newObj.objparTip === "CREATE") {
      _cmnObjpars.push(_cmnObjpar);
    } else if (localObj.newObj.objparTip === "UPDATE") {
      const index = findIndexById(localObj.newObj.obj.id);
      _cmnObjpars[index] = _cmnObjpar;
    } else if ((localObj.newObj.objparTip === "DELETE")) {
      _cmnObjpars = cmnObjpars.filter((val) => val.id !== localObj.newObj.obj.id);
      toast.current.show({ severity: 'success', summary: 'Successful', detail: 'CmnObjpar Delete', life: 3000 });
    } else {
      toast.current.show({ severity: 'success', summary: 'Successful', detail: 'CmnObjpar ?', life: 3000 });
    }
    toast.current.show({ severity: 'success', summary: 'Successful', detail: `{${objName}} ${localObj.newObj.objparTip}`, life: 3000 });
    setCmnObjpars(_cmnObjpars);
    setCmnObjpar(emptyCmnObjpar);
  };

  const findIndexById = (id) => {
    let index = -1;

    for (let i = 0; i < cmnObjpars.length; i++) {
      if (cmnObjpars[i].id === id) {
        index = i;
        break;
      }
    }

    return index;
  };

  const openNew = () => {
    setCmnObjparDialog(emptyCmnObjpar);
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
  const setCmnObjparDialog = (cmnObjpar) => {
    setVisible(true)
    setObjparTip("CREATE")
    setCmnObjpar({ ...cmnObjpar });
  }
  //  Dialog --->

  const header = renderHeader();
  // heder za filter/>

  const objparTemplate = (rowData) => {
    return (
      <div className="flex flex-wrap gap-1">

        <Button
          type="button"
          icon="pi pi-pencil"
          style={{ width: '24px', height: '24px' }}
          onClick={() => {
            setCmnObjparDialog(rowData)
            setObjparTip("UPDATE")
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
        selection={cmnObjpar}
        loading={loading}
        value={cmnObjpars}
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
        onSelectionChange={(e) => setCmnObjpar(e.value)}
        onRowSelect={onRowSelect}
        onRowUnselect={onRowUnselect}
      >
        <Column
          //bodyClassName="text-center"
          body={objparTemplate}
          exportable={false}
          headerClassName="w-10rem"
          style={{ minWidth: '4rem' }}
        />
        <Column
          field="cpar"
          header={translations[selectedLanguage].Code}
          sortable
          filter
          style={{ width: "20%" }}
        ></Column>
        <Column
          field="npar"
          header={translations[selectedLanguage].Text}
          sortable
          filter
          style={{ width: "40%" }}
        ></Column>
        <Column
          field="begda"
          header={translations[selectedLanguage].Begda}
          sortable
          filter
          style={{ width: "20%" }}
          body={(rowData) => formatDateColumn(rowData, "begda")}
        ></Column> 
        <Column
          field="endda"
          header={translations[selectedLanguage].Endda}
          sortable
          filter
          style={{ width: "20%" }}
          body={(rowData) => formatDateColumn(rowData, "endda")}
        ></Column>  
      </DataTable>
      <Dialog
        header={translations[selectedLanguage].Objpar}
        visible={visible}
        style={{ width: '60%' }}
        onHide={() => {
          setVisible(false);
          setShowMyComponent(false);
        }}
      >
        {showMyComponent && (
          <CmnObjpar
            parameter={"inputTextValue"}
            cmnObjpar={cmnObjpar}
            cmnObj={props.cmnObj}
            handleDialogClose={handleDialogClose}
            setVisible={setVisible}
            dialog={true}
            objparTip={objparTip}
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
