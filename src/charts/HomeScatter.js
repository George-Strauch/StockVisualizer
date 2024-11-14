import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

function ScatterPlot({ data }) {
    const n = 1
    const svgRef = useRef();
    const [groupIndex, setGroupIndex] = useState(0);

    const x_axis_name = "Model"
    const y_axis_name = "Volume"

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


        // // Density contour overlay
        // const densityData = d3.contourDensity()
        //     .x(d => xScale(d[x_axis_name]))
        //     .y(d => yScale(d[y_axis_name]))
        //     .size([width, height])
        //     .bandwidth(20)  // larger area of coverage
        //     .thresholds(30) // number of lines
        //     (data);


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

        // const contoursGroup = svg.append("g")
        //     .selectAll("path")
        //     .data(densityData)
        //     .enter().append("path")
        //     .attr("d", d3.geoPath())
        //     .attr("fill", "gray")
        //     .attr("opacity", (d, i) => i === 0 ? 0.25 : 0.)

        // Add an overlay to cover the contours below y_min
        svg.append("rect")
            .attr("x", 0)
            .attr("y", yScale(y_min))  // Position the top of the overlay at y_min
            .attr("width", width)
            .attr("height", height - yScale(y_min))  // Height covers the area below y_min
            .attr("fill", `rgb(${document.documentElement.style.getPropertyValue('--secondary-color')})`)  // Match this color to your background
            .attr("z-index", 0);

        // Add axes
        const xAxis = svg.append("g")
            .attr("transform", `translate(0,${height - marginBottom})`)
            .call(d3.axisBottom(xScale).ticks(5))
            .attr("stroke-opacity", 0.1);

        const yAxis = svg.append("g")
            .attr("transform", `translate(${xScale(0)},0)`)
            .call(d3.axisLeft(yScale).ticks(0))
            .attr("stroke-opacity", 0.1);

        // Zoom behavior
        const zoom = d3.zoom()
            .scaleExtent([0.5, 10])
            .on("zoom", (event) => {
                const transform = event.transform;
                const newXScale = transform.rescaleX(xScale);
                const newYScale = transform.rescaleY(yScale);

                // Update axes with new scales
                xAxis.call(d3.axisBottom(newXScale).ticks(5));
                yAxis.call(d3.axisLeft(newYScale).ticks(0));
                yAxis.attr("transform", `translate(${newXScale(0)},0)`);


                // const newDensityData = d3.contourDensity()
                //     .x(d => newXScale(d[x_axis_name]))
                //     .y(d => newYScale(d[y_axis_name]))
                //     .size([width, height])
                //     .bandwidth(20)
                //     .thresholds(30)
                //     (data);
                // console.log(newDensityData)
                //
                //
                // // Update contours with new density data
                // contoursGroup.selectAll("path").remove(); // Remove old contours
                // contoursGroup.selectAll("path")
                //     .data(newDensityData)
                //     .enter()
                //     .append("density")
                //     .attr("d", d3.geoPath()) // Use geoPath to draw contours
                //     .attr("fill", "none")
                //     .attr("stroke", "black");


                // Update points with new scales
                svg.selectAll("circle")
                    .attr("cx", d => newXScale(d[x_axis_name]))
                    .attr("cy", d => newYScale(d[y_axis_name]));
            });

        svg.call(zoom);

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
                tooltip.html(`${d["ticker"]} <br> Model: ${d[x_axis_name]}<br>Volume: ${d[y_axis_name]}`)
                    .style("left", (event.pageX + 10) + "px")
                    .style("top", (event.pageY - 28) + "px");
            })
            .on("mouseout", () => {
                tooltip.transition().duration(500).style("opacity", 0);
            });
                // Remove tooltip when component unmounts
        return () => tooltip.remove();

        // // Plot the points for the current group with hover labels
        // svg.selectAll("circle")
        //     .data(groupedData[groupIndex])
        //     .enter()
        //     .append("circle")
        //     .attr("cx", d => xScale(d[x_axis_name]))
        //     .attr("cy", d => yScale(d[y_axis_name]))
        //     .attr("r", 4)
        //     .style("fill", "steelblue");

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
