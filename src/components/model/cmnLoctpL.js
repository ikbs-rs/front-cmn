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
import { CmnLoctpService } from "../../service/model/CmnLoctpService";
import CmnLoctp from './cmnLoctp';
import { EmptyEntities } from '../../service/model/EmptyEntities';
import { Dialog } from 'primereact/dialog';
import { translations } from "../../configs/translations";

export default function CmnLoctpL(props) {
  let i = 0
  const objName = "cmn_loctp"
  const selectedLanguage = localStorage.getItem('sl')||'en'
  const emptyCmnLoctp = EmptyEntities[objName]
  const [showMyComponent, setShowMyComponent] = useState(true);
  const [cmnLoctps, setCmnLoctps] = useState([]);
  const [cmnLoctp, setCmnLoctp] = useState(emptyCmnLoctp);
  const [filters, setFilters] = useState('');
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useRef(null);
  const [visible, setVisible] = useState(false);
  const [loctpTip, setLoctpTip] = useState('');

  useEffect(() => {
    async function fetchData() {
      try {
        ++i
        if (i<2) {  
        const cmnLoctpService = new CmnLoctpService();
        const data = await cmnLoctpService.getCmnLoctps();
        setCmnLoctps(data);
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

    let _cmnLoctps = [...cmnLoctps];
    let _cmnLoctp = { ...localObj.newObj.obj };

    //setSubmitted(true);
    if (localObj.newObj.loctpTip === "CREATE") {
      _cmnLoctps.push(_cmnLoctp);
    } else if (localObj.newObj.loctpTip === "UPDATE") {
      const index = findIndexById(localObj.newObj.obj.id);
      _cmnLoctps[index] = _cmnLoctp;
    } else if ((localObj.newObj.loctpTip === "DELETE")) {
      _cmnLoctps = cmnLoctps.filter((val) => val.id !== localObj.newObj.obj.id);
      toast.current.show({ severity: 'success', summary: 'Successful', detail: 'CmnLoctp Delete', life: 3000 });
    } else {
      toast.current.show({ severity: 'success', summary: 'Successful', detail: 'CmnLoctp ?', life: 3000 });
    }
    toast.current.show({ severity: 'success', summary: 'Successful', detail: `{${objName}} ${localObj.newObj.loctpTip}`, life: 3000 });
    setCmnLoctps(_cmnLoctps);
    setCmnLoctp(emptyCmnLoctp);
  };

  const findIndexById = (id) => {
    let index = -1;

    for (let i = 0; i < cmnLoctps.length; i++) {
      if (cmnLoctps[i].id === id) {
        index = i;
        break;
      }
    }

    return index;
  };

  const openNew = () => {
    setCmnLoctpDialog(emptyCmnLoctp);
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
        <b>{translations[selectedLanguage].LocTpList}</b>
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
  const setCmnLoctpDialog = (cmnLoctp) => {
    setVisible(true)
    setLoctpTip("CREATE")
    setCmnLoctp({ ...cmnLoctp });
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
            setCmnLoctpDialog(rowData)
            setLoctpTip("UPDATE")
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
        selection={cmnLoctp}
        loading={loading}
        value={cmnLoctps}
        header={header}
        showGridlines
        removableSort
        filters={filters}
        scrollable
        sortField="code"        
        sortOrder={1}
        scrollHeight="630px"
        virtualScrollerOptions={{ itemSize: 46 }}
        tableStyle={{ minWidth: "50rem" }}
        metaKeySelection={false}
        paginator
        rows={25}
        rowsPerPageOptions={[25, 50, 75, 100]}
        onSelectionChange={(e) => setCmnLoctp(e.value)}
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
        header={translations[selectedLanguage].LocTp}
        visible={visible}
        style={{ width: '70%' }}
        onHide={() => {
          setVisible(false);
          setShowMyComponent(false);
        }}
      >
        {showMyComponent && (
          <CmnLoctp
            parameter={"inputTextValue"}
            cmnLoctp={cmnLoctp}
            handleDialogClose={handleDialogClose}
            setVisible={setVisible}
            dialog={true}
            loctpTip={loctpTip}
          />
        )}
      </Dialog>
    </div>
  );
}
