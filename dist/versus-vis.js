import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

async function drawVis() {
  const dataset = [
    { round: 1, alex_strikes: 23, izzy_strikes: 23 },
    { round: 2, alex_strikes: 17, izzy_strikes: 20 },
    { round: 3, alex_strikes: 8, izzy_strikes: 14 },
    { round: 4, alex_strikes: 15, izzy_strikes: 20 },
    { round: 5, alex_strikes: 28, izzy_strikes: 9 },
  ];

  const margin = { top: 20, right: 20, bottom: 50, left: 60 };
  const legendHeight = 40;

  function resize() {
    const container = d3.select("#versus").node();
    const initialWidth = 800;
    const initialHeight = 400;

    const width = Math.min(Math.max(container.clientWidth * 0.9, 500), initialWidth);
    const height = Math.min(Math.max(container.clientHeight * 0.6, 300), initialHeight) + legendHeight;

    // Clear previous visualization
    d3.select("#versus svg").remove();

    // Create responsive SVG
    const svg = d3
      .select("#versus")
      .append("svg")
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("preserveAspectRatio", "xMidYMid meet")
      .style("width", "100%")
      .style("height", "auto");

    const xScale = d3
      .scaleLinear()
      .domain([0, d3.max(dataset, (d) => Math.max(d.alex_strikes, d.izzy_strikes))])
      .range([margin.left, width - margin.right]);

    const yPadding = width < 600 ? 0.1 : 0.2;
    const yScale = d3
      .scaleBand()
      .domain(dataset.map((d) => `Round ${d.round}`))
      .range([margin.top, height - margin.bottom - legendHeight])
      .padding(yPadding);

    const rounds = svg
      .selectAll(".round")
      .data(dataset)
      .enter()
      .append("g")
      .attr("class", "round")
      .attr("transform", (d) => `translate(0,${yScale(`Round ${d.round}`)})`);

    const barHeightFactor = width < 600 ? 3 : 4;
    const barHeight = yScale.bandwidth() / barHeightFactor;

    // Tooltip
    const fontSizeTooltip = window.innerWidth < 500 ? "16px" : "12px";

    const tooltip = d3
      .select("body")
      .append("div")
      .style("position", "absolute")
      .style("background-color", "rgba(0, 0, 0, 0.7)")
      .style("color", "white")
      .style("padding", "8px")
      .style("border-radius", "5px")
      .style("font-size", fontSizeTooltip)
      .style("display", "none")
      .style("pointer-events", "none");

    // Add Alex's bars
    rounds
      .append("rect")
      .attr("x", xScale(0))
      .attr("y", yScale.bandwidth() / barHeightFactor)
      .attr("width", (d) => xScale(d.alex_strikes) - xScale(0))
      .attr("height", barHeight)
      .attr("fill", "#ebac00")
      .attr("opacity", (d) => (d.round === 5 ? 1 : 0.3))
      .on("mouseover", function (event, d) {
        d3.select(this)
          .transition()
          .duration(300)
          .style("opacity", 1);

        tooltip
          .style("display", "block")
          .html(`<strong>Round ${d.round}</strong><br>Alex: ${d.alex_strikes}`);
      })
      .on("mousemove", function (event) {
        tooltip
          .style("left", `${event.pageX + 10}px`)
          .style("top", `${event.pageY - 28}px`);
      })
      .on("mouseout", function (event, d) {
        d3.select(this)
          .transition()
          .duration(300)
          .style("opacity", d.round === 5 ? 1 : 0.3);

        tooltip.style("display", "none");
      });

    // Add Izzy's bars
    rounds
      .append("rect")
      .attr("x", xScale(0))
      .attr("y", (yScale.bandwidth() / barHeightFactor) * 2)
      .attr("width", (d) => xScale(d.izzy_strikes) - xScale(0))
      .attr("height", barHeight)
      .attr("fill", "#008000")
      .attr("opacity", (d) => (d.round === 5 ? 1 : 0.3))
      .on("mouseover", function (event, d) {
        d3.select(this)
          .transition()
          .duration(300)
          .style("opacity", 1);

        tooltip
          .style("display", "block")
          .html(`<strong>Round ${d.round}</strong><br>Izzy: ${d.izzy_strikes}`);
      })
      .on("mousemove", function (event) {
        tooltip
          .style("left", `${event.pageX + 10}px`)
          .style("top", `${event.pageY - 28}px`);
      })
      .on("mouseout", function (event, d) {
        d3.select(this)
          .transition()
          .duration(300)
          .style("opacity", d.round === 5 ? 1 : 0.3);

        tooltip.style("display", "none");
      });

    const fontSizeAxis = window.innerWidth < 500 ? "14px" : "12px";
    const fontSizeLabel = window.innerWidth < 500 ? "16px" : "14px";

    // Add x-axis
    svg
      .append("g")
      .attr("transform", `translate(0,${height - margin.bottom - legendHeight})`)
      .call(d3.axisBottom(xScale).ticks(Math.min(5, width / 100)))
      .attr("font-size", fontSizeAxis);

    // Add x-axis label
    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", height - margin.bottom + 15)
      .attr("text-anchor", "middle")
      .attr("font-size", fontSizeLabel)
      .text("Significant Strikes");

    // Add y-axis
    svg
      .append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(yScale))
      .attr("font-size", fontSizeAxis);
  }

  // Initial render
  resize();

  // Add resize listener
  window.addEventListener("resize", resize);
}

drawVis();
