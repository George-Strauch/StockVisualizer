import React from 'react';
import '../css/Navagation.css';


function SideNavigation({sidebarOpen, isMobile, handlePageSelect }) {
    let sidebar_class = "sidebar"
    sidebar_class += `${sidebarOpen ? ' open' : ' closed'}`
    sidebar_class += `${isMobile ? ' mobile' : ' desktop'}`
    return (
        <div className={sidebar_class}>
            <ul className="links">
                <li onClick={() => handlePageSelect('Home')}>
                    <div className="sidebar-element">Home</div>
                </li>
                <li onClick={() => handlePageSelect('Explore')}>
                    <div className="sidebar-element">Explore</div>
                </li>
                <li onClick={() => handlePageSelect('Screeners')}>
                    <div className="sidebar-element">Screeners</div>
                </li>
                <li onClick={() => handlePageSelect('Watchlist')}>
                    <div className="sidebar-element">Watchlist</div>
                </li>
                <li onClick={() => handlePageSelect('Calendar')}>
                    <div className="sidebar-element">Calender</div>
                </li>
                <li onClick={() => handlePageSelect('Tickers')}>
                    <div className="sidebar-element">Tickers</div>
                </li>
                <li onClick={() => handlePageSelect('API')}>
                    <div className="sidebar-element">API</div>
                </li>
                <li onClick={() => handlePageSelect('About')}>
                    <div className="sidebar-element">About</div>
                </li>
            </ul>
        </div>
    );
}


export default SideNavigation