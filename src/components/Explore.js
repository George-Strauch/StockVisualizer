import React, {useEffect, useState} from "react";
import axios from "axios";
import ScatterPlot from "../charts/Scatter"



function getChart(data) {
    for (let ticker in data) {
        data[ticker]["ticker"] = ticker;
    }
    console.log(data)
    const points = Object.values(data).map(d => (d));
    console.log(points)
    return <ScatterPlot data={points}/>
}


function Explore({isMobile}) {
    const data_endpoint = "http://127.0.0.1:5003/api/data/";

    // use axios to get the data from the data endpoint and save it to an object
    const [data, setData] = useState({});

    useEffect(() => {
        console.log("Starting data fetch...");
        axios.get(
            data_endpoint, {
                headers: {
                    'Content-Type': 'application/json',
                },
                responseType: 'json'
            }
        )
            .then(response => {
                // console.log("Data fetched successfully:", response.data);  // log successful response
                const responseData = typeof response.data === 'string' ? JSON.parse(response.data) : response.data;
                setData(responseData);
            })
            .catch(error => {
                console.error('Error fetching data:', error.response || error);  // Log error details
            });
    }, []);

    return (
        <div className="home-content">
            <div className="chart-container">
                {getChart(data)}
            </div>
            <pre>{JSON.stringify(data, null, 4)}</pre>
        </div>
    );
}

export default Explore;
