import React, { useState, useEffect, useRef } from "react";
import { classNames } from "primereact/utils";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { TriStateCheckbox } from "primereact/tristatecheckbox";
import { Toast } from "primereact/toast";
import { AdmRollactService } from "../../service/model/AdmRollactService";
import AdmRollact from './admRollact';
import { EmptyEntities } from '../../service/model/EmptyEntities';
import { Dialog } from 'primereact/dialog';
import './index.css';
import { translations } from "../../configs/translations";


export default function AdmRollactL(props) {
  const objName = "adm_rollact"
  const selectedLanguage = localStorage.getItem('sl')||'en'
  const emptyAdmRollact = EmptyEntities[objName]
  emptyAdmRollact.roll = props.admRoll.id
  const [showMyComponent, setShowMyComponent] = useState(true);
  const [admRollacts, setAdmRollacts] = useState([]);
  const [admRollact, setAdmRollact] = useState(emptyAdmRollact);
  const [filters, setFilters] = useState('');
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useRef(null);
  const [visible, setVisible] = useState(false);
  const [rollactTip, setRollactTip] = useState('');
  let i = 0
  const handleCancelClick = () => {
    props.setAdmRollactLVisible(false);
  };

  useEffect(() => {
    async function fetchData() {
      try {
        ++i
        if (i < 2) {
          const admRollactService = new AdmRollactService();
          const data = await admRollactService.getARollActRoll(props.admRoll.id);
          setAdmRollacts(data);
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

    let _admRollacts = [...admRollacts];
    let _admRollact = { ...localObj.newObj.obj };

    //setSubmitted(true);
    if (localObj.newObj.rollactTip === "CREATE") {
      _admRollacts.push(_admRollact);
    } else if (localObj.newObj.rollactTip === "UPDATE") {
      const index = findIndexById(localObj.newObj.obj.id);
      _admRollacts[index] = _admRollact;
    } else if ((localObj.newObj.rollactTip === "DELETE")) {
      _admRollacts = admRollacts.filter((val) => val.id !== localObj.newObj.obj.id);
      toast.current.show({ severity: 'success', summary: 'Successful', detail: 'AdmRollact Delete', life: 3000 });
    } else {
      toast.current.show({ severity: 'success', summary: 'Successful', detail: 'AdmRollact ?', life: 3000 });
    }
    toast.current.show({ severity: 'success', summary: 'Successful', detail: `{${objName}} ${localObj.newObj.rollactTip}`, life: 3000 });
    setAdmRollacts(_admRollacts);
    setAdmRollact(emptyAdmRollact);
  };

  const findIndexById = (id) => {
    let index = -1;

    for (let i = 0; i < admRollacts.length; i++) {
      if (admRollacts[i].id === id) {
        index = i;
        break;
      }
    }

    return index;
  };

  const openNew = () => {
    setAdmRollactDialog(emptyAdmRollact);
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
  const cre_actionBodyTemplate = (rowData) => {
    const valid = rowData.cre_action == 1 ? true : false
    return (
      <i
        className={classNames("pi", {
          "text-green-500 pi-check-circle": valid,
          //"text-red-500 pi-times-circle": !valid
        })}
      ></i>
    );
  };
  const upd_actionBodyTemplate = (rowData) => {
    const valid = rowData.upd_action == 1 ? true : false
    return (
      <i
        className={classNames("pi", {
          "text-green-500 pi-check-circle": valid,
          //"text-red-500 pi-times-circle": !valid
        })}
      ></i>
    );
  };
  const del_actionBodyTemplate = (rowData) => {
    const valid = rowData.del_action == 1 ? true : false
    return (
      <i
        className={classNames("pi", {
          "text-green-500 pi-check-circle": valid,
          //"text-red-500 pi-times-circle": !valid
        })}
      ></i>
    );
  };
  const exe_actionBodyTemplate = (rowData) => {
    const valid = rowData.exe_action == 1 ? true : false
    return (
      <i
        className={classNames("pi", {
          "text-green-500 pi-check-circle": valid,
          //"text-red-500 pi-times-circle": !valid
        })}
      ></i>
    );
  };
  const all_actionBodyTemplate = (rowData) => {
    const valid = rowData.all_action == 1 ? true : false
    return (
      <i
        className={classNames("pi", {
          "text-green-500 pi-check-circle": valid,
          //"text-red-500 pi-times-circle": !valid
        })}
      ></i>
    );
  };  
  const all_actionFilterTemplate = (options) => {
    return (
      <div className="flex align-items-center gap-2">
        <label htmlFor="verified-filter" className="font-bold">
        {translations[selectedLanguage].All}
        </label>
        <TriStateCheckbox
          inputId="verified-filter"
          value={options.value}
          onChange={(e) => options.filterCallback(e.value)}
        />
      </div>
    );
  };  
  const cre_actionFilterTemplate = (options) => {
    return (
      <div className="flex align-items-center gap-2">
        <label htmlFor="verified-filter" className="font-bold">
        {translations[selectedLanguage].Creation}
        </label>
        <TriStateCheckbox
          inputId="verified-filter"
          value={options.value}
          onChange={(e) => options.filterCallback(e.value)}
        />
      </div>
    );
  };  
  const upd_actionFilterTemplate = (options) => {
    return (
      <div className="flex align-items-center gap-2">
        <label htmlFor="verified-filter" className="font-bold">
        {translations[selectedLanguage].Updation}
        </label>
        <TriStateCheckbox
          inputId="verified-filter"
          value={options.value}
          onChange={(e) => options.filterCallback(e.value)}
        />
      </div>
    );
  }; 
  const del_actionFilterTemplate = (options) => {
    return (
      <div className="flex align-items-center gap-2">
        <label htmlFor="verified-filter" className="font-bold">
        {translations[selectedLanguage].Deletion}
        </label>
        <TriStateCheckbox
          inputId="verified-filter"
          value={options.value}
          onChange={(e) => options.filterCallback(e.value)}
        />
      </div>
    );
    
  };   
  const exe_actionFilterTemplate = (options) => {
    return (
      <div className="flex align-items-center gap-2">
        <label htmlFor="verified-filter" className="font-bold">
        {translations[selectedLanguage].Execute}
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
  const setAdmRollactDialog = (admRollact) => {
    setVisible(true)
    setRollactTip("CREATE")
    setAdmRollact({ ...admRollact });
  }
  //  Dialog --->

  const header = renderHeader();
  // heder za filter/>

  const rollactTemplate = (rowData) => {
    return (
      <div className="flex flex-wrap gap-1">

        <Button
          type="button"
          icon="pi pi-pencil"
          style={{ width: '24px', height: '24px' }}
          onClick={() => {
            setAdmRollactDialog(rowData)
            setRollactTip("UPDATE")
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
                value={props.admRoll.code}
                disabled={true}
              />
            </div>
            <div className="field col-12 md:col-6">
              <label htmlFor="text">{translations[selectedLanguage].Text}</label>
              <InputText
                id="text"
                value={props.admRoll.textx}
                disabled={true}
              />
            </div>
          </div>
        </div>
      </div>
      <DataTable
        dataKey="id"
        selectionMode="single"
        selection={admRollact}
        loading={loading}
        value={admRollacts}
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
        onSelectionChange={(e) => setAdmRollact(e.value)}
        onRowSelect={onRowSelect}
        onRowUnselect={onRowUnselect}
      >
        <Column
          //bodyClassName="text-center"
          body={rollactTemplate}
          exportable={false}
          headerClassName="w-10rem"
          style={{ minWidth: '4rem' }}
        />
        <Column
          field="ocode"
          header={translations[selectedLanguage].Code}
          sortable
          filter
          style={{ width: "15%" }}
        ></Column>
        <Column
          field="otext"
          header={translations[selectedLanguage].Text}
          sortable
          filter
          style={{ width: "30%" }}
        ></Column>
        <Column
          field="cre_action"
          header={translations[selectedLanguage].Creation}
          sortable
          filter
          filterElement={cre_actionFilterTemplate}
          style={{ width: "10%" }}
          bodyClassName="text-center"
          body={cre_actionBodyTemplate}
        ></Column> 
        <Column
          field="upd_action"
          header={translations[selectedLanguage].Updation}
          sortable
          filter
          filterElement={upd_actionFilterTemplate}
          style={{ width: "10%" }}
          bodyClassName="text-center"
          body={upd_actionBodyTemplate}
        ></Column>  
        <Column
          field="del_action"
          header={translations[selectedLanguage].Deletion}
          sortable
          filter
          filterElement={del_actionFilterTemplate}
          style={{ width: "10%" }}
          bodyClassName="text-center"
          body={del_actionBodyTemplate}
        ></Column> 
        <Column
          field="exe_action"
          header={translations[selectedLanguage].Execute}
          sortable
          filter
          filterElement={exe_actionFilterTemplate}
          style={{ width: "10%" }}
          bodyClassName="text-center"
          body={exe_actionBodyTemplate}
        ></Column>          
        <Column
          field="all_action"
          header={translations[selectedLanguage].All}
          sortable
          filter
          filterElement={all_actionFilterTemplate}
          style={{ width: "10%" }}
          bodyClassName="text-center"
          body={all_actionBodyTemplate}
        ></Column>                        
      </DataTable>
      <Dialog
        header={translations[selectedLanguage].Rollaction}
        visible={visible}
        style={{ width: '70%' }}
        onHide={() => {
          setVisible(false);
          setShowMyComponent(false);
        }}
      >
        {showMyComponent && (
          <AdmRollact
            parameter={"inputTextValue"}
            admRollact={admRollact}
            admRoll={props.admRoll}
            handleDialogClose={handleDialogClose}
            setVisible={setVisible}
            dialog={true}
            rollactTip={rollactTip}
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
