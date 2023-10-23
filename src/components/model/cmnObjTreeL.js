import React, { useState, useEffect, useRef } from 'react';
import { TreeTable } from 'primereact/treetable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
//import { NodeService } from './service/NodeService';
import { classNames } from 'primereact/utils';
import { CmnObjService } from "../../service/model/CmnObjService";
import CmnObj from './cmnObj';
import { Dialog } from 'primereact/dialog';
import { translations } from "../../configs/translations";
import { Toast } from "primereact/toast";
import { ContextMenu } from 'primereact/contextmenu';
import { InputText } from 'primereact/inputtext';
import CmnLocobjL from './cmnLocobjL';
import CmnObjlinkL from './cmnObjlinkL';
import CmnObjattsL from './cmnObjattsL';
import { EmptyEntities } from '../../service/model/EmptyEntities';

export default function CmnObjTreeL() {
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
                    parentid: node.parentid,
                    site: node.site,
                    code: node.code,
                    text: node.text,
                    tp: node.tp,
                    textx: node.textx,
                    ctp: node.ctp,
                    ntp: node.ntp,
                    lang: node.lang,
                    grammcase: node.grammcase,
                    valid: node.valid
                },
                children: node.children ? node.children.map(preprocessNode) : [],
            };
        };

        return [preprocessNode(rootNode)];
    };
    const selectedLanguage = localStorage.getItem('sl') || 'en'
    const [nodes, setNodes] = useState([]);
    const [objTip, setObjTip] = useState("");
    const [cmnObj, setCmnObj] = useState({});
    const [visible, setVisible] = useState(false);
    const [selectedNodeKeys, setSelectedNodeKeys] = useState(null);
    const toast = useRef(null);
    const [expandedKeys, setExpandedKeys] = useState(null);
    const [selectedNodeKey, setSelectedNodeKey] = useState(null);
    const [selectedNodeData, setSelectedNodeData] = useState(null);
    const [cmnLocobjLVisible, setCmnLocobjLVisible] = useState(false);
    const [showMyComponent, setShowMyComponent] = useState(true);
    const [cmnObjlinkLVisible, setCmnObjlinkLVisible] = useState(false);
    const [cmnObjattsLVisible, setCmnObjattsLVisible] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [reloadTimer, setReloadTimer] = useState(null);


    const [globalFilter, setGlobalFilter] = useState('');
    const cm = useRef(null);


    async function fetchObj(uId) {
        try {
            const cmnObjService = new CmnObjService();
            const data = await cmnObjService.getCmnObj(uId);
            //console.log(uId, "*-*-*-*", data)
            return data;
        } catch (error) {
          console.error(error);
          // Obrada greške ako je potrebna
        }
      }

    const menu = [
        {
            label: translations[selectedLanguage].Attributes,
            icon: 'pi pi-table',
            command: async () => {
                const rowData = await  fetchObj(selectedNodeKey) 
                // { id: selectedNodeKey,
                // parentid: selectedNodeKey,
                // site: null,
                // code: "",
                // text: "",
                // textx: "",
                // tp: "",
                // ctp: "",
                // ntp: "",
                // lang: "",
                // grammcase: "",
                // valid: null};
                //const cmnObjData = convertToOriginalFormat(rowData); // Convert rowData to the desired format
                setCmnObjattsLDialog(rowData);
                setObjTip("UPDATE");
            }
        },
        {
            label: translations[selectedLanguage].Toggle,
            icon: 'pi pi-sort',
            command: () => {
                let _expandedKeys = { ...expandedKeys };

                if (_expandedKeys[selectedNodeKey]) delete _expandedKeys[selectedNodeKey];
                else _expandedKeys[selectedNodeKey] = true;

                setExpandedKeys(_expandedKeys);
            }
        },
        // {
        //     label: 'Copy node',
        //     icon: 'pi pi-copy',
        //     command: () => {
        //         toast.current.show({ severity: 'success', summary: 'Node Key', detail: selectedNodeKey });
        //     }
        // },
        // {
        //     label: 'Cut node',
        //     icon: 'pi pi-cloud-upload',
        //     command: () => {
        //         toast.current.show({ severity: 'success', summary: 'Node Key', detail: selectedNodeKey });
        //     }
        // },
        // {
        //     label: 'Past node',
        //     icon: 'pi pi-cloud-download',
        //     command: () => {
        //         toast.current.show({ severity: 'success', summary: 'Node Key', detail: selectedNodeKey });
        //     }
        // }
    ];

    useEffect(() => {
        //NodeService.getTreeTableNodes().then((data) => setNodes(data));
        async function fetchData() {
            try {
                ++i
                if (i <= 2) {
                    const cmnObjService = new CmnObjService();
                    const data = await cmnObjService.getObjTree();

                    const processedData = preprocessData(data); // Preprocess the data
                    setNodes(processedData);
                    setRefreshing(false)
                }
            } catch (error) {
                console.error(error);
                // Obrada greške ako je potrebna
                setRefreshing(false)
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

    const handleDialogClose = (newObj) => {
        const localObj = { newObj };

        let _nodes = [...nodes];
        let _cmnObj = { ...localObj.newObj.obj };

        //setSubmitted(true);
        if (localObj.newObj.objTip === "CREATE") {
            _nodes.push(_cmnObj);
        } else if (localObj.newObj.objTip === "UPDATE") {
            const index = findIndexById(localObj.newObj.obj.id);
            _nodes[index] = _cmnObj;
        } else if ((localObj.newObj.objTip === "DELETE")) {
            _nodes = nodes.filter((val) => val.id !== localObj.newObj.obj.id);
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'CmnObj Delete', life: 3000 });
        } else {
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'CmnObj ?', life: 3000 });
        }
        toast.current.show({ severity: 'success', summary: 'Successful', detail: `{${objName}} ${localObj.newObj.objTip}`, life: 3000 });
        setNodes(_nodes);
    };

    const handleCmnLocobjLDialogClose = (newObj) => {
        const localObj = { newObj };
    };

    const handleCmnObjlinkLDialogClose = (newObj) => {
        const localObj = { newObj };
    };

    const handleCmnObjattsLDialogClose = (newObj) => {
        const localObj = { newObj };
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

    const setCmnObjDialog = (cmnObj) => {
        setVisible(true)
        setCmnObj({ ...cmnObj });
    }

    const setCmnLocobjLDialog = (cmnObj) => {
        setShowMyComponent(true);
        setCmnLocobjLVisible(true);
        setCmnObj({ ...cmnObj });
    }
    const setCmnObjlinkLDialog = (cmnObj) => {
        setCmnObj({ ...cmnObj });
        setShowMyComponent(true);
        setCmnObjlinkLVisible(true);
      }

      const setCmnObjattsLDialog = (cmnObj) => {
        //console.log("---------------------------", cmnObj)
        setCmnObj({ ...cmnObj });
        setShowMyComponent(true);
        setCmnObjattsLVisible(true);
    
      } 
      const convertToOriginalFormat = (node) => {
        return {
            id: node.key,
            parentid: node.data.parentid,
            site: null,
            code: node.data.code,
            text: node.data.text,
            textx: node.data.text,
            tp: node.data.tp,
            ctp: node.data.tp,
            ntp: node.data.tp,
            lang: selectedLanguage,
            grammcase: node.data.grammcase,
            valid: node.data.valid
        };
    };    
    const openNew = () => {
        setObjTip("CREATE");
        setCmnObjDialog(emptyCmnObj);
      };       
    const actionTemplate = (rowData) => {
        const convertToOriginalFormat = (node) => {
            return {
                id: node.key,
                parentid: node.data.parentid,
                site: null,
                code: node.data.code,
                text: node.data.text,
                textx: node.data.text,
                tp: node.data.tp,
                ctp: node.data.tp,
                ntp: node.data.tp,
                lang: selectedLanguage,
                grammcase: node.data.grammcase,
                valid: node.data.valid
            };
        };
        return (
            <div className="flex flex-wrap gap-2">
                <Button type="button" icon="pi pi-sitemap" severity="danger" rounded raised
                    onClick={() => {
                        const cmnObjData = convertToOriginalFormat(rowData); // Convert rowData to the desired format
                        setCmnObjlinkLDialog(cmnObjData);
                        setObjTip("UPDATE");
                    }}                
                ></Button>
                <Button type="button" icon="pi pi-pencil" severity="secondary" rounded raised
                    onClick={() => {
                        const cmnObjData = convertToOriginalFormat(rowData); // Convert rowData to the desired format
                        setCmnObjDialog(cmnObjData);
                        setObjTip("UPDATE");
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
                    <Button label={translations[selectedLanguage].Task2} icon="pi pi-shield" onClick={console.log("Prvo2")} text raised disabled={!cmnObj} />
                </div>
                <div className="flex flex-wrap gap-1">
                    <Button label={translations[selectedLanguage].Task3} icon="pi pi-sitemap" onClick={console.log("Prvo3")} text raised disabled={!cmnObj} />
                </div> */}
                <div className="flex-grow-1" />
                <b>{translations[selectedLanguage].ObjList}</b>
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
                <Column field="code" header="Code" style={{ width: "20%" }}></Column>
                <Column field="ntp" header="Tp" style={{ width: "30%" }}></Column>
                {/**                 */}
                <Column body={actionTemplate} headerClassName="w-10rem" style={{ width: "10%" }} />

            </TreeTable>
            <Dialog
                header={translations[selectedLanguage].Obj}
                visible={visible}
                style={{ width: '70%' }}
                onHide={() => {
                    setVisible(false);
                }}
            >
                {/* Render CmnObj component here */}
                {visible && (
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
        </div>

    );
}
