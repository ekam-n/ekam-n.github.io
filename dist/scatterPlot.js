import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

(() => {
  const fighterStats = [
    { name: "Alex Pereira", strikesAttempted: 3.44, strikingAccuracy: 63 },
    { name: "Israel Adesanya", strikesAttempted: 3.21, strikingAccuracy: 48 },
    { name: "Conor McGregor", strikesAttempted: 4.66, strikingAccuracy: 49 },
    { name: "Alexander Volkanovski", strikesAttempted: 3.44, strikingAccuracy: 56 },
    { name: "Anderson Silva", strikesAttempted: 2.05, strikingAccuracy: 61 },
    { name: "Max Holloway", strikesAttempted: 4.76, strikingAccuracy: 47 },
    { name: "Stephen Thompson", strikesAttempted: 3.02, strikingAccuracy: 46 },
  ];

  const width = 500;
  const height = 500;
  const margin = { top: 50, right: 50, bottom: 50, left: 50 };

  const xScale = d3
    .scaleLinear()
    .domain([0, d3.max(fighterStats, (d) => d.strikesAttempted)])
    .range([margin.left, width - margin.right]);

  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(fighterStats, (d) => d.strikingAccuracy)])
    .range([height - margin.bottom, margin.top]);

  const svg = d3
    .select("#scatterplot")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  // Add axes
  const bottomAxis = svg
    .append("g")
    .attr("transform", `translate(0, ${height - margin.bottom})`)
    .call(d3.axisBottom(xScale).ticks(5).tickSize(-height + margin.top + margin.bottom));

  const leftAxis = svg
    .append("g")
    .attr("transform", `translate(${margin.left}, 0)`)
    .call(d3.axisLeft(yScale).ticks(5).tickSize(-width + margin.left + margin.right));

  // Add bottom border for x-axis
  svg
    .append("path")
    .attr("d", `M${margin.left},${height - margin.bottom}H${width - margin.right}`)
    .attr("stroke", "black")
    .attr("stroke-width", 1);

  // Remove top and right outlines
  bottomAxis.selectAll(".domain").remove();
  leftAxis.selectAll(".domain").remove();
  svg.selectAll(".tick line").attr("stroke", "#e0e0e0");

  // Add circles
  svg
    .selectAll("circle")
    .data(fighterStats)
    .enter()
    .append("circle")
    .attr("cx", (d) => xScale(d.strikesAttempted))
    .attr("cy", (d) => yScale(d.strikingAccuracy))
    .attr("r", 5)
    .attr("fill", (d) => (d.name === "Alex Pereira" ? "#ff4500" : "#2e8b57"));

  // Add labels
  svg
    .selectAll("text.label")
    .data(fighterStats)
    .enter()
    .append("text")
    .attr("x", (d) => Math.max(margin.left + 5, Math.min(xScale(d.strikesAttempted) + 8, width - margin.right - 5)))
    .attr("y", (d) => Math.max(margin.top + 12, Math.min(yScale(d.strikingAccuracy) + 3, height - margin.bottom - 5)))
    .attr("font-size", "10px")
    .attr("fill", "#333")
    .text((d) => d.name)
    .classed("label", true);
})();
