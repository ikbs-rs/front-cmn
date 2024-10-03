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
import { TicVenueService } from "../../service/model/TicVenueService";
import TicVenue from './ticVenue';
import { EmptyEntities } from '../../service/model/EmptyEntities';
import { Dialog } from 'primereact/dialog';
import { translations } from "../../configs/translations";

export default function TicVenueL(props) {
  let i = 0
  const objName = "tic_venue"
  const selectedLanguage = localStorage.getItem('sl')||'en'
  const emptyTicVenue = EmptyEntities[objName]
  const [showMyComponent, setShowMyComponent] = useState(true);
  const [ticVenues, setTicVenues] = useState([]);
  const [ticVenue, setTicVenue] = useState(emptyTicVenue);
  const [filters, setFilters] = useState('');
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useRef(null);
  const [visible, setVisible] = useState(false);
  const [venueTip, setVenueTip] = useState('');

  useEffect(() => {
    async function fetchData() {
      try {
        ++i
        if (i<2) {  
        const ticVenueService = new TicVenueService();
        const data = await ticVenueService.getTicVenues();
        setTicVenues(data);
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

    let _ticVenues = [...ticVenues];
    let _ticVenue = { ...localObj.newObj.obj };

    //setSubmitted(true);
    if (localObj.newObj.venueTip === "CREATE") {
      _ticVenues.push(_ticVenue);
    } else if (localObj.newObj.venueTip === "UPDATE") {
      const index = findIndexById(localObj.newObj.obj.venue_id);
      _ticVenues[index] = _ticVenue;
    } else if ((localObj.newObj.venueTip === "DELETE")) {
      _ticVenues = ticVenues.filter((val) => val.venue_id !== localObj.newObj.obj.venue_id);
      toast.current.show({ severity: 'success', summary: 'Successful', detail: 'TicVenue Delete', life: 3000 });
    } else {
      toast.current.show({ severity: 'success', summary: 'Successful', detail: 'TicVenue ?', life: 3000 });
    }
    toast.current.show({ severity: 'success', summary: 'Successful', detail: `{${objName}} ${localObj.newObj.venueTip}`, life: 3000 });
    setTicVenues(_ticVenues);
    setTicVenue(_ticVenue);
  };

  const findIndexById = (id) => {
    let index = -1;

    for (let i = 0; i < ticVenues.length; i++) {
      if (ticVenues[i].venue_id === id) {
        index = i;
        break;
      }
    }

    return index;
  };

  const openNew = () => {
    setTicVenueDialog(emptyTicVenue);
  };

  const onRowSelect = (event) => {
    toast.current.show({
      severity: "info",
      summary: "Action Selected",
      detail: `Id: ${event.data.venue_id} Name: ${event.data.textx}`,
      life: 3000,
    });
  };

  const onRowUnselect = (event) => {
    toast.current.show({
      severity: "warn",
      summary: "Action Unselected",
      detail: `Id: ${event.data.venue_id} Name: ${event.data.textx}`,
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
        <b>{translations[selectedLanguage].VenueList}</b>
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
  const setTicVenueDialog = (ticVenue) => {
    setVisible(true)
    setVenueTip("CREATE")
    setTicVenue({ ...ticVenue });
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
            setTicVenueDialog(rowData)
            setVenueTip("UPDATE")
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
        dataKey="venue_id"
        selectionMode="single"
        selection={ticVenue}
        loading={loading}
        size={"small"}
        value={ticVenues}
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
        onSelectionChange={(e) => setTicVenue(e.value)}
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
          field="venue_name"
          header={translations[selectedLanguage].Text}
          sortable
          filter
          style={{ width: "60%" }}
        ></Column>
      </DataTable>
      <Dialog
        header={translations[selectedLanguage].Venue}
        visible={visible}
        style={{ width: '95%', height: '100%' }}
        onHide={() => {
          setVisible(false);
          setShowMyComponent(false);
        }}
      >
        {showMyComponent && (
          <TicVenue
            parameter={"inputTextValue"}
            ticVenue={ticVenue}
            handleDialogClose={handleDialogClose}
            setVisible={setVisible}
            dialog={true}
            venueTip={venueTip}
          />
        )}
      </Dialog>
    </div>
  );
}
