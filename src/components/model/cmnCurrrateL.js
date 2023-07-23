import React, { useState, useEffect, useRef } from "react";
import { classNames } from "primereact/utils";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { TriStateCheckbox } from "primereact/tristatecheckbox";
import { Toast } from "primereact/toast";
import { CmnTerrlinkService } from "../../service/model/CmnTerrlinkService";
import CmnTerrlink from './cmnTerrlink';
import { EmptyEntities } from '../../service/model/EmptyEntities';
import { Dialog } from 'primereact/dialog';
import './index.css';
import { translations } from "../../configs/translations";
import DateFunction from "../../utilities/DateFunction";


export default function CmnTerrlinkL(props) {
  const objName = "cmn_terrlink"
  const selectedLanguage = localStorage.getItem('sl')||'en'
  const emptyCmnTerrlink = EmptyEntities[objName]
  emptyCmnTerrlink.terr2 = props.cmnTerr.id
  const [showMyComponent, setShowMyComponent] = useState(true);
  const [cmnTerrlinks, setCmnTerrlinks] = useState([]);
  const [cmnTerrlink, setCmnTerrlink] = useState(emptyCmnTerrlink);
  const [filters, setFilters] = useState('');
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useRef(null);
  const [visible, setVisible] = useState(false);
  const [terrlinkTip, setTerrlinkTip] = useState('');
  let i = 0
  const handleCancelClick = () => {
    props.setCmnTerrlinkLVisible(false);
  };

  useEffect(() => {
    async function fetchData() {
      try {
        ++i
        if (i < 2) {
          const cmnTerrlinkService = new CmnTerrlinkService();
          const data = await cmnTerrlinkService.getLista(props.cmnTerr.id);
          setCmnTerrlinks(data);

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

    let _cmnTerrlinks = [...cmnTerrlinks];
    let _cmnTerrlink = { ...localObj.newObj.obj };
    //setSubmitted(true);
    if (localObj.newObj.terrlinkTip === "CREATE") {
      _cmnTerrlinks.push(_cmnTerrlink);
    } else if (localObj.newObj.terrlinkTip === "UPDATE") {
      const index = findIndexById(localObj.newObj.obj.id);
      _cmnTerrlinks[index] = _cmnTerrlink;
    } else if ((localObj.newObj.terrlinkTip === "DELETE")) {
      _cmnTerrlinks = cmnTerrlinks.filter((val) => val.id !== localObj.newObj.obj.id);
      toast.current.show({ severity: 'success', summary: 'Successful', detail: 'CmnTerrlink Delete', life: 3000 });
    } else {
      toast.current.show({ severity: 'success', summary: 'Successful', detail: 'CmnTerrlink ?', life: 3000 });
    }
    toast.current.show({ severity: 'success', summary: 'Successful', detail: `{${objName}} ${localObj.newObj.terrlinkTip}`, life: 3000 });
    setCmnTerrlinks(_cmnTerrlinks);
    setCmnTerrlink(emptyCmnTerrlink);
  };

  const findIndexById = (id) => {
    let index = -1;

    for (let i = 0; i < cmnTerrlinks.length; i++) {
      if (cmnTerrlinks[i].id === id) {
        index = i;
        break;
      }
    }

    return index;
  };

  const openNew = () => {
    setCmnTerrlinkDialog(emptyCmnTerrlink);
  };

  const onRowSelect = (event) => {
    //cmnTerrlink.begda = event.data.begda
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
        <Button label={translations[selectedLanguage].Cancel} icon="pi pi-times" onClick={handleCancelClick} text raised
        />
        <div className="flex flex-wrap gap-1">
          <Button label={translations[selectedLanguage].New} icon="pi pi-plus" severity="success" onClick={openNew} text raised />
        </div>
        <div className="flex-grow-1"></div>
        <b>{translations[selectedLanguage].TerrlinkList}</b>
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
  const setCmnTerrlinkDialog = (cmnTerrlink) => {
    setVisible(true)
    setTerrlinkTip("CREATE")
    setCmnTerrlink({ ...cmnTerrlink });
  }
  //  Dialog --->

  const header = renderHeader();
  // heder za filter/>

  const terrlinkTemplate = (rowData) => {
    return (
      <div className="flex flex-wrap gap-1">

        <Button
          type="button"
          icon="pi pi-pencil"
          style={{ width: '24px', height: '24px' }}
          onClick={() => {
            setCmnTerrlinkDialog(rowData)
            setTerrlinkTip("UPDATE")
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
                value={props.cmnTerr.code}
                disabled={true}
              />
            </div>
            <div className="field col-12 md:col-6">
              <label htmlFor="text">{translations[selectedLanguage].Text}</label>
              <InputText
                id="text"
                value={props.cmnTerr.textx}
                disabled={true}
              />
            </div>           
          </div>
        </div>
      </div>
      <DataTable
        dataKey="id"
        selectionMode="single"
        selection={cmnTerrlink}
        loading={loading}
        value={cmnTerrlinks}
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
        onSelectionChange={(e) => setCmnTerrlink(e.value)}
        onRowSelect={onRowSelect}
        onRowUnselect={onRowUnselect}
      >
        <Column
          //bodyClassName="text-center"
          body={terrlinkTemplate}
          exportable={false}
          headerClassName="w-10rem"
          style={{ minWidth: '4rem' }}
        />
        <Column
          field="cterr1"
          header={translations[selectedLanguage].Partner}
          sortable
          filter
          style={{ width: "15%" }}
        ></Column>
        <Column
          field="nterr1"
          header={translations[selectedLanguage].Text}
          sortable
          filter
          style={{ width: "35%" }}
        ></Column>
        <Column
          field="text"
          header={translations[selectedLanguage].Value}
          sortable
          filter
          style={{ width: "20%" }}
        ></Column>        
        <Column
          field="begda"
          header={translations[selectedLanguage].Begda}
          sortable
          filter
          style={{ width: "10%" }}
          body={(rowData) => formatDateColumn(rowData, "begda")}
        ></Column>  
        <Column
          field="endda"
          header={translations[selectedLanguage].Endda}
          sortable
          filter
          style={{ width: "10%" }}
          body={(rowData) => formatDateColumn(rowData, "endda")}
        ></Column>         
      </DataTable>
      <Dialog
        header={translations[selectedLanguage].Link}
        visible={visible}
        style={{ width: '60%' }}
        onHide={() => {
          setVisible(false);
          setShowMyComponent(false);
        }}
      >
        {showMyComponent && (
          <CmnTerrlink
            parameter={"inputTextValue"}
            cmnTerrlink={cmnTerrlink}
            cmnTerr={props.cmnTerr}
            handleDialogClose={handleDialogClose}
            setVisible={setVisible}
            dialog={true}
            terrlinkTip={terrlinkTip}
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
