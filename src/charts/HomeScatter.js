import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

function ScatterPlot({ data }) {
    const svgRef = useRef();

    useEffect(() => {
        const width = 600;
        const height = 400;
        const marginTop = 20;
        const marginRight = 20;
        const marginBottom = 30;
        const marginLeft = 40;

        const x_min = d3.min(data, d => d.x);
        const x_max = d3.max(data, d => d.x);
        const y_min = d3.min(data, d => d.y);
        const y_max = d3.max(data, d => d.y);

        const svg = d3.select(svgRef.current)
            .attr("width", width)
            .attr("height", height);

        const xScale = d3.scaleLinear()
            .domain([x_min, x_max])
            .range([marginLeft, width - marginRight]);

        const yScale = d3.scaleLinear()
            .domain([y_min, y_max])
            .range([height - marginBottom, marginTop]);

        // Clear previous elements
        svg.selectAll("*").remove();

        // Add the x-axis.
        svg.append("g")
            .attr("transform", `translate(0,${height - marginBottom})`)
            .call(d3.axisBottom(xScale));

        // Add the y-axis.
        svg.append("g")
            .attr("transform", `translate(${marginLeft},0)`)
            .call(d3.axisLeft(yScale));

        // Plot the points
        svg.selectAll("circle")
            .data(data)
            .enter()
            .append("circle")
            .attr("cx", d => xScale(d.x))
            .attr("cy", d => yScale(d.y))
            .attr("r", 2)
            .style("fill", "steelblue");
    }, [data]);

    return <svg ref={svgRef}></svg>;
}

export default ScatterPlot;
