import React, { useState, useEffect, useRef } from "react";
import { classNames } from "primereact/utils";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { TriStateCheckbox } from "primereact/tristatecheckbox";
import { Toast } from "primereact/toast";
import { CmnTerrService } from "../../service/model/CmnTerrService";
import CmnTerr from './cmnTerr';
import { EmptyEntities } from '../../service/model/EmptyEntities';
import { Dialog } from 'primereact/dialog';
import './index.css';
import { translations } from "../../configs/translations";
import DateFunction from "../../utilities/DateFunction";
import CmnTerrattsL from './cmnTerrattsL';
import CmnTerrlinkL from './cmnTerrlinkL';


export default function CmnTerrL(props) {

  const objName = "cmn_terr"
  const selectedLanguage = localStorage.getItem('sl') || 'en'
  const emptyCmnTerr = EmptyEntities[objName]
  const [showMyComponent, setShowMyComponent] = useState(true);
  const [cmnTerrs, setCmnTerrs] = useState([]);
  const [cmnTerr, setCmnTerr] = useState(emptyCmnTerr);
  const [filters, setFilters] = useState('');
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useRef(null);
  const [visible, setVisible] = useState(false);
  const [terrTip, setTerTip] = useState('');
  const [cmnTerrattsLVisible, setCmnTerrattsLVisible] = useState(false);
  const [cmnTerrlinkLVisible, setCmnTerrlinkLVisible] = useState(false);
  let i = 0
  const handleCancelClick = () => {
    props.setCmnTerrLVisible(false);
  };

  useEffect(() => {
    async function fetchData() {
      try {
        ++i
        if (i < 2) {
          const cmnTerrService = new CmnTerrService();
          const data = await cmnTerrService.getLista();
          setCmnTerrs(data);

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

    let _cmnTerrs = [...cmnTerrs];
    let _cmnTerr = { ...localObj.newObj.obj };
    //setSubmitted(true);
    if (localObj.newObj.terrTip === "CREATE") {
      _cmnTerrs.push(_cmnTerr);
    } else if (localObj.newObj.terrTip === "UPDATE") {
      const index = findIndexById(localObj.newObj.obj.id);
      _cmnTerrs[index] = _cmnTerr;
    } else if ((localObj.newObj.terrTip === "DELETE")) {
      _cmnTerrs = cmnTerrs.filter((val) => val.id !== localObj.newObj.obj.id);
      toast.current.show({ severity: 'success', summary: 'Successful', detail: 'CmnTerr Delete', life: 3000 });
    } else {
      toast.current.show({ severity: 'success', summary: 'Successful', detail: 'CmnTerr ?', life: 3000 });
    }
    toast.current.show({ severity: 'success', summary: 'Successful', detail: `{${objName}} ${localObj.newObj.terrTip}`, life: 3000 });
    setCmnTerrs(_cmnTerrs);
    setCmnTerr(emptyCmnTerr);
  };

  const handleCmnTerrattsLDialogClose = (newObj) => {
    const localObj = { newObj };
  };

  const handleCmnTerrlinkLDialogClose = (newObj) => {
    const localObj = { newObj };
  };

  const findIndexById = (id) => {
    let index = -1;

    for (let i = 0; i < cmnTerrs.length; i++) {
      if (cmnTerrs[i].id === id) {
        index = i;
        break;
      }
    }

    return index;
  };

  const openNew = () => {
    setCmnTerrDialog(emptyCmnTerr);
  };

  const openParAtt = () => {
    setCmnTerrattsLDialog();
  };

  const openParLink = () => {
    setCmnTerrlinkLDialog();
  };

  const onRowSelect = (event) => {
    //cmnTerr.begda = event.data.begda
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
          <Button label={translations[selectedLanguage].Attributes} icon="pi pi-table" onClick={openParAtt} text raised disabled={!cmnTerr} />
        </div> 
        <div className="flex flex-wrap gap-1">
          <Button label={translations[selectedLanguage].Links} icon="pi pi-sitemap" onClick={openParLink} text raised disabled={!cmnTerr} />
        </div>                
        <div className="flex-grow-1"></div>
        <b>{translations[selectedLanguage].TerrLista}</b>
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

  const setCmnTerrattsLDialog = () => {
    setShowMyComponent(true);
    setCmnTerrattsLVisible(true);
  } 

  const setCmnTerrlinkLDialog = () => {
    setShowMyComponent(true);
    setCmnTerrlinkLVisible(true);
  } 

  const setCmnTerrDialog = (cmnTerr) => {
    setVisible(true)
    setTerTip("CREATE")
    setCmnTerr({ ...cmnTerr });
  }
  //  Dialog --->

  const header = renderHeader();
  // heder za filter/>

  const terrTemplate = (rowData) => {
    return (
      <div className="flex flex-wrap gap-1">

        <Button
          type="button"
          icon="pi pi-pencil"
          style={{ width: '24px', height: '24px' }}
          onClick={() => {
            setCmnTerrDialog(rowData)
            setTerTip("UPDATE")
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
        selection={cmnTerr}
        loading={loading}
        value={cmnTerrs}
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
        onSelectionChange={(e) => setCmnTerr(e.value)}
        onRowSelect={onRowSelect}
        onRowUnselect={onRowUnselect}
      >
        <Column
          //bodyClassName="text-center"
          body={terrTemplate}
          exportable={false}
          headerClassName="w-10rem"
          style={{ minWidth: '4rem' }}
        />
        <Column
          field="code"
          header={translations[selectedLanguage].code}
          sortable
          filter
          style={{ width: "20%" }}
        ></Column> 
        <Column
          field="text"
          header={translations[selectedLanguage].text}
          sortable
          filter
          style={{ width: "20%" }}
        ></Column>                
        <Column
          field="ntp"
          header={translations[selectedLanguage].Text}
          sortable
          filter
          style={{ width: "35%" }}
        ></Column>
        <Column
          field="postcode"
          header={translations[selectedLanguage].postcode}
          sortable
          filter
          style={{ width: "20%" }}
        ></Column>
      </DataTable>
      <Dialog
        header={translations[selectedLanguage].Terr}
        visible={visible}
        style={{ width: '60%' }}
        onHide={() => {
          setVisible(false);
          setShowMyComponent(false);
        }}
      >
        {showMyComponent && (
          <CmnTerr
            parameter={"inputTextValue"}
            cmnTerr={cmnTerr}
            handleDialogClose={handleDialogClose}
            setVisible={setVisible}
            dialog={true}
            terrTip={terrTip}
          />
        )}
        <div className="p-dialog-header-icons" style={{ display: 'none' }}>
          <button className="p-dialog-header-close p-link">
            <span className="p-dialog-header-close-icon pi pi-times"></span>
          </button>
        </div>
      </Dialog>
      <Dialog
        header={translations[selectedLanguage].TerrattsLista}
        visible={cmnTerrattsLVisible}
        style={{ width: '70%' }}
        onHide={() => {
          setCmnTerrattsLVisible(false);
          setShowMyComponent(false);
        }}
      >
        {showMyComponent && (
          <CmnTerrattsL
            parameter={"inputTextValue"}
            cmnTerr={cmnTerr}
            handleCmnTerrattsLDialogClose={handleCmnTerrattsLDialogClose}
            setCmnTerrattsLVisible={setCmnTerrattsLVisible}
            dialog={true}
            lookUp={false}
          />
        )}
      </Dialog>       
      <Dialog
        header={translations[selectedLanguage].TerrlinkLista}
        visible={cmnTerrlinkLVisible}
        style={{ width: '70%' }}
        onHide={() => {
          setCmnTerrlinkLVisible(false);
          setShowMyComponent(false);
        }}
      >
        {showMyComponent && (
          <CmnTerrlinkL
            parameter={"inputTextValue"}
            cmnTerr={cmnTerr}
            handleCmnTerrlinkLDialogClose={handleCmnTerrlinkLDialogClose}
            setCmnTerrlinkLVisible={setCmnTerrlinkLVisible}
            dialog={true}
            lookUp={false}
          />
        )}
      </Dialog>        
    </div>
  );
}
