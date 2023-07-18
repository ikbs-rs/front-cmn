import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { Toast } from "primereact/toast";
import { AdmMessageService } from "../../service/model/AdmMessageService";
import AdmAkcija from './admMessage';
import { EmptyEntities } from '../../service/model/EmptyEntities';
import { Dialog } from 'primereact/dialog';
import './index.css';


export default function AdmMessageL(props) {
  const objName = "adm_message"
  const emptyAdmMessage = EmptyEntities[objName]
  const [showMyComponent, setShowMyComponent] = useState(true);
  const [admMessages, setAdmMessages] = useState([]);
  const [admMessage, setAdmMessage] = useState(emptyAdmMessage);
  const [filters, setFilters] = useState('');
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useRef(null);
  const [visible, setVisible] = useState(false);
  const [messageTip, setMessageTip] = useState('');

  useEffect(() => {
    async function fetchData() {
      try {
        const admMessageService = new AdmMessageService();
        const data = await admMessageService.getAdmMessageV();
        setAdmMessages(data);
        initFilters();
      } catch (error) {
        console.error(error);
        // Obrada greške ako je potrebna
      }
    }
    fetchData();
  }, []);

  const handleDialogClose = (newObj) => {
    const localObj = { newObj };

    let _admMessages = [...admMessages];
    let _admMessage = { ...localObj.newObj.obj };

    //setSubmitted(true);
    if (localObj.newObj.messageTip === "CREATE") {
      _admMessages.push(_admMessage);
    } else if (localObj.newObj.messageTip === "UPDATE") {
      const index = findIndexById(localObj.newObj.obj.id);
      _admMessages[index] = _admMessage;
    } else if ((localObj.newObj.messageTip === "DELETE")) {
      _admMessages = admMessages.filter((val) => val.id !== localObj.newObj.obj.id);
      toast.current.show({ severity: 'success', summary: 'Successful', detail: 'AdmMessage Delete', life: 3000 });
    } else {
      toast.current.show({ severity: 'success', summary: 'Successful', detail: 'AdmMessage ?', life: 3000 });
    }
    toast.current.show({ severity: 'success', summary: 'Successful', detail: `{${objName}} ${localObj.newObj.messageTip}`, life: 3000 });
    setAdmMessages(_admMessages);
    setAdmMessage(emptyAdmMessage);
  };

  const findIndexById = (id) => {
    let index = -1;

    for (let i = 0; i < admMessages.length; i++) {
      if (admMessages[i].id === id) {
        index = i;
        break;
      }
    }

    return index;
  };

  const openNew = () => {
    setAdmMessageDialog(emptyAdmMessage);
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
      code: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
      },
      text: {
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
        <div className="flex flex-wrap gap-1">
          <Button label="New" icon="pi pi-plus" severity="success" onClick={openNew} text raised />
        </div>
        <div className="flex-grow-1" />
        <b>Message List</b>
        <div className="flex-grow-1"></div>
        <div className="flex flex-wrap gap-1">
          <span className="p-input-icon-left">
            <i className="pi pi-search" />
            <InputText
              value={globalFilterValue}
              onChange={onGlobalFilterChange}
              placeholder="Keyword Search"
            />
          </span>
          <Button
            type="button"
            icon="pi pi-filter-slash"
            label="Clear"
            outlined
            onClick={clearFilter}
            text raised
          />
        </div>
      </div>
    );
  };

  // <--- Dialog
  const setAdmMessageDialog = (admMessage) => {
    setVisible(true)
    setMessageTip("CREATE")
    setAdmMessage({ ...admMessage });
  }
  //  Dialog --->

  const header = renderHeader();
  // heder za filter/>

  const messageTemplate = (rowData) => {
    return (
      <div className="flex flex-wrap gap-1">

        <Button
          type="button"
          icon="pi pi-pencil"
          style={{ width: '24px', height: '24px' }}
          onClick={() => {
            setAdmMessageDialog(rowData)
            setMessageTip("UPDATE")
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
        selection={admMessage}
        loading={loading}
        value={admMessages}
        header={header}
        showGridlines
        removableSort
        filters={filters}
        scrollable
        scrollHeight="750px"
        virtualScrollerOptions={{ itemSize: 46 }}
        tableStyle={{ minWidth: "50rem" }}
        metaKeySelection={false}
        paginator
        rows={10}
        rowsPerPageOptions={[5, 10, 25, 50]}
        onSelectionChange={(e) => setAdmMessage(e.value)}
        onRowSelect={onRowSelect}
        onRowUnselect={onRowUnselect}
      >
        <Column
          //bodyClassName="text-center"
          body={messageTemplate}
          exportable={false}
          headerClassName="w-10rem"
          style={{ minWidth: '4rem' }}
        />
        <Column
          field="code"
          header="Code"
          sortable
          filter
          style={{ width: "20%" }}
        ></Column>
        <Column
          field="text"
          header="Text"
          sortable
          filter
          style={{ width: "75%" }}
        ></Column>
      </DataTable>
      <Dialog
        header="Message"
        visible={visible}
        style={{ width: '70%' }}
        onHide={() => {
          setVisible(false);
          setShowMyComponent(false);
        }}
      >
        {showMyComponent && (
          <AdmAkcija
            parameter={"inputTextValue"}
            admMessage={admMessage}
            handleDialogClose={handleDialogClose}
            setVisible={setVisible}
            dialog={true}
            messageTip={messageTip}
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
