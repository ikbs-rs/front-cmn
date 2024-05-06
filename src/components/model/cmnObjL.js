import React, { useState, useEffect, useRef } from "react";
import { useParams } from 'react-router-dom';
import { classNames } from "primereact/utils";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { TriStateCheckbox } from "primereact/tristatecheckbox";
import { Toast } from "primereact/toast";
import './index.css';
import { CmnObjtpService } from "../../service/model/CmnObjtpService";
import { CmnObjService } from "../../service/model/CmnObjService";
import CmnObj from './cmnObj';
import { EmptyEntities } from '../../service/model/EmptyEntities';
import { Dialog } from 'primereact/dialog';
import { translations } from "../../configs/translations";
import CmnObjattsL from './cmnObjattsL';
import CmnObjlinkL from './cmnObjlinkL';
import CmnLocobjL from './cmnLocobjL';
import CmnObjParL from './cmnObjparL';

export default function CmnObjL(props) {
  console.log(props, "#props################################### CmnObjL ########################################")
  const { objtpCode: propsObjTpCode } = props;
  const { objtpCode: routeObjTpCode } = useParams();
  const objtpCode = propsObjTpCode || routeObjTpCode;  
  let i = 0
  const objName = "cmn_obj"
  const selectedLanguage = localStorage.getItem('sl') || 'en'
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
  const [cmnLocobjLVisible, setCmnLocobjLVisible] = useState(false);
  const [cmnObjparLVisible, setCmnObjparLVisible] = useState(false);
  
  const [visible, setVisible] = useState(false);
  const [objTip, setObjtpTip] = useState('');
  const [cmnObjtpId, setCmnObjtpId] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        ++i
        if (i < 2) {
          const cmnObjService = new CmnObjService();
          const data = await cmnObjService.getListaLL(props.objtpCode);
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


  useEffect(() => {
    async function fetchData() {
      try {
          const cmnObjtpService = new CmnObjtpService();
          console.log(objtpCode, "*0*********CmnObjtpService************#########################")          
          const data = await cmnObjtpService.getIdByItem (objtpCode);
          console.log(data, "*1*********CmnObjtpService************#########################") 
          setCmnObjtpId(data.id);
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

  const handleCmnLocobjLDialogClose = (newObj) => {
    const localObj = { newObj };
  };

  const handleCmnObjparLDialogClose = (newObj) => {
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

  const openLocObj = () => {
    setCmnLocobjLDialog();
  };

  const openObjPar = () => {
    setCmnObjparLDialog();
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
          <Button label={translations[selectedLanguage].Attributes} icon="pi pi-table" onClick={openObjAtt} text raised disabled={!cmnObj} />
        </div>
        <div className="flex flex-wrap gap-1">
          <Button label={translations[selectedLanguage].Links} icon="pi pi-sitemap" onClick={openObjLink} text raised disabled={!cmnObj} />
        </div>
        <div className="flex flex-wrap gap-1">
          <Button label={translations[selectedLanguage].Place} icon="pi pi-sitemap" onClick={openLocObj} text raised disabled={!cmnObj} />
        </div>
        <div className="flex flex-wrap gap-1">
        {props.objtpCode==='XBL' && (
          <Button label={translations[selectedLanguage].BList} icon="pi pi-android" onClick={openObjPar} text raised disabled={!cmnObj} />
        )}
          </div>        
        <div className="flex-grow-1" />
        <b>{`${translations[selectedLanguage][props.objtpCode]||'Obekti '} ${translations[selectedLanguage].Lista}`}</b>
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
    const valid = rowData.valid == 1 ? true : false
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

  const setCmnLocobjLDialog = () => {
    setShowMyComponent(true);
    setCmnLocobjLVisible(true);

  }

  const setCmnObjparLDialog = () => {
    setShowMyComponent(true);
    setCmnObjparLVisible(true);

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
          style={{ width: "15%" }}
        ></Column>
        <Column
          field="textx"
          header={translations[selectedLanguage].Text}
          sortable
          filter
          style={{ width: "30%" }}
        ></Column>
        {/*
        <Column
          field="ctp"
          header={translations[selectedLanguage].Text}
          sortable
          filter
          style={{ width: "15%" }}
        ></Column>    
  */}
        <Column
          field="ntp"
          header={translations[selectedLanguage].ObjTp}
          sortable
          filter
          style={{ width: "30%" }}
        ></Column>
        <Column
          field="valid"
          filterField="valid"
          dataType="numeric"
          header={translations[selectedLanguage].Valid}
          sortable
          filter
          filterElement={validFilterTemplate}
          style={{ width: "10%" }}
          bodyClassName="text-center"
          body={validBodyTemplate}
        ></Column>
      </DataTable>
      <Dialog
        header={translations[selectedLanguage][objtpCode]}
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
            cmnObjtpId={cmnObjtpId}
            objtpCode={objtpCode}
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
        style={{ width: '90%' }}
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
      <Dialog
        header={translations[selectedLanguage].LocobjLista}
        visible={cmnLocobjLVisible}
        style={{ width: '70%' }}
        onHide={() => {
          setCmnLocobjLVisible(false);
          setShowMyComponent(false);
        }}
      >
        {showMyComponent && (
          <CmnLocobjL
            parameter={"inputTextValue"}
            cmnObj={cmnObj}
            handleCmnLocobjLDialogClose={handleCmnLocobjLDialogClose}
            setCmnLocobjLVisible={setCmnLocobjLVisible}
            dialog={true}
            lookUp={false}
          />
        )}
      </Dialog>      
      <Dialog
        header={translations[selectedLanguage].ObjparLista}
        visible={cmnObjparLVisible}
        style={{ width: '70%' }}
        onHide={() => {
          setCmnObjparLVisible(false);
          setShowMyComponent(false);
        }}
      >
        {showMyComponent && (
          <CmnObjParL
            parameter={"inputTextValue"}
            cmnObj={cmnObj}
            handleCmnObjparLDialogClose={handleCmnObjparLDialogClose}
            setCmnObjparLVisible={setCmnObjparLVisible}
            dialog={true}
            lookUp={false}
          />
        )}
      </Dialog>           
    </div>
  );
}
