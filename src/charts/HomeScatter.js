import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

function ScatterPlot({ data }) {
    const n = 1
    const svgRef = useRef();
    const [groupIndex, setGroupIndex] = useState(0);

    const x_axis_name = "Model"
    const y_axis_name = "market_cap"

    useEffect(() => {
        const width = 1200;
        const height = 400;
        const marginTop = 20;
        const marginRight = 20;
        const marginBottom = 30;
        const marginLeft = 40;

        const x_min = -0.04;
        const x_max = 0.04;
        const y_min = -3000000;
        const y_max = d3.max(data, d => d[y_axis_name]);

        // Divide data into groups based on the given n value
        const groupSize = Math.ceil(data.length / n);
        const groupedData = Array.from({ length: n }, (_, i) =>
            data.slice(i * groupSize, (i + 1) * groupSize)
        );

        const svg = d3.select(svgRef.current)
            .attr("width", width)
            .attr("height", height);

        const xScale = d3.scaleLinear()
            .domain(d3.extent(data, d => d[x_axis_name]))
            .range([marginLeft, width - marginRight]);

        const yScale = d3.scaleLinear()
            .domain(d3.extent(data, d => d[y_axis_name]))
            .range([height - marginBottom, marginTop]);

                // Tooltip for hover effect
        const tooltip = d3.select("body").append("div")
            .style("position", "absolute")
            .style("background", "lightgray")
            .style("padding", "5px")
            .style("border-radius", "5px")
            .style("pointer-events", "none")
            .style("opacity", 0);

        // Clear previous elements
        svg.selectAll("*").remove();

        // Add axes
        const xAxis = svg.append("g")
            .attr("transform", `translate(0,${height - marginBottom})`)
            .call(d3.axisBottom(xScale).ticks(5))
            .attr("stroke-opacity", 0.1);

        const yAxis = svg.append("g")
            .attr("transform", `translate(${xScale(0)},0)`)
            .call(d3.axisLeft(yScale).ticks(0))
            .attr("stroke-opacity", 0.1);

        svg.selectAll("circle")
            .data(groupedData[groupIndex])
            .enter()
            .append("circle")
            .attr("cx", d => xScale(d[x_axis_name]))
            .attr("cy", d => yScale(d[y_axis_name]))
            .attr("r", 4)
            .style("fill", "steelblue")
            .on("mouseover", (event, d) => {
                tooltip.transition().duration(200).style("opacity", 0.9);
                tooltip.html(`${d["ticker"]} <br> Model: ${d[x_axis_name]}<br>Volume: ${d[y_axis_name]}`)
                    .style("left", (event.pageX + 10) + "px")
                    .style("top", (event.pageY - 28) + "px");
            })
            .on("mouseout", () => {
                tooltip.transition().duration(500).style("opacity", 0);
            });

        // Zoom behavior
        const zoom = d3.zoom()
            .scaleExtent([0.5, 10])
            .on("zoom", (event) => {
                const transform = event.transform;
                const newXScale = transform.rescaleX(xScale);
                const newYScale = transform.rescaleY(yScale);

                console.log(newXScale)

                // Update axes with new scales
                xAxis.call(d3.axisBottom(newXScale).ticks(5));
                yAxis.call(d3.axisLeft(newYScale).ticks(0));
                yAxis.attr("transform", `translate(${newXScale(0)},0)`);

                // Update points with new scales
                svg.selectAll("circle")
                    .attr("cx", d => newXScale(d[x_axis_name]))
                    .attr("cy", d => newYScale(d[y_axis_name]));
            });

        svg.call(zoom);
        // Remove tooltip when component unmounts
        return () => tooltip.remove();

    }, [data, groupIndex, n]);

    return (
        <div>
            <svg ref={svgRef}></svg>
            <input
                type="range"
                min="0"
                max={n - 1}
                value={groupIndex}
                onChange={(e) => setGroupIndex(+e.target.value)}
                style={{ width: "30%" }}
            />
        </div>
    );
}

export default ScatterPlot;
