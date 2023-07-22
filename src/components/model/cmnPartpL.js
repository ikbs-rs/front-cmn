import React, { useState, useEffect, useRef } from "react";
import { classNames } from "primereact/utils";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { TriStateCheckbox } from "primereact/tristatecheckbox";
import { Toast } from "primereact/toast";
import './index.css';
import { CmnPartpService } from "../../service/model/CmnPartpService";
import CmnPartp from './cmnPartp';
import { EmptyEntities } from '../../service/model/EmptyEntities';
import { Dialog } from 'primereact/dialog';
import { translations } from "../../configs/translations";

export default function CmnPartpL(props) {
  let i = 0
  const objName = "cmn_partp"
  const selectedLanguage = localStorage.getItem('sl')||'en'
  const emptyCmnPartp = EmptyEntities[objName]
  const [showMyComponent, setShowMyComponent] = useState(true);
  const [cmnPartps, setCmnPartps] = useState([]);
  const [cmnPartp, setCmnPartp] = useState(emptyCmnPartp);
  const [filters, setFilters] = useState('');
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useRef(null);
  const [visible, setVisible] = useState(false);
  const [partpTip, setUmTip] = useState('');

  useEffect(() => {
    async function fetchData() {
      try {
        ++i
        if (i<2) {  
        const cmnPartpService = new CmnPartpService();
        const data = await cmnPartpService.getCmnPartps();
        setCmnPartps(data);
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

    let _cmnPartps = [...cmnPartps];
    let _cmnPartp = { ...localObj.newObj.obj };

    //setSubmitted(true);
    if (localObj.newObj.partpTip === "CREATE") {
      _cmnPartps.push(_cmnPartp);
    } else if (localObj.newObj.partpTip === "UPDATE") {
      const index = findIndexById(localObj.newObj.obj.id);
      _cmnPartps[index] = _cmnPartp;
    } else if ((localObj.newObj.partpTip === "DELETE")) {
      _cmnPartps = cmnPartps.filter((val) => val.id !== localObj.newObj.obj.id);
      toast.current.show({ severity: 'success', summary: 'Successful', detail: 'CmnPartp Delete', life: 3000 });
    } else {
      toast.current.show({ severity: 'success', summary: 'Successful', detail: 'CmnPartp ?', life: 3000 });
    }
    toast.current.show({ severity: 'success', summary: 'Successful', detail: `{${objName}} ${localObj.newObj.partpTip}`, life: 3000 });
    setCmnPartps(_cmnPartps);
    setCmnPartp(emptyCmnPartp);
  };

  const findIndexById = (id) => {
    let index = -1;

    for (let i = 0; i < cmnPartps.length; i++) {
      if (cmnPartps[i].id === id) {
        index = i;
        break;
      }
    }

    return index;
  };

  const openNew = () => {
    setCmnPartpDialog(emptyCmnPartp);
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
        <div className="flex-grow-1" />
        <b>{translations[selectedLanguage].PartpList}</b>
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
    const valid = rowData.valid == 1?true:false
    return (
      <i
        className={classNames("pi", {
          "text-green-500 pi-check-circle": valid,
          "text-red-500 pi-times-circle": !valid
        })}
      ></i>
    );
  };

  const validFilterTemplate = (options) => {
    return (
      <div className="flex align-items-center gap-2">
        <label htmlFor="verified-filter" className="font-bold">
        {translations[selectedLanguage].Valid}
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
  const setCmnPartpDialog = (cmnPartp) => {
    setVisible(true)
    setUmTip("CREATE")
    setCmnPartp({ ...cmnPartp });
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
            setCmnPartpDialog(rowData)
            setUmTip("UPDATE")
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
        selection={cmnPartp}
        loading={loading}
        value={cmnPartps}
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
        onSelectionChange={(e) => setCmnPartp(e.value)}
        onRowSelect={onRowSelect}
        onRowUnselect={onRowUnselect}
      >
        <Column
          //bodyClassName="text-center"
          body={actionTemplate}
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
        header={translations[selectedLanguage].Partp}
        visible={visible}
        style={{ width: '50%' }}
        onHide={() => {
          setVisible(false);
          setShowMyComponent(false);
        }}
      >
        {showMyComponent && (
          <CmnPartp
            parameter={"inputTextValue"}
            cmnPartp={cmnPartp}
            handleDialogClose={handleDialogClose}
            setVisible={setVisible}
            dialog={true}
            partpTip={partpTip}
          />
        )}
      </Dialog>
    </div>
  );
}
