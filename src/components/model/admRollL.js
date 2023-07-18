import React, { useState, useEffect, useRef } from "react";
import { classNames } from "primereact/utils";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { TriStateCheckbox } from "primereact/tristatecheckbox";
import { Toast } from "primereact/toast";
import { AdmRollService } from "../../service/model/AdmRollService";
import AdmRollactL from './admRollactL';
import AdmRollstrL from './admRollstrL';
import AdmRolllinkL from './admRolllinkL';
import AdmUserPermissUL from './admUserPermissUL';
import { EmptyEntities } from '../../service/model/EmptyEntities';
import { Dialog } from 'primereact/dialog';
import './index.css';
import { translations } from "../../configs/translations";
import AdmRoll from "./admRoll";


export default function AdmRollL(props) {
  const objName = "adm_roll"
  const selectedLanguage = localStorage.getItem('sl')||'en'
  const emptyAdmRoll = EmptyEntities[objName]
  const [showMyComponent, setShowMyComponent] = useState(true);
  const [admRolls, setAdmRolls] = useState([]);
  const [admRoll, setAdmRoll] = useState(emptyAdmRoll);
  const [filters, setFilters] = useState('');
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useRef(null);
  const [visible, setVisible] = useState(false);
  const [rollTip, setRollTip] = useState('');
  const [admRollactLVisible, setAdmRollactLVisible] = useState(false);
  const [admRollstrLVisible, setAdmRollstrLVisible] = useState(false);
  const [admRolllinkLVisible, setAdmRolllinkLVisible] = useState(false);
  const [admUserPermissULVisible, setAdmUserPermissULVisible] = useState(false);
  let i = 0
  useEffect(() => {
    async function fetchData() {
      try {
        ++i
        if (i < 2) {
          const admRollService = new AdmRollService();
          const data = await admRollService.getAdmRollX();
          setAdmRolls(data);
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

    let _admRolls = [...admRolls];
    let _admRoll = { ...localObj.newObj.obj };

    //setSubmitted(true);
    if (localObj.newObj.rollTip === "CREATE") {
      _admRolls.push(_admRoll);
    } else if (localObj.newObj.rollTip === "UPDATE") {
      const index = findIndexById(localObj.newObj.obj.id);
      _admRolls[index] = _admRoll;
    } else if ((localObj.newObj.rollTip === "DELETE")) {
      _admRolls = admRolls.filter((val) => val.id !== localObj.newObj.obj.id);
      toast.current.show({ severity: 'success', summary: 'Successful', detail: 'AdmRoll Delete', life: 3000 });
    } else {
      toast.current.show({ severity: 'success', summary: 'Successful', detail: 'AdmRoll ?', life: 3000 });
    }
    toast.current.show({ severity: 'success', summary: 'Successful', detail: `{${objName}} ${localObj.newObj.rollTip}`, life: 3000 });
    setAdmRolls(_admRolls);
    setAdmRoll(emptyAdmRoll);
  };

  const handleAdmRollactLDialogClose = (newObj) => {
    const localObj = { newObj };
  };

  const handleAdmRolllinkLDialogClose = (newObj) => {
    const localObj = { newObj };
  };

  const handleAdmUserPermissULDialogClose = (newObj) => {
    const localObj = { newObj };
  };

  const findIndexById = (id) => {
    let index = -1;

    for (let i = 0; i < admRolls.length; i++) {
      if (admRolls[i].id === id) {
        index = i;
        break;
      }
    }

    return index;
  };

  const openNew = () => {
    setAdmRollDialog(emptyAdmRoll);
  };

  const openRollstr = () => {
    setAdmRollstrLDialog();
  };

  const openRollAct = () => {
    setAdmRollactLDialog();
  };
  
  const openRolllink = () => {
    setAdmRolllinkLDialog();
  };
  
  const openUserpermissU = () => {
    setAdmUserpermissULDialog();
  };

  const onRowSelect = (event) => {
    toast.current.show({
      severity: "info",
      summary: "Action Selected",
      detail: `Id: ${event.data.id} Name: ${event.data.textx}`,
      life: 3000,
    });
  };

  const onRowUnselect = (event) => {
    toast.current.show({
      severity: "warn",
      summary: "Action Unselected",
      detail: `Id: ${event.data.id} Name: ${event.data.textx}`,
      life: 3000,
    });
  };
  // <heder za filter
  const initFilters = () => {
    setFilters({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      code: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
      },
      textx: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
      },
      strukturna: { value: null, matchMode: FilterMatchMode.EQUALS },
      valid: { value: null, matchMode: FilterMatchMode.EQUALS },
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
        <div className="flex flex-wrap gap-1">
          <Button label={translations[selectedLanguage].New} icon="pi pi-plus" severity="success" onClick={openNew} text raised />
        </div>
        <div className="flex flex-wrap gap-1">
          <Button label={translations[selectedLanguage].Structures} icon="pi pi-building" onClick={openRollstr} text raised disabled={!admRoll} />
        </div>
        <div className="flex flex-wrap gap-1">
          <Button label={translations[selectedLanguage].Actions} icon="pi pi-shield" onClick={openRollAct} text raised disabled={!admRoll} />
        </div>
        <div className="flex flex-wrap gap-1">
          <Button label={translations[selectedLanguage].Links} icon="pi pi-sitemap" onClick={openRolllink} text raised disabled={!admRoll} />
        </div>
        <div className="flex flex-wrap gap-1">
          <Button label={translations[selectedLanguage].Users} icon="pi pi-users" onClick={openUserpermissU } text raised disabled={!admRoll} />
        </div>
        <div className="flex-grow-1" />
        <b>{translations[selectedLanguage].RollsLista}</b>
        <div className="flex-grow-1"></div>
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

  const validBodyTemplate = (rowData) => {
    const valid = rowData.valid == 1 ? true : false
    return (
      <i
        className={classNames("pi", {
          "text-green-500 pi-check-circle": valid,
          "text-red-500 pi-times-circle": !valid
        })}
      ></i>
    );
  };

  const strukturnaBodyTemplate = (rowData) => {
    const strukturna = rowData.strukturna == 'D' ? true : false
    return (
      <i
        className={classNames("pi", {
          "text-green-500 pi-check-circle": strukturna,
          "text-red-500 pi-times-circle": !strukturna
        })}
      ></i>
    );
  };  

  const validFilterTemplate = (options) => {
    return (
      <div className="flex align-items-center gap-2">
        <label htmlFor="verified-filter" className="font-bold">
        label={translations[selectedLanguage].Valid}
        </label>
        <TriStateCheckbox
          inputId="verified-filter"
          value={options.value}
          onChange={(e) => options.filterCallback(e.value)}
        />
      </div>
    );
  };

  const strukturnaFilterTemplate = (options) => {
    return (
      <div className="flex align-items-center gap-2">
        <label htmlFor="verified-filter" className="font-bold">
        label={translations[selectedLanguage].Structures}
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
  const setAdmRollDialog = (admRoll) => {
    setVisible(true)
    setRollTip("CREATE")
    setAdmRoll({ ...admRoll });
  }
  const setAdmRollstrLDialog = () => {
    setShowMyComponent(true);
    setAdmRollstrLVisible(true);

  }   
  const setAdmRollactLDialog = () => {
    setShowMyComponent(true);
    setAdmRollactLVisible(true);

  }  
  const setAdmRolllinkLDialog = () => {
    setShowMyComponent(true);
    setAdmRolllinkLVisible(true);

  }  
  const setAdmUserpermissULDialog = () => {
    setShowMyComponent(true);
    setAdmUserPermissULVisible(true);

  }         
  //  Dialog --->

  const header = renderHeader();
  // heder za filter/>

  const rollTemplate = (rowData) => {
    return (
      <div className="flex flex-wrap gap-1">

        <Button
          type="button"
          icon="pi pi-pencil"
          style={{ width: '24px', height: '24px' }}
          onClick={() => {
            setAdmRollDialog(rowData)
            setRollTip("UPDATE")
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
        selection={admRoll}
        loading={loading}
        value={admRolls}
        header={header}
        showGridlines
        removableSort
        filters={filters}
        scrollable
        sortField="code"
        sortOrder={1}
        scrollHeight="750px"
        virtualScrollerOptions={{ itemSize: 46 }}
        tableStyle={{ minWidth: "50rem" }}
        metaKeySelection={false}
        paginator
        rows={10}
        rowsPerPageOptions={[5, 10, 25, 50]}
        onSelectionChange={(e) => setAdmRoll(e.value)}
        onRowSelect={onRowSelect}
        onRowUnselect={onRowUnselect}
      >
        <Column
          //bodyClassName="text-center"
          body={rollTemplate}
          exportable={false}
          headerClassName="w-10rem"
          style={{ minWidth: '4rem' }}
        />
        <Column
          field="code"
          header={translations[selectedLanguage].Code}
          sortable
          filter
          style={{ width: "25%" }}
        ></Column>
        <Column
          field="textx"
          header={translations[selectedLanguage].Text}
          sortable
          filter
          style={{ width: "60%" }}
        ></Column>
        
        <Column
          field="strukturna"
          filterField="strukturna"
          dataType="text"
          header={translations[selectedLanguage].Structures}
          sortable
          filter
          filterElement={strukturnaFilterTemplate}
          style={{ width: "15%" }}
          bodyClassName="text-center"
          body={strukturnaBodyTemplate}
        ></Column>       
   
        <Column
          field="valid"
          filterField="valid"
          dataType="numeric"
          header={translations[selectedLanguage].Valid}
          sortable
          filter
          filterElement={validFilterTemplate}
          style={{ width: "15%" }}
          bodyClassName="text-center"
          body={validBodyTemplate}
        ></Column>
      </DataTable>
      <Dialog
        header={translations[selectedLanguage].Roll}
        visible={visible}
        style={{ width: '70%' }}
        onHide={() => {
          setVisible(false);
          setShowMyComponent(false);
        }}
      >
        {showMyComponent && (
          <AdmRoll
            parameter={"inputTextValue"}
            admRoll={admRoll}
            handleDialogClose={handleDialogClose}
            setVisible={setVisible}
            dialog={true}
            rollTip={rollTip}
          />
        )}
      </Dialog>
      <Dialog
        header={translations[selectedLanguage].Rollstructures}
        visible={admRollstrLVisible}
        style={{ width: '70%' }}
        onHide={() => {
          setAdmRollstrLVisible(false);
          setShowMyComponent(false);
        }}
      >
        {showMyComponent && (
          <AdmRollstrL
            parameter={"inputTextValue"}
            admRoll={admRoll}
            handleAdmRollactLDialogClose={handleAdmRollactLDialogClose}
            setAdmRollstrLVisible={setAdmRollstrLVisible}
            dialog={true}
            lookUp={false}
          />
        )}
      </Dialog>      
      <Dialog
        header={translations[selectedLanguage].Rollactions}
        visible={admRollactLVisible}
        style={{ width: '70%' }}
        onHide={() => {
          setAdmRollactLVisible(false);
          setShowMyComponent(false);
        }}
      >
        {showMyComponent && (
          <AdmRollactL
            parameter={"inputTextValue"}
            admRoll={admRoll}
            handleAdmRollactLDialogClose={handleAdmRollactLDialogClose}
            setAdmRollactLVisible={setAdmRollactLVisible}
            dialog={true}
            lookUp={false}
          />
        )}
      </Dialog> 
      <Dialog
        header={translations[selectedLanguage].Rolllinks}
        visible={admRolllinkLVisible}
        style={{ width: '70%' }}
        onHide={() => {
          setAdmRolllinkLVisible(false);
          setShowMyComponent(false);
        }}
      >
        {showMyComponent && (
          <AdmRolllinkL
            parameter={"inputTextValue"}
            admRoll={admRoll}
            handleAdmRolllinkLDialogClose={handleAdmRolllinkLDialogClose}
            setAdmRolllinkLVisible={setAdmRolllinkLVisible}
            dialog={true}
            lookUp={false}
          />
        )}
      </Dialog>   
      <Dialog
        header={translations[selectedLanguage].Userspermiss}
        visible={admUserPermissULVisible}
        style={{ width: '70%' }}
        onHide={() => {
          setAdmUserPermissULVisible(false);
          setShowMyComponent(false);
        }}
      >
        {showMyComponent && (
          <AdmUserPermissUL
            parameter={"inputTextValue"}
            admRoll={admRoll}
            handleAdmUserPermissULDialogClose={handleAdmUserPermissULDialogClose}
            setAdmUserPermissULVisible={setAdmUserPermissULVisible}
            dialog={true}
            lookUp={false}
          />
        )}
      </Dialog>          
      <div className="p-dialog-header-icons" style={{ display: 'none' }}>
          <button className="p-dialog-header-close p-link">
            <span className="p-dialog-header-close-icon pi pi-times"></span>
          </button>
        </div>             
    </div>
  );
}
