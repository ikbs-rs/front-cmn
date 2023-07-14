import React, { useState, useEffect, useRef } from "react";
import { classNames } from "primereact/utils";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { TriStateCheckbox } from "primereact/tristatecheckbox";
import { Toast } from "primereact/toast";
import { AdmActionService } from "../../service/model/AdmActionService";
import AdmAkcija from './admAction';
import { EmptyEntities } from '../../service/model/EmptyEntities';
import { Dialog } from 'primereact/dialog';


export default function AdmActionL() {
  const objName = "adm_action"
  const emptyAdmAction = EmptyEntities[objName]
  const [showMyComponent, setShowMyComponent] = useState(true);
  const [admActions, setAdmActions] = useState([]);
  const [admAction, setAdmAction] = useState(emptyAdmAction);
  const [filters, setFilters] = useState('');
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useRef(null);
  const [visible, setVisible] = useState(false);
  const [actionTip, setActionTip] = useState('');

  useEffect(() => {
    async function fetchData() {
      try {
        const admActionService = new AdmActionService();
        const data = await admActionService.getAdmActionV();
        setAdmActions(data);
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

    let _admActions = [...admActions];
    let _admAction = { ...localObj.newObj.obj };

    //setSubmitted(true);
    if (localObj.newObj.actionTip === "CREATE") {
      _admActions.push(_admAction);
    } else if (localObj.newObj.actionTip === "UPDATE") {
      const index = findIndexById(localObj.newObj.obj.id);
      _admActions[index] = _admAction;
    } else if ((localObj.newObj.actionTip === "DELETE")) {
      _admActions = admActions.filter((val) => val.id !== localObj.newObj.obj.id);
      toast.current.show({ severity: 'success', summary: 'Successful', detail: 'AdmAction Delete', life: 3000 });
    } else {
      toast.current.show({ severity: 'success', summary: 'Successful', detail: 'AdmAction ?', life: 3000 });
    }
    toast.current.show({ severity: 'success', summary: 'Successful', detail: `{${objName}} ${localObj.newObj.actionTip}`, life: 3000 });
    setAdmActions(_admActions);
    setAdmAction(emptyAdmAction);
  };

  const findIndexById = (id) => {
    let index = -1;

    for (let i = 0; i < admActions.length; i++) {
      if (admActions[i].id === id) {
        index = i;
        break;
      }
    }

    return index;
  };

  const openNew = () => {
    setAdmActionDialog(emptyAdmAction);
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
          <Button label="New" icon="pi pi-plus" severity="success" onClick={openNew} text raised />
        </div>
        <div className="flex-grow-1" />
        <b>Action List</b>
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

  const validBodyTemplate = (rowData) => {
    return (
      <i
        className={classNames("pi", {
          "text-green-500 pi-check-circle": rowData.valid,
          "text-red-500 pi-times-circle": !rowData.valid,
        })}
      ></i>
    );
  };

  const validFilterTemplate = (options) => {
    return (
      <div className="flex align-items-center gap-2">
        <label htmlFor="verified-filter" className="font-bold">
          Valid
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
  const setAdmActionDialog = (admAction) => {
    console.log("editData", admAction)
    setVisible(true)
    setActionTip("CREATE")
    setAdmAction({ ...admAction });
  }
  //  Dialog --->

  const header = renderHeader();
  // heder za filter/>

  const actionTemplate = (rowData) => {
    return (
      <div className="flex flex-wrap gap-1">

        <Button
          type="button"
          icon="pi pi-pencil"
          style={{ width: '24px', height: '24px' }}
          onClick={() => {
            setAdmActionDialog(rowData)
            setActionTip("UPDATE")
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
        selection={admAction}
        loading={loading}
        value={admActions}
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
        onSelectionChange={(e) => setAdmAction(e.value)}
        onRowSelect={onRowSelect}
        onRowUnselect={onRowUnselect}
      >
        <Column
          field="code"
          header="Code"
          sortable
          filter
          style={{ width: "25%" }}
        ></Column>
        <Column
          field="text"
          header="Text"
          sortable
          filter
          style={{ width: "60%" }}
        ></Column>
        <Column
          field="valid"
          filterField="valid"
          dataType="numeric"
          header="Valid"
          sortable
          filter
          filterElement={validFilterTemplate}
          style={{ width: "15%" }}
          bodyClassName="text-center"
          body={validBodyTemplate}
        ></Column>
        <Column
          //bodyClassName="text-center"
          body={actionTemplate}
          exportable={false}
          headerClassName="w-10rem"
          style={{ minWidth: '4rem' }}
        />
      </DataTable>
      <Dialog
        header="Action"
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
            admAction={admAction}
            handleDialogClose={handleDialogClose}
            setVisible={setVisible}
            dialog={true}
            actionTip={actionTip}
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
