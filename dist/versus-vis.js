import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

async function drawVis() {
  const dataset = [
    { round: 1, alex_strikes: 23, izzy_strikes: 23 },
    { round: 2, alex_strikes: 17, izzy_strikes: 20 },
    { round: 3, alex_strikes: 8, izzy_strikes: 14 },
    { round: 4, alex_strikes: 15, izzy_strikes: 20 },
    { round: 5, alex_strikes: 28, izzy_strikes: 9 },
  ];

  const margin = { top: 20, right: 20, bottom: 50, left: 60 }; // Adjusted bottom margin for label
  const legendHeight = 40;

  function resize() {
    const container = d3.select("#versus").node();
    const width = container.clientWidth * 0.9;
    const height = (container.clientHeight || 300) + legendHeight;

    // Clear previous visualization
    d3.select("#versus svg").remove();

    const svg = d3
      .select("#versus")
      .append("svg")
      .attr("width", width)
      .attr("height", height);

    const xScale = d3
      .scaleLinear()
      .domain([0, d3.max(dataset, (d) => Math.max(d.alex_strikes, d.izzy_strikes))])
      .range([margin.left, width - margin.right]);

    const yScale = d3
      .scaleBand()
      .domain(dataset.map((d) => `Round ${d.round}`))
      .range([margin.top, height - margin.bottom - legendHeight])
      .padding(0.2);

    const rounds = svg
      .selectAll(".round")
      .data(dataset)
      .enter()
      .append("g")
      .attr("class", "round")
      .attr("transform", (d) => `translate(0,${yScale(`Round ${d.round}`)})`);

    // Add Alex's bars
    rounds
      .append("rect")
      .attr("x", xScale(0))
      .attr("y", yScale.bandwidth() / 4)
      .attr("width", (d) => xScale(d.alex_strikes) - xScale(0))
      .attr("height", yScale.bandwidth() / 4)
      .attr("fill", (d) => (d.round === 5 ? "#ebac00" : "lightgray")) // Yellow for round 5, light gray for others
      .attr("opacity", (d) => (d.round === 5 ? 1 : 0.3)); // Highlight round 5, dim others

    // Add Izzy's bars
    rounds
      .append("rect")
      .attr("x", xScale(0))
      .attr("y", (yScale.bandwidth() / 4) * 2)
      .attr("width", (d) => xScale(d.izzy_strikes) - xScale(0))
      .attr("height", yScale.bandwidth() / 4)
      .attr("fill", (d) => (d.round === 5 ? "green" : "#a9a9a9")) // Green for round 5, dark gray (#a9a9a9) for others
      .attr("opacity", (d) => (d.round === 5 ? 1 : 0.3)); // Highlight round 5, dim others

    // Add x-axis
    svg
      .append("g")
      .attr("transform", `translate(0,${height - margin.bottom - legendHeight})`)
      .call(d3.axisBottom(xScale).ticks(Math.min(5, width / 100)))
      .attr("font-size", "12px");

    // Add x-axis label
    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", height - margin.bottom + 15) // Position below the axis
      .attr("text-anchor", "middle")
      .attr("font-size", "14px")
      .text("Significant Strikes");

    // Add y-axis
    svg
      .append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(yScale))
      .attr("font-size", "12px");

    // Add legend
    const legend = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${height - legendHeight + 10})`);

    // Alex's legend
    legend
      .append("rect")
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", 20)
      .attr("height", 20)
      .attr("fill", "#ebac00"); // Yellow for Alex

    legend
      .append("text")
      .attr("x", 30)
      .attr("y", 15)
      .text("Alex Pereira")
      .attr("font-size", "12px")
      .attr("alignment-baseline", "middle");

    // Izzy's legend
    legend
      .append("rect")
      .attr("x", 120)
      .attr("y", 0)
      .attr("width", 20)
      .attr("height", 20)
      .attr("fill", "green"); // Green for Izzy

    legend
      .append("text")
      .attr("x", 150)
      .attr("y", 15)
      .text("Israel Adesanya")
      .attr("font-size", "12px")
      .attr("alignment-baseline", "middle");
  }

  // Initial render
  resize();

  // Add resize listener
  window.addEventListener("resize", resize);
}

drawVis();
