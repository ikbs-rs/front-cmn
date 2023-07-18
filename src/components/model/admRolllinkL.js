import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { Toast } from "primereact/toast";
import { AdmRolllinkService } from "../../service/model/AdmRolllinkService";
import AdmRolllink from './admRolllink';
import { EmptyEntities } from '../../service/model/EmptyEntities';
import { Dialog } from 'primereact/dialog';
import './index.css';
import { translations } from "../../configs/translations";


export default function AdmRolllinkL(props) {
  
  const objName = "adm_rolllink"
  const selectedLanguage = localStorage.getItem('sl')||'en'
  const emptyAdmRolllink = EmptyEntities[objName]
  emptyAdmRolllink.roll2 = props.admRoll.id
  emptyAdmRolllink.roll1 = null
  const [showMyComponent, setShowMyComponent] = useState(true);
  const [admRolllinks, setAdmRolllinks] = useState([]);
  const [admRolllink, setAdmRolllink] = useState(emptyAdmRolllink);
  const [filters, setFilters] = useState('');
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useRef(null);
  const [visible, setVisible] = useState(false);
  const [rollLinkTip, setRolllinkTip] = useState('');
  let i = 0

  const handleCancelClick = () => {
    props.setAdmRolllinkLVisible(false);
  };

  useEffect(() => {
    async function fetchData() {
      try {
        ++i
        if (i < 2) {
          const admRolllinkService = new AdmRolllinkService();
          const data = await admRolllinkService.getAdmRolllinkRoll(props.admRoll.id);
         
          setAdmRolllinks(data);
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

    let _admRolllinks = [...admRolllinks];
    let _admRolllink = { ...localObj.newObj.obj };

    //setSubmitted(true);
    if (localObj.newObj.rollLinkTip === "CREATE") {
      _admRolllinks.push(_admRolllink);
    } else if (localObj.newObj.rollLinkTip === "UPDATE") {
      const index = findIndexById(localObj.newObj.obj.id);
      _admRolllinks[index] = _admRolllink;
    } else if ((localObj.newObj.rollLinkTip === "DELETE")) {
      _admRolllinks = admRolllinks.filter((val) => val.id !== localObj.newObj.obj.id);
      toast.current.show({ severity: 'success', summary: 'Successful', detail: 'AdmRolllink Delete', life: 3000 });
    } else {
      toast.current.show({ severity: 'success', summary: 'Successful', detail: 'AdmRolllink ?', life: 3000 });
    }
    toast.current.show({ severity: 'success', summary: 'Successful', detail: `{${objName}} ${localObj.newObj.rollLinkTip}`, life: 3000 });
    setAdmRolllinks(_admRolllinks);
    setAdmRolllink(emptyAdmRolllink);
  };

  const findIndexById = (id) => {
    let index = -1;

    for (let i = 0; i < admRolllinks.length; i++) {
      if (admRolllinks[i].id === id) {
        index = i;
        break;
      }
    }

    return index;
  };

  const openNew = () => {
    setAdmRolllinkDialog(emptyAdmRolllink);
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
      rcode: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
      },
      rtext: {
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

  // <--- Dialog
  const setAdmRolllinkDialog = (admRolllink) => {
    setVisible(true)
    setRolllinkTip("CREATE")
    setAdmRolllink({ ...admRolllink });
  }
  //  Dialog --->

  const header = renderHeader();
  // heder za filter/>

  const rollLinkTemplate = (rowData) => {
    return (
      <div className="flex flex-wrap gap-1">

        <Button
          type="button"
          icon="pi pi-pencil"
          style={{ width: '24px', height: '24px' }}
          onClick={() => {
            setAdmRolllinkDialog(rowData)
            setRolllinkTip("UPDATE")
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
        selection={admRolllink}
        loading={loading}
        value={admRolllinks}
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
        onSelectionChange={(e) => setAdmRolllink(e.value)}
        onRowSelect={onRowSelect}
        onRowUnselect={onRowUnselect}
      >
        <Column
          //bodyClassName="text-center"
          body={rollLinkTemplate}
          exportable={false}
          headerClassName="w-10rem"
          style={{ minWidth: '4rem' }}
        />
        <Column
          field="ocode"
          header={translations[selectedLanguage].Rollcode}
          sortable
          filter
          style={{ width: "20%" }}
        ></Column>
        <Column
          field="otext"
          header={translations[selectedLanguage].Roll}
          sortable
          filter
          style={{ width: "45%" }}
        ></Column>
        <Column
          field="link"
          header={translations[selectedLanguage].Link}
          sortable
          filter
          style={{ width: "35%" }}
        ></Column>        
      </DataTable>
      <Dialog
        header={translations[selectedLanguage].Rolllink}
        visible={visible}
        style={{ width: '70%' }}
        onHide={() => {
          setVisible(false);
          setShowMyComponent(false);
        }}
      >
        {showMyComponent && (
          <AdmRolllink
            parameter={"inputTextValue"}
            admRolllink={admRolllink}
            admRoll={props.admRoll}
            handleDialogClose={handleDialogClose}
            setVisible={setVisible}
            dialog={true}
            rollLinkTip={rollLinkTip}
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
