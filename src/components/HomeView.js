import React, {useEffect, useState} from "react";
import axios from "axios";
import ScatterPlot from "../charts/HomeScatter"



function getChart(data) {
    // const points = Object.values(data).map(x => [x.Model, x.Volume])
    const points = Object.values(data).map(d => ({ volume: d.Volume, model: d.Model, ticker: d.longName }));
    console.log(points)
    return <ScatterPlot data={points}/>
}


function Home({isMobile}) {
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
            <h2>Home Content</h2>
            <div>{getChart(data)}</div>
            <pre>{JSON.stringify(data, null, 4)}</pre>
        </div>
    );
}

export default Home;
