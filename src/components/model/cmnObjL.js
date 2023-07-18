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
import { CmnObjService } from "../../service/model/CmnObjService";
import CmnObj from './cmnObj';
import { EmptyEntities } from '../../service/model/EmptyEntities';
import { Dialog } from 'primereact/dialog';
import { translations } from "../../configs/translations";
import CmnObjattsL from './cmnObjattsL';
import CmnObjlinkL from './cmnObjlinkL';

export default function CmnObjL(props) {
  let i = 0
  const objName = "cmn_obj"
  const selectedLanguage = localStorage.getItem('sl')||'en'
  const emptyCmnObj = EmptyEntities[objName]
  const [showMyComponent, setShowMyComponent] = useState(true);
  const [cmnObjs, setCmnObjs] = useState([]);
  const [cmnObj, setCmnObj] = useState(emptyCmnObj);
  const [filters, setFilters] = useState('');
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useRef(null);
  const [cmnObjattsLVisible, setCmnObjattsLVisible] = useState(false);
  const [cmnObjlinkLVisible, setCmnObjlinkLVisible] = useState(false);
  const [visible, setVisible] = useState(false);
  const [objTip, setObjtpTip] = useState('');

  useEffect(() => {
    async function fetchData() {
      try {
        ++i
        if (i<2) {  
        const cmnObjService = new CmnObjService();
        const data = await cmnObjService.getCmnObjs();
        setCmnObjs(data);
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

    let _cmnObjs = [...cmnObjs];
    let _cmnObj = { ...localObj.newObj.obj };

    //setSubmitted(true);
    if (localObj.newObj.objTip === "CREATE") {
      _cmnObjs.push(_cmnObj);
    } else if (localObj.newObj.objTip === "UPDATE") {
      const index = findIndexById(localObj.newObj.obj.id);
      _cmnObjs[index] = _cmnObj;
    } else if ((localObj.newObj.objTip === "DELETE")) {
      _cmnObjs = cmnObjs.filter((val) => val.id !== localObj.newObj.obj.id);
      toast.current.show({ severity: 'success', summary: 'Successful', detail: 'CmnObj Delete', life: 3000 });
    } else {
      toast.current.show({ severity: 'success', summary: 'Successful', detail: 'CmnObj ?', life: 3000 });
    }
    toast.current.show({ severity: 'success', summary: 'Successful', detail: `{${objName}} ${localObj.newObj.objTip}`, life: 3000 });
    setCmnObjs(_cmnObjs);
    setCmnObj(emptyCmnObj);
  };

  const handleCmnObjattsLDialogClose = (newObj) => {
    const localObj = { newObj };
  };

  const handleCmnObjlinkLDialogClose = (newObj) => {
    const localObj = { newObj };
  };  

  const findIndexById = (id) => {
    let index = -1;

    for (let i = 0; i < cmnObjs.length; i++) {
      if (cmnObjs[i].id === id) {
        index = i;
        break;
      }
    }

    return index;
  };

  const openNew = () => {
    setCmnObjDialog(emptyCmnObj);
  };

  const openObjAtt = () => {
    setCmnObjattsLDialog();
  };
  
  const openObjLink = () => {
    setCmnObjlinkLDialog();
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
        <div className="flex flex-wrap gap-1">
          <Button label={translations[selectedLanguage].Attributes} icon="pi pi-shield" onClick={openObjAtt} text raised disabled={!cmnObj} />
        </div>
        <div className="flex flex-wrap gap-1">
          <Button label={translations[selectedLanguage].Links} icon="pi pi-sitemap" onClick={openObjLink} text raised disabled={!cmnObj} />
        </div>        
        <div className="flex-grow-1" />
        <b>{translations[selectedLanguage].ObjList}</b>
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
  const setCmnObjDialog = (cmnObj) => {
    setVisible(true)
    setObjtpTip("CREATE")
    setCmnObj({ ...cmnObj });
  }

  const setCmnObjattsLDialog = () => {
    setShowMyComponent(true);
    setCmnObjattsLVisible(true);

  }  
  const setCmnObjlinkLDialog = () => {
    setShowMyComponent(true);
    setCmnObjlinkLVisible(true);

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
            setCmnObjDialog(rowData)
            setObjtpTip("UPDATE")
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
        selection={cmnObj}
        loading={loading}
        value={cmnObjs}
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
        onSelectionChange={(e) => setCmnObj(e.value)}
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
        header={translations[selectedLanguage].Obj}
        visible={visible}
        style={{ width: '70%' }}
        onHide={() => {
          setVisible(false);
          setShowMyComponent(false);
        }}
      >
        {showMyComponent && (
          <CmnObj
            parameter={"inputTextValue"}
            cmnObj={cmnObj}
            handleDialogClose={handleDialogClose}
            setVisible={setVisible}
            dialog={true}
            objTip={objTip}
          />
        )}
      </Dialog>
      <Dialog
        header={translations[selectedLanguage].ObjattsLista}
        visible={cmnObjattsLVisible}
        style={{ width: '70%' }}
        onHide={() => {
          setCmnObjattsLVisible(false);
          setShowMyComponent(false);
        }}
      >
        {showMyComponent && (
          <CmnObjattsL
            parameter={"inputTextValue"}
            cmnObj={cmnObj}
            handleCmnObjattsLDialogClose={handleCmnObjattsLDialogClose}
            setCmnObjattsLVisible={setCmnObjattsLVisible}
            dialog={true}
            lookUp={false}
          />
        )}
      </Dialog> 
      <Dialog
        header={translations[selectedLanguage].ObjlinkLista}
        visible={cmnObjlinkLVisible}
        style={{ width: '70%' }}
        onHide={() => {
          setCmnObjlinkLVisible(false);
          setShowMyComponent(false);
        }}
      >
        {showMyComponent && (
          <CmnObjlinkL
            parameter={"inputTextValue"}
            cmnObj={cmnObj}
            handleCmnObjlinkLDialogClose={handleCmnObjlinkLDialogClose}
            setCmnObjlinkLVisible={setCmnObjlinkLVisible}
            dialog={true}
            lookUp={false}
          />
        )}
      </Dialog>      
    </div>
  );
}
