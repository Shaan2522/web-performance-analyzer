import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import { formatTime } from '../../utils/networkUtils';

function WaterfallChart({ data }) {
  const svgRef = useRef();

  useEffect(() => {
    if (!data || data.length === 0) return;

    const svg = d3.select(svgRef.current);
    const width = svg.node().clientWidth;
    const height = data.length * 25 + 50; // Height based on number of requests
    const margin = { top: 20, right: 30, bottom: 30, left: 150 };

    svg.attr("height", height);

    const x = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.duration)])
      .range([margin.left, width - margin.right]);

    const y = d3.scaleBand()
      .domain(d3.range(data.length))
      .range([margin.top, height - margin.bottom])
      .padding(0.1);

    // Clear previous chart elements
    svg.selectAll("*",).remove();

    // X-axis
    svg.append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x).tickFormat(d => formatTime(d)));

    // Y-axis (labels)
    svg.append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y).tickFormat(i => {
        const label = data[i].name;
        return label.length > 40 ? label.substring(0, 40) + '...' : label;
      }));

    // Bars for each request
    svg.selectAll(".bar")
      .data(data)
      .join("rect")
      .attr("class", "bar")
      .attr("x", margin.left)
      .attr("y", (d, i) => y(i))
      .attr("width", d => x(d.duration) - margin.left)
      .attr("height", y.bandwidth())
      .attr("fill", "steelblue");

    // Tooltip (basic)
    svg.selectAll(".bar")
      .append("title")
      .text(d => `URL: ${d.name}
Duration: ${formatTime(d.duration)}`);

  }, [data]);

  return (
    <div className="waterfall-chart">
      <h3>Network Requests Waterfall</h3>
      <svg ref={svgRef} width="100%"></svg>
    </div>
  );
}

export default WaterfallChart;