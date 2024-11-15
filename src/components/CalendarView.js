import React from "react";
import '../css/HomeView.css';

function CalendarView({isMobile}) {
    return (
        <div className="calender-content">
            <h2>Calender view. This is a very long sentence to test the overflow of the div on mobile devices</h2><
            p>This is the calender page.</p>
        </div>
    );
}

export default CalendarView;