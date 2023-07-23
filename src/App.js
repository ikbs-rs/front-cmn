import React, { useState, useEffect, useRef } from 'react';
import { classNames } from 'primereact/utils';
import { Route, Routes, useLocation } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';

import AppTopbar from './AppTopbar';
import AppFooter from './AppFooter';
import AppConfig from './AppConfig';
import AppMenu from './AppMenu';
import AppRightMenu from './AppRightMenu';

import Um from './components/model/cmnUmL';
import LocTP from './components/model/cmnLoctpL';
import ObjTp from './components/model/cmnObjtpL';
import Obj from './components/model/cmnObjL';
import ObjTree from './components/model/cmnObjTreeL';
import ObjAtt from './components/model/cmnObjattL';
import ObjAttTp from './components/model/cmnObjatttpL';
import Link from './components/model/cmnLinkL';
import Partp from './components/model/cmnPartpL';
import Par from './components/model/cmnParL';
import Paratt from './components/model/cmnParattL';
import Terrtp from './components/model/cmnTerrtpL';
import Terr from './components/model/cmnTerrL';
import Terratt from './components/model/cmnTerrattL';
import Curr from './components/model/cmnCurrL';
import Tgp from './components/model/cmnTgpL';

import EmptyPage from './pages/EmptyPage';

import PrimeReact from 'primereact/api';
import { Tooltip } from 'primereact/tooltip';

import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import './App.scss';
import env from "./configs/env"
import { useDispatch } from 'react-redux';
import { setLanguage } from './store/actions';
import { translations } from "./configs/translations";

const App = () => {
    const dispatch = useDispatch();
    const urlParams = new URLSearchParams(window.location.search);
    let selectedLanguage = localStorage.getItem('sl')
    //let selectedLanguage = urlParams.get('sl');
    const [layoutMode, setLayoutMode] = useState('static');
    const [lightMenu, setLightMenu] = useState(true);
    const [overlayMenuActive, setOverlayMenuActive] = useState(false);
    const [staticMenuMobileActive, setStaticMenuMobileActive] = useState(false);
    const [staticMenuDesktopInactive, setStaticMenuDesktopInactive] = useState(false);
    const [isRTL, setIsRTL] = useState(false);
    const [inlineUser, setInlineUser] = useState(false);
    const [topbarMenuActive, setTopbarMenuActive] = useState(false);
    const [activeTopbarItem, setActiveTopbarItem] = useState(null);
    const [rightPanelMenuActive, setRightPanelMenuActive] = useState(null);
    const [inlineUserMenuActive, setInlineUserMenuActive] = useState(false);
    const [menuActive, setMenuActive] = useState(false);
    const [topbarColor, setTopbarColor] = useState('layout-topbar-bluegrey');
    const [theme, setTheme] = useState('blue');
    const [configActive, setConfigActive] = useState(false);
    const [inputStyle, setInputStyle] = useState('filled');
    const [ripple, setRipple] = useState(false);
    const copyTooltipRef = useRef();
    const location = useLocation();
    const inlineUserRef = useRef();

     const menu = [
        {
            label: translations[selectedLanguage].Code_books,
            icon: 'pi pi-fw pi-bars',
            items: [
                {
                    label: translations[selectedLanguage].Business_partners_administration,
                    icon: 'pi pi-fw pi-bars',
                    items: [
                        { label: translations[selectedLanguage].Type_partners, icon: 'pi pi-fw pi-calendar', to: '/partp' },
                        { label: translations[selectedLanguage].Business_partners, icon: 'pi pi-fw pi-calendar', to: '/par'  },
                        { label: translations[selectedLanguage].Properties_partners, icon: 'pi pi-fw pi-calendar' , to: '/paratt'},
                    ]
                },
                {
                    label: translations[selectedLanguage].Territorial_administration,
                    icon: 'pi pi-fw pi-bars',
                    items: [
                        { label: translations[selectedLanguage].Type_of_territory, icon: 'pi pi-fw pi-calendar', to: '/terrtp' },
                        { label: translations[selectedLanguage].Territory, icon: 'pi pi-fw pi-calendar', to: '/terr'  },
                        { label: translations[selectedLanguage].Properties_territory, icon: 'pi pi-fw pi-table' , to: '/terratt'}
                       // { label: translations[selectedLanguage].Type_of_relationship, icon: 'pi pi-fw pi-calendar' , to: '/terrtp'}
                    ]
                },
              /*  {
                    label: translations[selectedLanguage].Location_administration,
                    icon: 'pi pi-fw pi-bars',
                    items: [
                        { label: translations[selectedLanguage].Location_type, icon: 'pi pi-fw pi-calendar', to: '/loctp' },
                        { label: translations[selectedLanguage].Locations, icon: 'pi pi-fw pi-calendar', to: '/loc'  },
                        { label: translations[selectedLanguage].Properties_location, icon: 'pi pi-fw pi-calendar' , to: '/locatt'},
                        { label: translations[selectedLanguage].Type_of_relationship, icon: 'pi pi-fw pi-calendar' , to: '/loclinktp'}
                    ]
                },*/
                {
                    label: translations[selectedLanguage].Currency_administration,
                    icon: 'pi pi-fw pi-bars',
                    items: [
                        { label: translations[selectedLanguage].Currency, icon: 'pi pi-fw pi-calendar' , to: '/curr'},
                    ]
                },
                {
                    label: translations[selectedLanguage].Tax_system,
                    icon: 'pi pi-fw pi-bars',
                    items: [
                        { label: translations[selectedLanguage].Tariff_groups, icon: 'pi pi-fw pi-calendar' , to: '/tgp'},
                        { label: translations[selectedLanguage].Taxes, icon: 'pi pi-fw pi-calendar' , to: '/tax'}
                    ]
                },
                {
                    label: translations[selectedLanguage].Objects_administration,
                    icon: 'pi pi-prime',
                    items: [
                        { label: translations[selectedLanguage].Objects_type, icon: 'pi pi-database', to: '/objtp' },
                        { label: translations[selectedLanguage].Objects, icon: 'pi pi-fw pi-clone', to: '/obj' },
                        { label: translations[selectedLanguage].Properties_object, icon: 'pi pi-fw pi-clone', to: '/objatt' },
                        { label: translations[selectedLanguage].Group_of_properties, icon: 'pi pi-fw pi-clone', to: '/objatttp' },
                        { label: translations[selectedLanguage].Type_of_relationship, icon: 'pi pi-fw pi-exclamation-triangle', to: '/link' },
                        { label: translations[selectedLanguage].ObjectsTree, icon: 'pi pi-fw pi-clone', to: '/objtree' },
                    ]
                },
                {
                    label: translations[selectedLanguage].Other,
                    icon: 'pi pi-prime',
                    items: [
                        { label: translations[selectedLanguage].Program_modules, icon: 'pi pi-database', to: '/module' },
                  //      { label: translations[selectedLanguage].Menu_administration, icon: 'pi pi-fw pi-clone', to: '/menu' },
                        { label: translations[selectedLanguage].Units_of_measurement, icon: 'pi pi-fw pi-clone', to: '/um' },
                    ]
                }
            ]
        },
        {
            label: translations[selectedLanguage].Moduleselection,
            icon: 'pi pi-fw pi-compass',
            items: [
                { label: translations[selectedLanguage].Back, icon: 'pi pi-sign-out', url: `${env.START_URL}?sl=${selectedLanguage}` }
            ]
        }
    ];


    let topbarItemClick;
    let menuClick;
    let rightMenuClick;
    let userMenuClick;
    let configClick = false;

    useEffect(() => {      
      if (selectedLanguage) {
        dispatch(setLanguage(selectedLanguage)); // Postavi jezik iz URL-a u globalni store
      }
    }, [dispatch]);

    useEffect(() => {
        copyTooltipRef && copyTooltipRef.current && copyTooltipRef.current.updateTargetEvents();
    }, [location]);

    useEffect(() => {
        if (staticMenuMobileActive) {
            blockBodyScroll();
        } else {
            unblockBodyScroll();
        }
    }, [staticMenuMobileActive]);

    const onInputStyleChange = (inputStyle) => {
        setInputStyle(inputStyle);
    };

    const onRippleChange = (e) => {
        PrimeReact.ripple = e.value;
        setRipple(e.value);
    };

    const onDocumentClick = () => {
        if (!topbarItemClick) {
            setActiveTopbarItem(null);
            setTopbarMenuActive(false);
        }

        if (!rightMenuClick) {
            setRightPanelMenuActive(false);
        }

        if (!userMenuClick && isSlim() && !isMobile()) {
            setInlineUserMenuActive(false);
        }

        if (!menuClick) {
            if (isHorizontal() || isSlim()) {
                setMenuActive(false);
            }

            if (overlayMenuActive || staticMenuMobileActive) {
                hideOverlayMenu();
            }

            unblockBodyScroll();
        }

        if (configActive && !configClick) {
            setConfigActive(false);
        }

        topbarItemClick = false;
        menuClick = false;
        rightMenuClick = false;
        userMenuClick = false;
        configClick = false;
    };

    const onMenuButtonClick = (event) => {
        menuClick = true;
        setTopbarMenuActive(false);
        setRightPanelMenuActive(false);

        if (layoutMode === 'overlay') {
            setOverlayMenuActive((prevOverlayMenuActive) => !prevOverlayMenuActive);
        }

        if (isDesktop()) setStaticMenuDesktopInactive((prevStaticMenuDesktopInactive) => !prevStaticMenuDesktopInactive);
        else {
            setStaticMenuMobileActive((prevStaticMenuMobileActive) => !prevStaticMenuMobileActive);
            if (staticMenuMobileActive) {
                blockBodyScroll();
            } else {
                unblockBodyScroll();
            }
        }

        event.preventDefault();
    };

    const onTopbarMenuButtonClick = (event) => {
        topbarItemClick = true;
        setTopbarMenuActive((prevTopbarMenuActive) => !prevTopbarMenuActive);
        hideOverlayMenu();
        event.preventDefault();
    };

    const onTopbarItemClick = (event) => {
        topbarItemClick = true;

        if (activeTopbarItem === event.item) setActiveTopbarItem(null);
        else setActiveTopbarItem(event.item);

        event.originalEvent.preventDefault();
    };

    const onMenuClick = () => {
        menuClick = true;
    };

    const onInlineUserClick = () => {
        userMenuClick = true;
        setInlineUserMenuActive((prevInlineUserMenuActive) => !prevInlineUserMenuActive);
        setMenuActive(false);
    };

    const onConfigClick = () => {
        configClick = true;
    };

    const onConfigButtonClick = () => {
        setConfigActive((prevConfigActive) => !prevConfigActive);
        configClick = true;
    };

    const blockBodyScroll = () => {
        if (document.body.classList) {
            document.body.classList.add('blocked-scroll');
        } else {
            document.body.className += ' blocked-scroll';
        }
    };

    const unblockBodyScroll = () => {
        if (document.body.classList) {
            document.body.classList.remove('blocked-scroll');
        } else {
            document.body.className = document.body.className.replace(new RegExp('(^|\\b)' + 'blocked-scroll'.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
        }
    };

    const onRightMenuButtonClick = (event) => {
        rightMenuClick = true;
        setRightPanelMenuActive((prevRightPanelMenuActive) => !prevRightPanelMenuActive);

        hideOverlayMenu();

        event.preventDefault();
    };

    const onRightMenuClick = () => {
        rightMenuClick = true;
    };

    const hideOverlayMenu = () => {
        setOverlayMenuActive(false);
        setStaticMenuMobileActive(false);
    };

    const onMenuItemClick = (event) => {
        if (!event.item.items) {
            hideOverlayMenu();
        }
        if (!event.item.items && (isHorizontal() || isSlim())) {
            setMenuActive(false);
        }
    };

    const onRootMenuItemClick = () => {
        setMenuActive((prevMenuActive) => !prevMenuActive);
        setInlineUserMenuActive(false);
    };

    const isDesktop = () => {
        return window.innerWidth > 896;
    };

    const isMobile = () => {
        return window.innerWidth <= 1025;
    };

    const isHorizontal = () => {
        return layoutMode === 'horizontal';
    };

    const isSlim = () => {
        return layoutMode === 'slim';
    };

    const onLayoutModeChange = (layoutMode) => {
        setLayoutMode(layoutMode);
        setStaticMenuDesktopInactive(false);
        setOverlayMenuActive(false);

        if (layoutMode === 'horizontal' && inlineUser) {
            setInlineUser(false);
        }
    };

    const onMenuColorChange = (menuColor) => {
        setLightMenu(menuColor);
    };

    const onThemeChange = (theme) => {
        setTheme(theme);
    };

    const onProfileModeChange = (profileMode) => {
        setInlineUser(profileMode);
    };

    const onOrientationChange = (orientation) => {
        setIsRTL(orientation);
    };

    const onTopbarColorChange = (color) => {
        setTopbarColor(color);
    };

    const layoutClassName = classNames(
        'layout-wrapper',
        {
            'layout-horizontal': layoutMode === 'horizontal',
            'layout-overlay': layoutMode === 'overlay',
            'layout-static': layoutMode === 'static',
            'layout-slim': layoutMode === 'slim',
            'layout-menu-light': lightMenu,
            'layout-menu-dark': !lightMenu,
            'layout-overlay-active': overlayMenuActive,
            'layout-mobile-active': staticMenuMobileActive,
            'layout-static-inactive': staticMenuDesktopInactive,
            'layout-rtl': isRTL,
            'p-input-filled': inputStyle === 'filled',
            'p-ripple-disabled': !ripple
        },
        topbarColor
    );

    const inlineUserTimeout = layoutMode === 'slim' ? 0 : { enter: 1000, exit: 450 };

    return (
        <div className={layoutClassName} onClick={onDocumentClick}>
            <Tooltip ref={copyTooltipRef} target=".block-action-copy" position="bottom" content="Copied to clipboard" event="focus" />

            <AppTopbar
                topbarMenuActive={topbarMenuActive}
                activeTopbarItem={activeTopbarItem}
                inlineUser={inlineUser}
                onRightMenuButtonClick={onRightMenuButtonClick}
                onMenuButtonClick={onMenuButtonClick}
                onTopbarMenuButtonClick={onTopbarMenuButtonClick}
                onTopbarItemClick={onTopbarItemClick}
            />

            <AppRightMenu rightPanelMenuActive={rightPanelMenuActive} onRightMenuClick={onRightMenuClick}></AppRightMenu>

            <div className="layout-menu-container" onClick={onMenuClick} >
                {inlineUser && (
                    <div className="layout-profile">
                        <button type="button" className="p-link layout-profile-button" onClick={onInlineUserClick}>
                            <img src="assets/layout/images/avatar.png" alt="roma-layout" />
                            <div className="layout-profile-userinfo">
                                <span className="layout-profile-name">Arlene Welch</span>
                                <span className="layout-profile-role">Design Ops</span>
                            </div>
                        </button>
                        <CSSTransition nodeRef={inlineUserRef} classNames="p-toggleable-content" timeout={inlineUserTimeout} in={inlineUserMenuActive} unmountOnExit>
                            <ul ref={inlineUserRef} className={classNames('layout-profile-menu', { 'profile-menu-active': inlineUserMenuActive })}>
                                <li>
                                    <button type="button" className="p-link">
                                        <i className="pi pi-fw pi-user"></i>
                                        <span>Profile</span>
                                    </button>
                                </li>
                                <li>
                                    <button type="button" className="p-link">
                                        <i className="pi pi-fw pi-cog"></i>
                                        <span>Settings</span>
                                    </button>
                                </li>
                                <li>
                                    <button type="button" className="p-link">
                                        <i className="pi pi-fw pi-envelope"></i>
                                        <span>Messages</span>
                                    </button>
                                </li>
                                <li>
                                    <button type="button" className="p-link">
                                        <i className="pi pi-fw pi-bell"></i>
                                        <span>Notifications</span>
                                    </button>
                                </li>
                            </ul>
                        </CSSTransition>
                    </div>
                )}
                <AppMenu model={menu} onMenuItemClick={onMenuItemClick} onRootMenuItemClick={onRootMenuItemClick} layoutMode={layoutMode} active={menuActive} mobileMenuActive={staticMenuMobileActive} />
            </div>

            <div className="layout-main">
                <div className="layout-content">
                    <Routes>
                        <Route path="/" element={<EmptyPage />} />
                        <Route path="/um" element={<Um />} />
                        <Route path="/partp" element={<Partp />} />
                        <Route path="/par" element={<Par />} />
                        <Route path="/paratt" element={<Paratt />} />
                        <Route path="/terrtp" element={<Terrtp />} />
                        <Route path="/terr" element={<Terr />} />
                        <Route path="/terratt" element={<Terratt />} />
                        <Route path="/curr" element={<Curr />} />
                        <Route path="/tgp" element={<Tgp />} />

                        
                        <Route path="/loctp" element={<LocTP />} />
                        <Route path="/loc" element={<Um />} />
                        <Route path="/locatt" element={<Um />} />
                        <Route path="/loclinktp" element={<Um />} />

                        <Route path="/objtp" element={<ObjTp />} />
                        <Route path="/obj" element={<Obj />} />
                        <Route path="/objatttp" element={<ObjAttTp />} />
                        <Route path="/objatt" element={<ObjAtt />} />
                        <Route path="/link" element={<Link />} />
                        <Route path="/objtree" element={<ObjTree />} />
                        
                    </Routes>
                </div>

                <AppConfig
                    configActive={configActive}
                    onConfigClick={onConfigClick}
                    onConfigButtonClick={onConfigButtonClick}
                    rippleActive={ripple}
                    onRippleChange={onRippleChange}
                    inputStyle={inputStyle}
                    onInputStyleChange={onInputStyleChange}
                    theme={theme}
                    onThemeChange={onThemeChange}
                    topbarColor={topbarColor}
                    onTopbarColorChange={onTopbarColorChange}
                    inlineUser={inlineUser}
                    onProfileModeChange={onProfileModeChange}
                    isRTL={isRTL}
                    onOrientationChange={onOrientationChange}
                    layoutMode={layoutMode}
                    onLayoutModeChange={onLayoutModeChange}
                    lightMenu={lightMenu}
                    onMenuColorChange={onMenuColorChange}
                ></AppConfig>

                <AppFooter />
            </div>

            <div className="layout-content-mask"></div>
        </div>
    );
};

export default App;
