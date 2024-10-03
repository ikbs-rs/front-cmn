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
import { CmnTerrtpService } from "../../service/model/CmnTerrtpService";
import CmnTerrtp from './cmnTerrtp';
import { EmptyEntities } from '../../service/model/EmptyEntities';
import { Dialog } from 'primereact/dialog';
import { translations } from "../../configs/translations";

export default function CmnTerrtpL(props) {
  let i = 0
  const objName = "cmn_terrtp"
  const selectedLanguage = localStorage.getItem('sl')||'en'
  const emptyCmnTerrtp = EmptyEntities[objName]
  const [showMyComponent, setShowMyComponent] = useState(true);
  const [cmnTerrtps, setCmnTerrtps] = useState([]);
  const [cmnTerrtp, setCmnTerrtp] = useState(emptyCmnTerrtp);
  const [filters, setFilters] = useState('');
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useRef(null);
  const [visible, setVisible] = useState(false);
  const [terrtpTip, setTerrtpTip] = useState('');

  useEffect(() => {
    async function fetchData() {
      try {
        ++i
        if (i<2) {  
        const cmnTerrtpService = new CmnTerrtpService();
        const data = await cmnTerrtpService.getCmnTerrtps();
        setCmnTerrtps(data);
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

    let _cmnTerrtps = [...cmnTerrtps];
    let _cmnTerrtp = { ...localObj.newObj.obj };

    //setSubmitted(true);
    if (localObj.newObj.terrtpTip === "CREATE") {
      _cmnTerrtps.push(_cmnTerrtp);
    } else if (localObj.newObj.terrtpTip === "UPDATE") {
      const index = findIndexById(localObj.newObj.obj.id);
      _cmnTerrtps[index] = _cmnTerrtp;
    } else if ((localObj.newObj.terrtpTip === "DELETE")) {
      _cmnTerrtps = cmnTerrtps.filter((val) => val.id !== localObj.newObj.obj.id);
      toast.current.show({ severity: 'success', summary: 'Successful', detail: 'CmnTerrtp Delete', life: 3000 });
    } else {
      toast.current.show({ severity: 'success', summary: 'Successful', detail: 'CmnTerrtp ?', life: 3000 });
    }
    toast.current.show({ severity: 'success', summary: 'Successful', detail: `{${objName}} ${localObj.newObj.terrtpTip}`, life: 3000 });
    setCmnTerrtps(_cmnTerrtps);
    setCmnTerrtp(emptyCmnTerrtp);
  };

  const findIndexById = (id) => {
    let index = -1;

    for (let i = 0; i < cmnTerrtps.length; i++) {
      if (cmnTerrtps[i].id === id) {
        index = i;
        break;
      }
    }

    return index;
  };

  const openNew = () => {
    setCmnTerrtpDialog(emptyCmnTerrtp);
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
        <b>{translations[selectedLanguage].TerrtpList}</b>
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
  const setCmnTerrtpDialog = (cmnTerrtp) => {
    setVisible(true)
    setTerrtpTip("CREATE")
    setCmnTerrtp({ ...cmnTerrtp });
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
            setCmnTerrtpDialog(rowData)
            setTerrtpTip("UPDATE")
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
        selection={cmnTerrtp}
        loading={loading}
        value={cmnTerrtps}
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
        rows={10}
        rowsPerPageOptions={[5, 10, 25, 50]}
        onSelectionChange={(e) => setCmnTerrtp(e.value)}
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
        header={translations[selectedLanguage].Terrtp}
        visible={visible}
        style={{ width: '50%' }}
        onHide={() => {
          setVisible(false);
          setShowMyComponent(false);
        }}
      >
        {showMyComponent && (
          <CmnTerrtp
            parameter={"inputTextValue"}
            cmnTerrtp={cmnTerrtp}
            handleDialogClose={handleDialogClose}
            setVisible={setVisible}
            dialog={true}
            terrtpTip={terrtpTip}
          />
        )}
      </Dialog>
    </div>
  );
}
