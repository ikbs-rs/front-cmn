import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { Toast } from "primereact/toast";
import { CmnCparService } from "../../service/model/CmnCparService";
import CmnCpar from './cmnCpar';
import { EmptyEntities } from '../../service/model/EmptyEntities';
import { Dialog } from 'primereact/dialog';
import './index.css';
import { translations } from "../../configs/translations";
import DateFunction from "../../utilities/DateFunction";
import env from '../../configs/env';

export default function CmnCparL(props) {

  const objName = "cmn_cpar"
  const selectedLanguage = localStorage.getItem('sl') || 'en'
  const emptyCmnCpar = EmptyEntities[objName]
  const [showMyComponent, setShowMyComponent] = useState(true);
  const [cmnCpars, setCmnCpars] = useState([]);
  const [cmnCpar, setCmnCpar] = useState(emptyCmnCpar);
  const [filters, setFilters] = useState('');
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useRef(null);
  const [visible, setVisible] = useState(false);
  const [cparTip, setCparTip] = useState('');
  const [parentData, setParentData] = useState(null);

  let i = 0
  const handleCancelClick = () => {
    if (props.setCmnCparLVisible)
    props.setCmnCparLVisible(false);
    if (parentData) {
      const dataToSend = { type: 'dataFromIframe', visible: false };
      sendToParent(dataToSend);
    }
  };

  useEffect(() => {
    async function fetchData() {
      try {
          const cmnCparService = new CmnCparService();
          //!!!!! OVDE MI TREBAJU PODACI KOJE PRIMAM SA PARENT KOMPONENTA
          if (props.independent || parentData ) {           
            const data = await cmnCparService.getLista();
            setCmnCpars(data);
            initFilters();
          }
      } catch (error) {
        console.error(error);
        // Obrada greške ako je potrebna
      }
    }
    fetchData();
  }, [parentData]);

  useEffect(() => {
    const handleMessageFromParent = (event) => {
      const receivedData = event.data.data;
      const eOrign = event.origin
      // Provera da li poruka dolazi iz očekivanog izvora
      if (eOrign === `${env.DOMEN}`) {
        // Provera tipa poruke
        if (event.data.type === 'dataUpdate') {
          console.log('Received message from parent on iframe load .... dialog', receivedData);
          // Sačuvaj primljene podatke u promenljivoj
          setParentData(receivedData);
        }
      }
    };
    // Dodavanje event slušača prilikom montiranja komponente
    window.addEventListener('message', handleMessageFromParent);

    // Uklanjanje event slušača prilikom demontiranja komponente
    return () => {
      window.removeEventListener('message', handleMessageFromParent);
    };
  }, []);

  /*
  // Dodajte ovu funkciju za dodavanje slušača događaja za poruke
  const addMessageEventListener = () => {
    window.addEventListener('message', (event) => {
      // Provera da li je poruka poslata sa očekivanog izvora
      if (event.origin === 'http://ws10.ems.local:8354') {
        // Obrada poruke
        const receivedData = event.data;
        console.log('Received message:', receivedData);

        // Opciono: Slanje odgovora nazad roditeljskom dokumentu
        const response = { type: 'response', data: 'Message received!' };
        event.source.postMessage(response, event.origin);
      }
    });
  }
  */
  const sendToParent = (data) => {
    const parentOrigin = `${env.DOMEN}`; // Promenite ovo na stvarni izvor roditeljskog dokumenta
    window.parent.postMessage(data, parentOrigin);
  }

  const handleDialogClose = (newObj) => {
    const localObj = { newObj };

    let _cmnCpars = [...cmnCpars];
    let _cmnCpar = { ...localObj.newObj.obj };
    //setSubmitted(true);
    if (localObj.newObj.cparTip === "CREATE") {
      _cmnCpars.unshift(_cmnCpar);
    } else if (localObj.newObj.cparTip === "UPDATE") {
      const index = findIndexById(localObj.newObj.obj.id);
      _cmnCpars[index] = _cmnCpar;
    } else if ((localObj.newObj.cparTip === "DELETE")) {
      _cmnCpars = cmnCpars.filter((val) => val.id !== localObj.newObj.obj.id);
      toast.current.show({ severity: 'success', summary: 'Successful', detail: 'CmnCpar Delete', life: 3000 });
    } else {
      toast.current.show({ severity: 'success', summary: 'Successful', detail: 'CmnCpar ?', life: 3000 });
    }
    toast.current.show({ severity: 'success', summary: 'Successful', detail: `{${objName}} ${localObj.newObj.cparTip}`, life: 3000 });
    setCmnCpars(_cmnCpars);
    setCmnCpar(emptyCmnCpar);
  };

  const findIndexById = (id) => {
    let index = -1;

    for (let i = 0; i < cmnCpars.length; i++) {
      if (cmnCpars[i].id === id) {
        index = i;
        break;
      }
    }

    return index;
  };

  const openNew = () => {
    setCmnCparDialog(emptyCmnCpar);
  };

  const onRowSelect = (event) => {
    //cmnCpar.begda = event.data.begda
    toast.current.show({
      severity: "info",
      summary: "Action Selected",
      detail: `Id: ${event.data.id} Name: ${event.data.text}`,
      life: 3000,
    });
    // Primer slanja poruke sa podacima na roditeljski dokument
    const dataToSend = { type: 'dataFromIframe', data: {row: event.data}, visible: true };
    sendToParent(dataToSend);
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
        {parentData && (
        <Button label={translations[selectedLanguage].Cancel} icon="pi pi-times" onClick={handleCancelClick} text raised
        />
        )}
        <div className="flex flex-wrap gap-1">
          <Button label={translations[selectedLanguage].New} icon="pi pi-plus" severity="success" onClick={openNew} text raised />
        </div>
        <div className="flex-grow-1"></div>
        <b>{translations[selectedLanguage].CparList}</b>
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

  const setCmnCparDialog = (cmnCpar) => {
    setVisible(true)
    setCparTip("CREATE")
    setCmnCpar(cmnCpar);
  }
  //  Dialog --->

  const header = renderHeader();
  // heder za filter/>

  const parTemplate = (rowData) => {
    return (
      <div className="flex flex-wrap gap-1">

        <Button
          type="button"
          icon="pi pi-pencil"
          style={{ width: '24px', height: '24px' }}
          onClick={() => {
            setCmnCparDialog(rowData)
            setCparTip("UPDATE")
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
        selection={cmnCpar}
        loading={loading}
        value={cmnCpars}
        header={header}
        showGridlines
        removableSort
        filters={filters}
        scrollable
        scrollHeight="640px"
        metaKeySelection={false}
        paginator
        rows={50}
        rowsPerPageOptions={[50, 100, 250, 500]}
        onSelectionChange={(e) => setCmnCpar(e.value)}
        onRowSelect={onRowSelect}
        onRowUnselect={onRowUnselect}
      >
        <Column
          //bodyClassName="text-center"
          body={parTemplate}
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
          header={translations[selectedLanguage].ntp}
          sortable
          filter
          style={{ width: "35%" }}
        ></Column>
        <Column
          field="place"
          header={translations[selectedLanguage].place}
          sortable
          filter
          style={{ width: "20%" }}
        ></Column>
        <Column
          field="activity"
          header={translations[selectedLanguage].activity}
          sortable
          filter
          style={{ width: "20%" }}
        ></Column>
        <Column
          field="pib"
          header={translations[selectedLanguage].pib}
          sortable
          filter
          style={{ width: "20%" }}
        ></Column>
        <Column
          field="idnum"
          header={translations[selectedLanguage].idnum}
          sortable
          filter
          style={{ width: "20%" }}
        ></Column>
        <Column
          field="email"
          header={translations[selectedLanguage].email}
          sortable
          filter
          style={{ width: "20%" }}
        ></Column>        
      </DataTable>
      <Dialog
        header={translations[selectedLanguage].Cpar}
        visible={visible}
        style={{ width: '60%' }}
        onHide={() => {
          setVisible(false);
          setShowMyComponent(false);
        }}
      >
        {showMyComponent && (
          <CmnCpar
            parameter={"inputTextValue"}
            cmnCpar={cmnCpar}
            handleDialogClose={handleDialogClose}
            setVisible={setVisible}
            dialog={true}
            cparTip={cparTip}
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
