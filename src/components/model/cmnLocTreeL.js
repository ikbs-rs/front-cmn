import React, { useState, useEffect, useRef } from 'react';
import { TreeTable } from 'primereact/treetable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
//import { NodeService } from './service/NodeService';
import { classNames } from 'primereact/utils';
import { CmnLocService } from "../../service/model/CmnLocService";
import CmnLoc from './cmnLoc';
import { Dialog } from 'primereact/dialog';
import { translations } from "../../configs/translations";
import { Toast } from "primereact/toast";
import { ContextMenu } from 'primereact/contextmenu';
import { InputText } from 'primereact/inputtext';
import CmnLocobjL from './cmnLocobjL';
import CmnLoclinkL from "./cmnLoclinkL";
import { EmptyEntities } from '../../service/model/EmptyEntities';

export default function CmnLocTreeL() {
    console.log("Ulaz")
    let i = 0
    const objName = "cmn_obj"
    const emptyCmnObj = EmptyEntities[objName]
    const preprocessData = (data) => {
        const rootNode = data[0]; // Assuming your data contains only one root node

        const preprocessNode = (node) => {
            return {
                key: node.id,
                data: {
                    parent_id: node.parent_id,
                    loclink: node.loclink,
                    site: node.site,
                    tp: node.tp,
                    loctp1: node.loctp1,                    
                    loctp2: node.loctp2,
                    val: node.val,
                    begda: node.begda,
                    endda: node.endda,
                    hijerarhija: node.hijerarhija,
                    onoff: node.onoff,
                    color: node.color,
                    icon: node.icon,
                    text: node.text,
                    ctp: node.ctp,
                    ntp: node.ntp                  
                },
                children: node.children ? node.children.map(preprocessNode) : [],
            };
        };

        return [preprocessNode(rootNode)];
    };
    const selectedLanguage = localStorage.getItem('sl') || 'en'
    const [nodes, setNodes] = useState([]);
    const [locTip, setLocTip] = useState("");
    const [objTip, setObjTip] = useState("");
    const [cmnLoc, setCmnLoc] = useState({});
    const [visible, setVisible] = useState(false);
    const [selectedNodeKeys, setSelectedNodeKeys] = useState(null);
    const toast = useRef(null);
    const [expandedKeys, setExpandedKeys] = useState(null);
    const [selectedNodeKey, setSelectedNodeKey] = useState(null);
    const [selectedNodeData, setSelectedNodeData] = useState(null);
    const [cmnLocobjLVisible, setCmnLocobjLVisible] = useState(false);
    const [showMyComponent, setShowMyComponent] = useState(true);
    const [cmnLoclinkLVisible, setCmnLoclinkLVisible] = useState(false);

    const [refreshing, setRefreshing] = useState(false);
    const [reloadTimer, setReloadTimer] = useState(null);
    let [key, setKey] = useState(0);
    let [cmnLocData, setCmnLocData] = useState({})


    const [globalFilter, setGlobalFilter] = useState('');
    const cm = useRef(null);
    const menu = [
        {
            label: 'View Key',
            icon: 'pi pi-search',
            command: () => {
                toast.current.show({ severity: 'success', summary: 'Node Key', detail: selectedNodeKey });
            }
        },
        {
            label: 'Toggle',
            icon: 'pi pi-sort',
            command: () => {
                let _expandedKeys = { ...expandedKeys };

                if (_expandedKeys[selectedNodeKey]) delete _expandedKeys[selectedNodeKey];
                else _expandedKeys[selectedNodeKey] = true;

                setExpandedKeys(_expandedKeys);
            }
        },
        {
            label: 'Copy node',
            icon: 'pi pi-copy',
            command: () => {
                toast.current.show({ severity: 'success', summary: 'Node Key', detail: selectedNodeKey });
            }
        },
        {
            label: 'Cut node',
            icon: 'pi pi-cloud-upload',
            command: () => {
                toast.current.show({ severity: 'success', summary: 'Node Key', detail: selectedNodeKey });
            }
        },
        {
            label: 'Past node',
            icon: 'pi pi-cloud-download',
            command: () => {
                toast.current.show({ severity: 'success', summary: 'Node Key', detail: selectedNodeKey });
            }
        }
    ];

    useEffect(() => {
        //NodeService.getTreeTableNodes().then((data) => setNodes(data));
        async function fetchData() {
            try {
                ++i
                if (i < 2) {
                    const cmnLocService = new CmnLocService();
                    const data = await cmnLocService.getObjTree();
console.log(data, "*******************************getObjTree***********************************")
                    const processedData = preprocessData(data); // Preprocess the data
                    setNodes(processedData);
                    setRefreshing(false);
                }
            } catch (error) {
                console.error(error);
                // Obrada greške ako je potrebna
                setRefreshing(false);
            }
        }
        fetchData();
    }, [refreshing]);



    const handleReload = () => {
        setRefreshing(true); // Označava da je započeto ažuriranje
        //fetchData();

        // Pokrenite tajmer za automatsko ažuriranje (na primer, svakih 60 sekundi)
        const timer = setInterval(() => {
            //fetchData();
            setRefreshing(true);
        }, 60000); // 60 sekundi

        setReloadTimer(timer);
    };

    const getCmnLocation = async (newObj) => {
        const cmnLocService = new CmnLocService();
        const data = await cmnLocService.getCmnLoc(newObj.id);

        data.cmnLoctpId = newObj.tp 
        data.loctpCode = "-1"

        return data
    };

    const handleDialogClose = (newObj) => {
        const localObj = { newObj };

        let _nodes = [...nodes];
        let _cmnLoc = { ...localObj.newObj.obj };

        //setSubmitted(true);
        if (localObj.newObj.locTip === "CREATE") {
            _nodes.push(_cmnLoc);
        } else if (localObj.newObj.locTip === "UPDATE") {
            const index = findIndexById(localObj.newObj.obj.id);
            _nodes[index] = _cmnLoc;
        } else if ((localObj.newObj.locTip === "DELETE")) {
            _nodes = nodes.filter((val) => val.id !== localObj.newObj.obj.id);
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'CmnLoc Delete', life: 3000 });
        } else {
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'CmnLoc ?', life: 3000 });
        }
        toast.current.show({ severity: 'success', summary: 'Successful', detail: `{${objName}} ${localObj.newObj.locTip}`, life: 3000 });
        setNodes(_nodes);
    };

    const handleCmnLocobjLDialogClose = (newObj) => {
        const localObj = { newObj };
    };

    const handleCmnLoclinkLDialogClose = (newObj) => {
        console.log("Zatvorio")
        const localObj = { newObj };
        setRefreshing(true);
    };

    const findIndexById = (id) => {
        let index = -1;

        for (let i = 0; i < nodes.length; i++) {
            if (nodes[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    };

    const setCmnLocDialog = (newObj) => {
        console.log(newObj, "***********************setCmnLocDialog****************************newObj*")
        setVisible(true)
        setCmnLoc(newObj);
    }

    const setCmnLocobjLDialog = (newObj) => {
        setShowMyComponent(true);
        setCmnLocobjLVisible(true);
        setCmnLoc({ ...newObj });
    }

    const setCmnLoclinkLDialog = (newObj) => {
        setCmnLoc({ ...newObj });
        setShowMyComponent(true);
        setCmnLoclinkLVisible(true);

    }

    const openNew = () => {
        setLocTip("CREATE");
        setCmnLocDialog(emptyCmnObj);
    };

    const actionTemplate = (rowData) => {
        const convertToOriginalFormat = (node) => {
            console.log(node, "***********************actionTemplate*****************************")
            return {
                id: node.key,
                parent_id: node.data.parent_id,
                loclink: node.data.loclink,
                site: null,
                tp: node.data.tp,
                loctp1: node.data.loctp1,                    
                loctp2: node.data.loctp2,
                val: node.data.val,
                begda: node.data.begda,
                endda: node.data.endda,
                hijerarhija: node.data.hijerarhija,
                onoff: node.data.onoff,
                color: node.data.color,
                icon: node.data.icon,
                text: node.data.text,
                ctp: node.data.ctp,
                ntp: node.data.ntp 
            };
        };
        return (
            <div className="flex flex-wrap gap-2">
                <Button type="button" icon="pi pi-sitemap" severity="danger" rounded raised
                    onClick={ async () => {
                        const _cmnLocData = convertToOriginalFormat(rowData); // Convert rowData to the desired format
                        const data = await getCmnLocation(_cmnLocData)
                        console.log(cmnLocData, "$$$$$$$$$$$$$####$$$$$$$$$$$$$$$$$$$###$$$$$$$$$$$$$$$$$$$$$$####$$$$$$$$$$$$$$$$$", rowData)
                        // setCmnLocobjLDialog(cmnLocData);
                        setCmnLoclinkLDialog(data);
                        setLocTip("UPDATE");
                    }}
                ></Button>
                <Button type="button" icon="pi pi-pencil" severity="secondary" rounded raised
                    onClick={async () => {
                        //setKey(++key)
                        const _cmnLocData = convertToOriginalFormat(rowData); // Convert rowData to the desired format
                        setCmnLocData(_cmnLocData)
                        console.log(_cmnLocData.id, "$$1111111$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$data$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$")
                        
                        const data = await getCmnLocation(_cmnLocData)

                        console.log(data, "$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$data$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$", rowData)
                        setCmnLocDialog(data);
                        setLocTip("UPDATE");
                    }}
                ></Button>
            </div>
        );
    };

    const togglerTemplate = (node, options) => {
        if (!node) {
            return;
        }

        const expanded = options.expanded;
        const iconClassName = classNames('p-treetable-toggler-icon pi pi-fw', {
            'pi-caret-right': !expanded,
            'pi-caret-down': expanded
        });

        return (
            <button type="button" className="p-treetable-toggler p-link" style={options.buttonStyle} tabIndex={-1} onClick={options.onClick}>
                <span className={iconClassName} aria-hidden="true"></span>
            </button>
        );
    };

    const renderHeader = () => {
        return (
            <div className="flex card-container">
                <div className="flex flex-wrap gap-1">
                    <Button label={translations[selectedLanguage].Task1} icon="pi pi-plus" severity="success" onClick={openNew} text raised />
                </div>
                {/* <div className="flex flex-wrap gap-1">
                    <Button label={translations[selectedLanguage].Task2} icon="pi pi-shield" onClick={console.log("Prvo")} text raised disabled={!cmnLoc} />
                </div>
                <div className="flex flex-wrap gap-1">
                    <Button label={translations[selectedLanguage].Task3} icon="pi pi-sitemap" onClick={console.log("Prvo")} text raised disabled={!cmnLoc} />
                </div> */}
                <div className="flex-grow-1" />
                <b>{translations[selectedLanguage].LocList}</b>
                <div className="flex-grow-1"></div>
                <div className="flex flex-wrap gap-1">
                    <span className="p-input-icon-left">
                        <i className="pi pi-search" />
                        <InputText
                            type="search"
                            value={globalFilter}
                            onInput={(e) => setGlobalFilter(e.target.value)}
                            placeholder={translations[selectedLanguage].KeywordSearch}
                        />
                    </span>
                </div>
            </div>
        );
    };
    const header = renderHeader();
    //const header = <div className="text-xl font-bold">Object tree</div>;
    const footer = (
        <div className="flex justify-content-start">
            <Button icon="pi pi-refresh" label="Reload" severity="warning" text raised
                onClick={handleReload}
                disabled={refreshing}
            />
        </div>
    );

    return (
        <div className="card">
            <Toast ref={toast} />
            <ContextMenu model={menu} ref={cm} onHide={() => setSelectedNodeKey(null)} />
            <TreeTable
                value={nodes} header={header} footer={footer} togglerTemplate={togglerTemplate}
                selectionMode="checkbox" selectionKeys={selectedNodeKeys} onSelectionChange={(e) => setSelectedNodeKeys(e.value)}
                globalFilter={globalFilter}

                expandedKeys={expandedKeys} onToggle={(e) => setExpandedKeys(e.value)}
                contextMenuSelectionKey={selectedNodeKey}
                onContextMenuSelectionChange={(event) => setSelectedNodeKey(event.value)}
                onContextMenu={(event) => cm.current.show(event.originalEvent)}

                scrollable scrollHeight="720px" tableStyle={{ minWidth: '50rem' }}
            >
                <Column field="text" header="Text" expander style={{ width: "40%" }}></Column>
                {/* <Column field="code" header="Code" style={{ width: "20%" }}></Column> */}
                <Column field="ntp" header="Tp" style={{ width: "30%" }}></Column>
                {/**                 */}
                <Column body={actionTemplate} headerClassName="w-10rem" style={{ width: "10%" }} />

            </TreeTable>
            <Dialog
                header={translations[selectedLanguage].Loc}
                visible={visible}
                style={{ width: '70%' }}
                onHide={() => {
                    setVisible(false);
                }}
            >
                {/* Render CmnLoc component here */}
                {visible && (
                    <CmnLoc
                        parameter={"inputTextValue"}
                        cmnLoc={cmnLoc}
                        handleDialogClose={handleDialogClose}
                        setVisible={setVisible}
                        dialog={true}
                        locTip={locTip}
                        cmnLoctpId={"-1"}
                        loctpCode={"-1"}
                    />
                )}
            </Dialog>
            <Dialog
                header={translations[selectedLanguage].LoclinkList}
                visible={cmnLoclinkLVisible}
                style={{ width: '90%' }}
                onHide={() => {
                    setCmnLoclinkLVisible(false);
                    setShowMyComponent(false);
                }}
            >
                {showMyComponent && (
                    <CmnLoclinkL
                        parameter={"inputTextValue"}
                        cmnLoc={cmnLoc}
                        handleCmnLoclinkLDialogClose={handleCmnLoclinkLDialogClose}
                        setCmnLoclinkLVisible={setCmnLoclinkLVisible}
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
                        cmnLoc={cmnLoc}
                        handleCmnLocobjLDialogClose={handleCmnLocobjLDialogClose}
                        setCmnLocobjLVisible={setCmnLocobjLVisible}
                        dialog={true}
                        lookUp={false}
                    />
                )}
            </Dialog>
        </div>

    );
}
