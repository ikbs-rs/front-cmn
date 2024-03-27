import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputSwitch } from "primereact/inputswitch";
//import { ProductService } from "./service/ProductService";
import { CmnLoclinkService } from "../../service/model/CmnLoclinkService";
import { CmnLocService } from "../../service/model/CmnLocService";
import { CmnLoctpService } from "../../service/model/CmnLoctpService";
import CmnLoc from './cmnLoc';
import { Button } from "primereact/button"; // Dodato za dugme
import { translations } from "../../configs/translations";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { InputText } from "primereact/inputtext";
import ConfirmDialog from '../dialog/ConfirmDialog';
import { Toast } from 'primereact/toast';
import DeleteDialog from '../dialog/DeleteDialog';
import { Dropdown } from 'primereact/dropdown';
import { Dialog } from 'primereact/dialog';
import DateFunction from "../../utilities/DateFunction"

export default function CmnLoclinkgrpL(props) {
  console.log(props, "-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*+++++++++++++++++-*-*-*-*-*-")
  //const [products, setProducts] = useState([]);
  const emptyCmnloclink = "cmn_loclink"
  const emptyCmnLoc = "cmn_loc"

  const [cmnLoc, setCmnLoc] = useState(emptyCmnloclink);
  const [showMyComponent, setShowMyComponent] = useState(true);
  const [locTip, setLocTip] = useState('');
  const [cmnLoctpId, setCmnLoctpId] = useState(null);
  const loctpCode = props.loctpCode ;

  const selectedLanguage = localStorage.getItem('sl') || 'en'
  const [cmnLoclinkgrps, setCmnLoclinkgrps] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState(null);
  const [rowClick, setRowClick] = useState(true);
  const [selectedRowsData, setSelectedRowsData] = useState([]); // Novi state za selektovane redove
  const [filters, setFilters] = useState('');
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [confirmDialogVisible, setConfirmDialogVisible] = useState(false);
  const toast = useRef(null);
  const [submitted, setSubmitted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [addItems, setAddItems] = useState(true);
  const [cmnLocs, setCmnLocs] = useState([]);

  let [refresh, setRefresh] = useState(null);
  const [ddCmnLoctpItem, setDdCmnLoctpItem] = useState(props.loctpCode);
  const [ddCmnLoctpItems, setDdCmnLoctpItems] = useState(null);
  const [cmnLoctp, setCmnLoctp] = useState({});
  const [cmnLoctps, setCmnLoctps] = useState([]);
  const [cmnEventloc, setCmnEventloc] = useState(emptyCmnloclink);
  const [componentKey, setComponentKey] = useState(0);
  const [refCode, setRefCode] = useState(props.loctpCode);

  // useEffect(() => {
  //   ProductService.getProductsMini().then((data) => setProducts(data));
  // }, []);
  let i = 0
  useEffect(() => {
    async function fetchData() {
      try {
        ++i
        if (i < 2) {
          const cmnLocService = new CmnLocService();
          const data = await cmnLocService.getListaLL(refCode);;
          console.log(data, "************************************CmnLoclinkgrpL!!!!!!*************************************")
          setCmnLoclinkgrps(data);

          initFilters();
        }
      } catch (error) {
        console.error(error);
        // Obrada greške ako je potrebna
      }
    }
    fetchData();
  }, [refresh, componentKey, refCode]);


  useEffect(() => {
    async function fetchData() {
      try {
        const cmnLoctpService = new CmnLoctpService();
        const data = await cmnLoctpService.getCmnLoctps();

        setCmnLoctps(data)

        const dataDD = data.map(({ textx, id }) => ({ name: textx, code: id }));
        setDdCmnLoctpItems(dataDD);
        //setDdTicLoctpItem(dataDD.find((item) => item.code === props.ticEventatt.tp) || null);
      } catch (error) {
        console.error(error);
        // Obrada greške ako je potrebna
      }
    }
    fetchData();
  }, []);


  const findIndexById = (id) => {
    let index = -1;

    for (let i = 0; i < cmnLocs.length; i++) {
      if (cmnLocs[i].id === id) {
        index = i;
        break;
      }
    }

    return index;
  };


  const handleDialogClose = (newObj) => {
    const localObj = { newObj };

    let _cmnLocs = [...cmnLocs];
    let _cmnLoc = { ...localObj.newObj.obj };
    //setSubmitted(true);
    if (localObj.newObj.locTip === "CREATE") {
      _cmnLocs.push(_cmnLoc);
    } else if (localObj.newObj.locTip === "UPDATE") {
      const index = findIndexById(localObj.newObj.obj.id);
      _cmnLocs[index] = _cmnLoc;
    } else if ((localObj.newObj.locTip === "DELETE")) {
      _cmnLocs = cmnLocs.filter((val) => val.id !== localObj.newObj.obj.id);
      toast.current.show({ severity: 'success', summary: 'Successful', detail: 'CmnLoc Delete', life: 3000 });
    } else {
      toast.current.show({ severity: 'success', summary: 'Successful', detail: 'CmnLoc ?', life: 3000 });
    }
    toast.current.show({ severity: 'success', summary: 'Successful', detail: `{${emptyCmnLoc}} ${localObj.newObj.locTip}`, life: 3000 });
    setCmnLocs(_cmnLocs);
    setCmnLoc(emptyCmnLoc);
    setRefresh(++refresh);
  };

  const handleCancelClick = () => {
    props.handleCmnLoclinkgrpLDialogClose({ obj: props.cmnLoc });
    props.setCmnLoclinkgrpLVisible(false);
  };

  const handleGetSelectedRowsClick = async () => {
    setConfirmDialogVisible(true);
    await setAddItems(false)
  };

  const handleGetSelectedAddRowsClick = async () => {
    setConfirmDialogVisible(true);
    await setAddItems(false)
  };
  
  const handleGetSelectedCopyRowsClick = async () => {
    setConfirmDialogVisible(true);
    await setAddItems(true)
  };


  const initFilters = () => {
    setFilters({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      ocode: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
      },
      code: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
      },
      text: {
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


  const openNew = () => {
    setCmnLocDialog(emptyCmnLoc);
  };

  const setCmnLocDialog = (cmnLoc) => {
    setShowMyComponent(true)
    setVisible(true)
    setLocTip("CREATE")
    setCmnLoctpId(refCode)
    setCmnLoc({ ...cmnLoc, refCode, loctpCode });
  }

  const handleConfirm = async () => {
    console.log(selectedProducts, "***********handleConfirm********************", addItems)
    setSubmitted(true);
    const cmnLoclinkService = new CmnLoclinkService(selectedProducts);
    await cmnLoclinkService.postGrpLoclink(props.cmnLoc, selectedProducts, addItems, DateFunction.currDate(), '99991231');
    props.handleCmnLoclinkgrpLDialogClose({ obj: props.cmnLoc });
    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Поставке успешно копиране ?', life: 3000 });
    setVisible(false);
    setConfirmDialogVisible(false);
  };

  const showDeleteDialog = () => {
    setDeleteDialogVisible(true);
  };


  const handleDeleteClick = async () => {
    try {
      setSubmitted(true);
      const cmnLoclinkService = new CmnLoclinkService();
      //await cmnLoclinkService.deleteTicEvent(cmnLoc);
      props.handleDialogClose({ obj: props.cmnLoc, eventTip: 'DELETE' });
      props.setVisible(false);
      hideDeleteDialog();
    } catch (err) {
      toast.current.show({
        severity: "error",
        summary: "Action ",
        detail: `${err.response.data.error}`,
        life: 5000,
      });
    }
  };

  const onLoctpChange = (e) => {
    let _cmnLoclinkgrps = { ...cmnLoclinkgrps };
    let val = (e.target && e.target.value && e.target.value.code) || '';
    setDdCmnLoctpItem(e.value);
    const foundItem = cmnLoctps.find((item) => item.id === val);
    setCmnLoctp(foundItem || null);
    _cmnLoclinkgrps.tp = val;
    //emptyTicEventloc.tp = val;
    setCmnEventloc(_cmnLoclinkgrps);
    setRefCode(foundItem?.code || '-1')
    setRefresh(++refresh);
  }

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

  const hideDeleteDialog = () => {
    setDeleteDialogVisible(false);
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
        <div className="flex flex-wrap gap-1">
          <Button label={translations[selectedLanguage].Copy} icon="pi pi-copy" severity="danger" onClick={handleGetSelectedCopyRowsClick} text raised />
        </div> 
        <div className="flex flex-wrap gap-1">
          <Button label={translations[selectedLanguage].Add} icon="pi pi-plus" onClick={handleGetSelectedAddRowsClick} severity="warning" text raised />
        </div>
        <div className="flex-grow-1"></div>
        <b>{translations[selectedLanguage].EventattsgrpList}</b>
        <div className="flex-grow-1"></div>

        <div className="flex-grow-1 ">
          <label htmlFor="tp">{translations[selectedLanguage].Type} *</label>
          <Dropdown id="tp"
            value={ddCmnLoctpItem}
            options={ddCmnLoctpItems}
            onChange={(e) => onLoctpChange(e)}
            showClear
            optionLabel="name"
            placeholder="Select One"
          />
        </div>

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

  const header = renderHeader();
  
  const locTemplate = (rowData) => {
    return (
      <div className="flex flex-wrap gap-1">

        <Button
          type="button"
          icon="pi pi-pencil"
          style={{ width: '24px', height: '24px' }}
          onClick={() => {
            setCmnLocDialog(rowData)
            setLocTip("UPDATE")
          }}
          text
          raised ></Button>

      </div>
    );
  };

  return (
    <div className="card">
      <Toast ref={toast} />
      {/* <div className="flex justify-content-center align-items-center mb-4 gap-2">
        <InputSwitch
          inputId="input-rowclick"
          checked={rowClick}
          onChange={(e) => setRowClick(e.value)}
        />
        <label htmlFor="input-rowclick">Row Click</label>
        <Button
          label="Get Selected Rows"
          onClick={handleGetSelectedRowsClick}
        />
      </div> */}
      <DataTable  
        value={cmnLoclinkgrps}
        selectionMode={rowClick ? null : "checkbox"}
        selection={selectedProducts}
        onSelectionChange={(e) => setSelectedProducts(e.value)}
        dataKey="id"
        tableStyle={{ minWidth: "50rem" }}
        sortField="text" sortOrder={1}
        header={header}
        removableSort
        scrollable
        scrollHeight="650px"
        showGridlines
        metaKeySelection={false}
        filters={filters}
        loading={loading}
      >
        <Column
          selectionMode="multiple"
          headerStyle={{ width: "3rem" }}
        ></Column>
        <Column field="code" header={translations[selectedLanguage].code} sortable> </Column>
        <Column field="text" header={translations[selectedLanguage].text} sortable> </Column>
        <Column field="ntp" header={translations[selectedLanguage].ntp} sortable> </Column>
        <Column field="ctp" header={translations[selectedLanguage].ninputtp} sortable> </Column>
        <Column
          //bodyClassName="text-center"
          body={locTemplate}
          exportable={false}
          headerClassName="w-10rem"
          style={{ minWidth: '4rem' }}
        />        
        {/* <Column field="ddlist" header={translations[selectedLanguage].ddlist}></Column> */}
      </DataTable>
      {selectedRowsData.length > 0 && (
        <div className="mt-4">
          <h5>Selected Rows Data:</h5>
          <ul>
            {selectedRowsData.map((row, index) => (
              <li key={index}>{JSON.stringify(row)}</li>
            ))}
          </ul>
        </div>
      )}
      <Dialog
        header={translations[selectedLanguage].Location}
        visible={visible}
        style={{ width: '95%' }}
        onHide={() => {
          setVisible(false);
          setShowMyComponent(false);
        }}
      >
        {showMyComponent && (
          <CmnLoc
            parameter={props}
            cmnLoctpId={cmnLoctpId}
            loctpCode={loctpCode}
            cmnLoc={cmnLoc}
            handleDialogClose={handleDialogClose}
            setVisible={setVisible}
            dialog={true}
            locTip={locTip}

          />
        )}
        <div className="p-dialog-header-icons" style={{ display: 'none' }}>
          <button className="p-dialog-header-close p-link">
            <span className="p-dialog-header-close-icon pi pi-times"></span>
          </button>
        </div>
      </Dialog>      
      <ConfirmDialog
        visible={confirmDialogVisible}
        onHide={() => setConfirmDialogVisible(false)}
        onConfirm={handleConfirm}
        uPoruka={'Копирањие локација, да ли сте сигурни?'}
      />
      <DeleteDialog
        visible={deleteDialogVisible}
        inAction="delete"
        onHide={hideDeleteDialog}
        onDelete={handleDeleteClick}
      //uPoruka={'Копирањие поставки, да ли сте сигурни?'}
      />
    </div>
  );
}
