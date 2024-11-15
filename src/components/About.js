import React from "react";
import '../css/HomeView.css';

function TickerPage({isMobile, ticker}) {
    return (
        <div className="tickerview-content">
            <h2>Ticker Content</h2><
            p>This is the page that will show information about an individual ticker.</p>
        </div>
    );
}

export default TickerPage;