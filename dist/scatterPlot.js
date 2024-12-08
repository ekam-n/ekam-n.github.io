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
  const margin = { top: 50, right: 85, bottom: 75, left: 75 };

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

  // Add X-axis
  svg
    .append("g")
    .attr("transform", `translate(0, ${height - margin.bottom})`)
    .call(d3.axisBottom(xScale).ticks(5))
    .selectAll("text")
    .attr("text-anchor", "middle")
    .style("font-size", "12px");

  // X-axis label
  svg
    .append("text")
    .attr("x", width / 2)
    .attr("y", height - margin.bottom / 2)
    .attr("text-anchor", "middle")
    .style("font-size", "12px")
    .text("Strikes Attempted per Minute");

  // Add Y-axis
  svg
    .append("g")
    .attr("transform", `translate(${margin.left}, 0)`)
    .call(d3.axisLeft(yScale).ticks(5))
    .selectAll("text")
    .style("font-size", "12px");

  // Y-axis label
  svg
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -(height / 2.25))
    .attr("y", margin.left / 2.25)
    .attr("text-anchor", "middle")
    .style("font-size", "12px")
    .text("Striking Accuracy (%)");

  // Tooltip
  const tooltip = d3
    .select("#scatterplot")
    .append("div")
    .style("position", "absolute")
    .style("background-color", "rgba(0, 0, 0, 0.7)")
    .style("color", "white")
    .style("padding", "8px")
    .style("border-radius", "5px")
    .style("font-size", "12px")
    .style("display", "none")
    .style("pointer-events", "none");

  // Add circles with tooltips
  svg
    .selectAll("circle")
    .data(fighterStats)
    .enter()
    .append("circle")
    .attr("cx", (d) => xScale(d.strikesAttempted))
    .attr("cy", (d) => yScale(d.strikingAccuracy))
    .attr("r", 5)
    .attr("fill", (d) => (d.name === "Alex Pereira" ? "#ebac00" : "rgba(210, 211, 210, 0.97)"))
    .on("mouseover", (event, d) => {
      tooltip
        .style("display", "block")
        .html(
          `<strong>${d.name}</strong><br>Strikes Attempted: ${d.strikesAttempted}<br>Striking Accuracy: ${d.strikingAccuracy}%`
        );
    })
    .on("mousemove", (event) => {
      tooltip
        .style("left", `${event.pageX + 10}px`)
        .style("top", `${event.pageY - 28}px`);
    })
    .on("mouseout", () => {
      tooltip.style("display", "none");
    });

  // Add labels to points
  svg
    .selectAll("text.label")
    .data(fighterStats)
    .enter()
    .append("text")
    .attr("x", (d) => xScale(d.strikesAttempted) + 8)
    .attr("y", (d) => yScale(d.strikingAccuracy) + 3)
    .attr("font-size", "10px")
    .attr("fill", "#333")
    .text((d) => d.name)
    .classed("label", true);
})();
