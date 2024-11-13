import './css/App.css';
import { useEffect, useRef, useState } from 'react';
import Home from "./components/HomeView";
import { useNavigate } from 'react-router-dom';
import TickerPage from "./components/TickerView";
import CalenderView from "./components/CalenderView";
import APIdocs from "./components/APIdocs";
import TopNavigation from "./components/TopNavigation";
import SideNavigation from "./components/SideNavigation";
import Watchlist from "./components/WatchListView";
import axios from "axios"

function App() {

    const getIsMobile = ()=> {
        const h = window.innerHeight
        const w = window.innerWidth
        const aspect_ratio = w/h
        return aspect_ratio < 1
    }

    // endpoint to get data

    // proportion of the view height the top bar takes
    const top_bar_height_mult = 0.055
    const min_top_bar_height = 45

    // proportion of the view width the side nav takes
    const side_bar_width_mult = 0.17

    // proportion of the view width the side nav takes on mobile
    const side_bar_width_mobile_mult = 0.5

    const [isMobile, setIsMobile] = useState(getIsMobile());
    const [darkMode, setDarkMode] = useState(true);

    const [defaultSidebarWidth, setDefaultSidebarWidth] = useState('200px');
    const [sidebarWidth, setSidebarWidth] = useState('200px');
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const [defaultTopBarHeight, setDefaultTopBarHeight] = useState(window.innerHeight * top_bar_height_mult);
    const [lastScroll, setLastScroll] = useState(0);
    const topBarHeightRef = useRef(defaultTopBarHeight); // Ref to store the current top bar height

    const [selectedPage, setSelectedPage] = useState('home');
    const navigate = useNavigate();

    useEffect(() => {
        const handleResize = () => {
            // set is mobile
            let mobile_bool = getIsMobile()
            setIsMobile(mobile_bool);

            // determine the sidebar width
            // mobile default
            let newWidth = window.innerWidth * side_bar_width_mobile_mult;
            if (!mobile_bool) {
                newWidth = Math.max(window.innerWidth * side_bar_width_mult, 200);
                console.log("is mobile")
            }

            // set the sidebar
            if (sidebarOpen){
                setSidebarWidth(`${newWidth}px`);
                document.documentElement.style.setProperty('--sidebar-width', `${newWidth}px`);
            } else {
                setSidebarWidth(0);
                document.documentElement.style.setProperty('--sidebar-width', "0");
            }
            setDefaultSidebarWidth(`${newWidth}px`);
            document.documentElement.style.setProperty('--default-topbar-height', "0");

            // top bar things
            let newHeight = window.innerHeight * top_bar_height_mult;
            if (newHeight < min_top_bar_height) newHeight = min_top_bar_height
            // setTopBarHeight(newHeight);
            setDefaultTopBarHeight(newHeight);
            document.documentElement.style.setProperty('--topbar-height', `${newHeight}px`);
            document.documentElement.style.setProperty('--default-topbar-height', "0");
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [sidebarOpen]);


    useEffect(() => {
        const handleScroll = () => {
            const currentScroll = window.scrollY
            const delta = lastScroll - currentScroll

            let newTopBarHeight = topBarHeightRef.current + delta*5;
            newTopBarHeight = Math.max(0, newTopBarHeight)
            newTopBarHeight = Math.min(defaultTopBarHeight, newTopBarHeight)

            if (newTopBarHeight < defaultTopBarHeight){
                // this makes it disappear slowly, but make it reappear quickly
                if (delta > 0) return
            }

            setLastScroll(currentScroll);
            topBarHeightRef.current = newTopBarHeight; // Update the ref immediately
            document.documentElement.style.setProperty('--topbar-height', `${newTopBarHeight}px`);
        };

        handleScroll();
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScroll]);


    const applyTheme = (isDarkMode) => {
        if (isDarkMode) {
            document.documentElement.style.setProperty('--primary-color', '35, 35, 40');
            document.documentElement.style.setProperty('--secondary-color', '45, 45, 50');
            document.documentElement.style.setProperty('--soft-border', '80, 80, 90');
            document.documentElement.style.setProperty('--soft-border-alpha', '0.5');
            document.documentElement.style.setProperty('--soft-text', '200, 200, 200');
            document.documentElement.style.setProperty('--hard-text', '255, 255, 255');
        } else {
            document.documentElement.style.setProperty('--primary-color', '240, 240, 240');
            document.documentElement.style.setProperty('--secondary-color', '250, 250, 250');
            document.documentElement.style.setProperty('--soft-border', '160, 160, 160');
            document.documentElement.style.setProperty('--soft-border-alpha', '0.3');
            document.documentElement.style.setProperty('--soft-text', '105, 105, 105');
            document.documentElement.style.setProperty('--hard-text', '15, 15, 15');
        }

        // Update RGBA dynamically
        const softBorderValue = `rgba(var(--soft-border), var(--soft-border-alpha))`;
        document.documentElement.style.setProperty('--soft-border-rgba', softBorderValue);
    };

    useEffect(() => {
        // Apply theme based on the default dark mode value
        applyTheme(darkMode);
    }, []); // Run only once on mount

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
        applyTheme(!darkMode);
    };


    const handlePageSelect = (page) => {
        setSelectedPage(page);
        window.scrollTo({top: 0})
        if (isMobile && sidebarOpen) setSidebarOpen(false)
    };

    const handleSearch = (event) => {
        if (event.key === 'Enter') {
            navigate(`/tickers/${event.target.value}`);
        }
    };

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
        if (sidebarOpen){
            setSidebarWidth(defaultSidebarWidth)
        } else {
            setSidebarWidth(0);
        }
        document.documentElement.style.setProperty('--sidebar-width', sidebarWidth);
        console.log(sidebarWidth)
    };

    const handleClickOutside = (event) => {
        // Ensure that the event is only triggered by clicks on the parent div.
        if ((event.target === event.currentTarget) && sidebarOpen && isMobile) {
            setSidebarOpen(false);
        }
    };

    let view_type = isMobile? "mobile" : "desktop"
    return (
        <div className="app">
            <div className="content-container">
                <TopNavigation
                    handleSearch={handleSearch}
                    toggleDarkMode={toggleDarkMode}
                    toggleSidebar={toggleSidebar}
                    isDarkMode={darkMode}
                />

                <div className="main-content">
                    <SideNavigation
                        sidebarOpen={sidebarOpen}
                        isMobile={isMobile}
                        handlePageSelect={handlePageSelect}
                    />
                    <div
                        className={`page-content ${view_type}`}
                        onClick={handleClickOutside}
                    >
                        {selectedPage === 'Home' && <Home isMobile={isMobile}/>}
                        {selectedPage === 'Watchlist' && <CalenderView isMobile={isMobile}/>}
                        {selectedPage === 'Calender' && <Watchlist isMobile={isMobile}/>}
                        {selectedPage === 'Tickers' && <TickerPage isMobile={isMobile}/>}
                        {selectedPage === 'API' && <APIdocs isMobile={isMobile}/>}
                    </div>
                </div>

            </div>
        </div>
    );
}


export default App;
