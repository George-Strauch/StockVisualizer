import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

function ScatterPlot({ data }) {
    const svgRef = useRef();

    useEffect(() => {
        const width = 1000;
        const height = 400;
        const marginTop = 20;
        const marginRight = 20;
        const marginBottom = 30;
        const marginLeft = 40;

        // const x_min = d3.min(data, d => d.model);
        // const x_max = d3.max(data, d => d.model);

        const x_min = -0.04;
        const x_max = 0.04;


        const y_min = d3.min(data, d => d.volume);
        const y_max = d3.max(data, d => d.volume);

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

        // Add the x-axis with fewer ticks
        svg.append("g")
            .attr("transform", `translate(0,${height - marginBottom})`)
            .call(d3.axisBottom(xScale).ticks(5))
            .attr("stroke-opacity", 0.3);

        // Add the y-axis with fewer ticks
        svg.append("g")
            .attr("transform", `translate(${xScale(0)},0)`)
            .call(d3.axisLeft(yScale).ticks(0))
            .attr("stroke-opacity", 0.3);


        // Tooltip for hover effect
        const tooltip = d3.select("body").append("div")
            .style("position", "absolute")
            .style("background", "lightgray")
            .style("padding", "5px")
            .style("border-radius", "5px")
            .style("pointer-events", "none")
            .style("opacity", 0);

        // Plot the points with hover labels
        svg.selectAll("circle")
            .data(data)
            .enter()
            .append("circle")
            .attr("cx", d => xScale(d.model))
            .attr("cy", d => yScale(d.volume))
            .attr("r", 4)
            .style("fill", "steelblue")
            .on("mouseover", (event, d) => {
                tooltip.transition().duration(200).style("opacity", 0.9);
                tooltip.html(`${d.ticker} <br> Model: ${d.model}<br>Volume: ${d.volume}`)
                    .style("left", (event.pageX + 10) + "px")
                    .style("top", (event.pageY - 28) + "px");
            })
            .on("mouseout", () => {
                tooltip.transition().duration(500).style("opacity", 0);
            });

        // Remove tooltip when component unmounts
        return () => tooltip.remove();
    }, [data]);

    return <svg ref={svgRef}></svg>;
}

export default ScatterPlot;
