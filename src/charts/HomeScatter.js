import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

function ScatterPlot({data}) {
  const svgRef = useRef();

  useEffect(() => {
    const data = [
      { x: 30, y: 30 },
      { x: 80, y: 90 },
      { x: 150, y: 60 },
      { x: 200, y: 150 },
      { x: 250, y: 200 },
      { x: 300, y: 120 },
      { x: 350, y: 250 },
      { x: 400, y: 300 },
    ];

    const width = 600;
    const height = 400;

    const svg = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height);

    const xScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.x)])
      .range([0, width]);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.y)])
      .range([height, 0]);

    svg.selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", d => xScale(d.x))
      .attr("cy", d => yScale(d.y))
      .attr("r", 5)
      .style("fill", "steelblue");
  }, []);

  return <svg ref={svgRef}></svg>;
}

export default ScatterPlot;