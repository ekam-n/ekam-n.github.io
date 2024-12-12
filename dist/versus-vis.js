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

    const svg = d3
      .select("#versus")
      .append("svg")
      .attr("width", width)
      .attr("height", height);

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

    // Add Alex's bars
    rounds
      .append("rect")
      .attr("x", xScale(0))
      .attr("y", yScale.bandwidth() / barHeightFactor)
      .attr("width", (d) => xScale(d.alex_strikes) - xScale(0))
      .attr("height", barHeight)
      .attr("fill", (d) => (d.round === 5 ? "#ebac00" : "lightgray"))
      .attr("opacity", (d) => (d.round === 5 ? 1 : 0.3))
      .on("mouseover", function (event, d) {
        d3.select(this).attr("fill", "#ffcc00").attr("opacity", 1);
        tooltip.style("opacity", 1).html(`Round ${d.round}<br>Alex: ${d.alex_strikes}`);
      })
      .on("mousemove", function (event) {
        tooltip
          .style("left", `${event.pageX + 10}px`)
          .style("top", `${event.pageY - 20}px`);
      })
      .on("mouseout", function (event, d) {
        d3.select(this).attr("fill", d.round === 5 ? "#ebac00" : "lightgray").attr("opacity", d.round === 5 ? 1 : 0.3);
        tooltip.style("opacity", 0);
      });

    // Add Izzy's bars
    rounds
      .append("rect")
      .attr("x", xScale(0))
      .attr("y", (yScale.bandwidth() / barHeightFactor) * 2)
      .attr("width", (d) => xScale(d.izzy_strikes) - xScale(0))
      .attr("height", barHeight)
      .attr("fill", (d) => (d.round === 5 ? "green" : "#a9a9a9"))
      .attr("opacity", (d) => (d.round === 5 ? 1 : 0.3))
      .on("mouseover", function (event, d) {
        d3.select(this).attr("fill", "#00cc44").attr("opacity", 1);
        tooltip.style("opacity", 1).html(`Round ${d.round}<br>Izzy: ${d.izzy_strikes}`);
      })
      .on("mousemove", function (event) {
        tooltip
          .style("left", `${event.pageX + 10}px`)
          .style("top", `${event.pageY - 20}px`);
      })
      .on("mouseout", function (event, d) {
        d3.select(this).attr("fill", d.round === 5 ? "green" : "#a9a9a9").attr("opacity", d.round === 5 ? 1 : 0.3);
        tooltip.style("opacity", 0);
      });

    const fontSize = width < 600 ? "10px" : "12px";

    // Add x-axis
    svg
      .append("g")
      .attr("transform", `translate(0,${height - margin.bottom - legendHeight})`)
      .call(d3.axisBottom(xScale).ticks(Math.min(5, width / 100)))
      .attr("font-size", fontSize);

    // Add x-axis label
    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", height - margin.bottom + 15)
      .attr("text-anchor", "middle")
      .attr("font-size", width < 600 ? "12px" : "14px")
      .text("Significant Strikes");

    // Add y-axis
    svg
      .append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(yScale))
      .attr("font-size", fontSize);

    // Add legend
    const legend = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${height - legendHeight + 10})`);

    legend
      .append("rect")
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", 20)
      .attr("height", 20)
      .attr("fill", "#ebac00");

    legend
      .append("text")
      .attr("x", 30)
      .attr("y", 15)
      .text("Alex Pereira")
      .attr("font-size", fontSize)
      .attr("alignment-baseline", "middle");

    legend
      .append("rect")
      .attr("x", 120)
      .attr("y", 0)
      .attr("width", 20)
      .attr("height", 20)
      .attr("fill", "green");

    legend
      .append("text")
      .attr("x", 150)
      .attr("y", 15)
      .text("Israel Adesanya")
      .attr("font-size", fontSize)
      .attr("alignment-baseline", "middle");

    // Tooltip
    const tooltip = d3
      .select("body")
      .append("div")
      .style("position", "absolute")
      .style("background", "rgba(0, 0, 0, 0.7)")
      .style("color", "white")
      .style("padding", "5px 10px")
      .style("border-radius", "4px")
      .style("pointer-events", "none")
      .style("opacity", 0);
  }

  // Initial render
  resize();

  // Add resize listener
  window.addEventListener("resize", resize);
}

drawVis();