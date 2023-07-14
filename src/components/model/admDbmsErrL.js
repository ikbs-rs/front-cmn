import React, { useState, useEffect, useRef } from "react";
import { classNames } from "primereact/utils";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { TriStateCheckbox } from "primereact/tristatecheckbox";
import { Toast } from "primereact/toast";
import { AdmDbmsErrService } from "../../service/model/AdmDbmsErrService";
import AdmAkcija from './admDbmsErr';
import { EmptyEntities } from '../../service/model/EmptyEntities';
import { Dialog } from 'primereact/dialog';


export default function AdmDbmsErrL() {
  const objName = "adm_dbmserr"
  const emptyAdmDbmsErr = EmptyEntities[objName]
  const [showMyComponent, setShowMyComponent] = useState(true);
  const [admDbmsErrs, setAdmDbmsErrs] = useState([]);
  const [admDbmsErr, setAdmDbmsErr] = useState(emptyAdmDbmsErr);
  const [filters, setFilters] = useState('');
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useRef(null);
  const [visible, setVisible] = useState(false);
  const [dbmsErrTip, setDbmsErrTip] = useState('');

  useEffect(() => {
    async function fetchData() {
      try {
        const admDbmsErrService = new AdmDbmsErrService();
        const data = await admDbmsErrService.getAdmDbmsErrV();
        setAdmDbmsErrs(data);
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

    let _admDbmsErrs = [...admDbmsErrs];
    let _admDbmsErr = { ...localObj.newObj.obj };

    //setSubmitted(true);
    if (localObj.newObj.dbmsErrTip === "CREATE") {
      _admDbmsErrs.push(_admDbmsErr);
    } else if (localObj.newObj.dbmsErrTip === "UPDATE") {
      const index = findIndexById(localObj.newObj.obj.id);
      _admDbmsErrs[index] = _admDbmsErr;
    } else if ((localObj.newObj.dbmsErrTip === "DELETE")) {
      _admDbmsErrs = admDbmsErrs.filter((val) => val.id !== localObj.newObj.obj.id);
      toast.current.show({ severity: 'success', summary: 'Successful', detail: 'AdmDbmsErr Delete', life: 3000 });
    } else {
      toast.current.show({ severity: 'success', summary: 'Successful', detail: 'AdmDbmsErr ?', life: 3000 });
    }
    toast.current.show({ severity: 'success', summary: 'Successful', detail: `{${objName}} ${localObj.newObj.dbmsErrTip}`, life: 3000 });
    setAdmDbmsErrs(_admDbmsErrs);
    setAdmDbmsErr(emptyAdmDbmsErr);
  };

  const findIndexById = (id) => {
    let index = -1;

    for (let i = 0; i < admDbmsErrs.length; i++) {
      if (admDbmsErrs[i].id === id) {
        index = i;
        break;
      }
    }

    return index;
  };

  const openNew = () => {
    setAdmDbmsErrDialog(emptyAdmDbmsErr);
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
        <b>Dbms Error List</b>
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
  const setAdmDbmsErrDialog = (admDbmsErr) => {
    console.log("editData", admDbmsErr)
    setVisible(true)
    setDbmsErrTip("CREATE")
    setAdmDbmsErr({ ...admDbmsErr });
  }
  //  Dialog --->

  const header = renderHeader();
  // heder za filter/>

  const dbmsErrTemplate = (rowData) => {
    return (
      <div className="flex flex-wrap gap-1">

        <Button
          type="button"
          icon="pi pi-pencil"
          style={{ width: '24px', height: '24px' }}
          onClick={() => {
            setAdmDbmsErrDialog(rowData)
            setDbmsErrTip("UPDATE")
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
        selection={admDbmsErr}
        loading={loading}
        value={admDbmsErrs}
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
        onSelectionChange={(e) => setAdmDbmsErr(e.value)}
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
          //bodyClassName="text-center"
          body={dbmsErrTemplate}
          exportable={false}
          headerClassName="w-10rem"
          style={{ minWidth: '4rem' }}
        />
      </DataTable>
      <Dialog
        header="DbmsErr"
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
            admDbmsErr={admDbmsErr}
            handleDialogClose={handleDialogClose}
            setVisible={setVisible}
            dialog={true}
            dbmsErrTip={dbmsErrTip}
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
