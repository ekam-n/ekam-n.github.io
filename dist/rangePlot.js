import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

(async () => {
  // Load the CSV data
  const titleDefenseData = await d3.csv("../datasets/fast_defenses.csv", d3.autoType);

  const width = 800;
  const height = 500;
  const margin = { top: 40, right: 40, bottom: 80, left: 60 };

  const svg = d3.select("#cleveland-dot-plot")
    .append("svg")
    .attr("viewBox", `0 0 ${width} ${height}`)
    .attr("preserveAspectRatio", "xMidYMid meet")
    .style("width", "100%")
    .style("height", "auto");

  // Convert dates to just month/day for x positioning
  const formatToYearlessDate = (d) => new Date(0, d.getMonth(), d.getDate());

  // Update xScale to span from January 1 to December 31
  const xScale = d3.scaleTime()
    .domain([new Date(0, 0, 1), new Date(0, 11, 31)]) // January 1 to December 31
    .range([margin.left, width - margin.right]);

  // Place Pereira's line in the middle of all lines
  const midpoint = Math.floor(titleDefenseData.length / 2);
  const reorderedData = [
    ...titleDefenseData.filter((d) => d.fighter !== "Alex Pereira").slice(0, midpoint),
    ...titleDefenseData.filter((d) => d.fighter === "Alex Pereira"),
    ...titleDefenseData.filter((d) => d.fighter !== "Alex Pereira").slice(midpoint),
  ];

  const yScale = d3.scaleBand()
    .domain(reorderedData.map((d, i) => i)) // Use index for positioning
    .range([margin.top, height - margin.bottom])
    .padding(0.3);

  // Add axes
  const xAxis = d3.axisBottom(xScale).ticks(d3.timeMonth.every(1)).tickFormat(d3.timeFormat("%b"));
  svg.append("g")
    .attr("transform", `translate(0, ${height - margin.bottom})`)
    .call(xAxis);

  // Add grid lines
  svg
    .append("g")
    .attr("class", "grid")
    .attr("transform", `translate(0, ${height - margin.bottom})`)
    .call(
      d3.axisBottom(xScale)
        .ticks(d3.timeMonth.every(1))
        .tickSize(-(height - margin.top - margin.bottom))
        .tickFormat("")
    )
    .style("stroke-dasharray", "2,2")
    .style("opacity", 0.5);

  // Add lines connecting the two points
  svg
    .selectAll(".line")
    .data(reorderedData)
    .enter()
    .append("line")
    .attr("x1", (d) => xScale(formatToYearlessDate(d.first_defense)))
    .attr("x2", (d) => xScale(formatToYearlessDate(d.third_defense)))
    .attr("y1", (d, i) => yScale(i) + yScale.bandwidth() / 2)
    .attr("y2", (d, i) => yScale(i) + yScale.bandwidth() / 2)
    .attr("stroke", (d) => (d.fighter === "Alex Pereira" ? "#ebac00" : "#aaa"))
    .attr("stroke-width", 2)
    .style("opacity", (d) => (d.fighter === "Alex Pereira" ? 1 : 0.5))
    .attr("class", (d) => (d.fighter === "Alex Pereira" ? "alex-line" : "other-line"));

  // Helper function to add dots
  const addDots = (dataKey, className) => {
    svg
      .selectAll(`.${className}`)
      .data(reorderedData)
      .enter()
      .append("circle")
      .attr("cx", (d) => xScale(formatToYearlessDate(d[dataKey])))
      .attr("cy", (d, i) => yScale(i) + yScale.bandwidth() / 2)
      .attr("r", 6)
      .attr("fill", (d) => (d.fighter === "Alex Pereira" ? "#ebac00" : "#aaa"))
      .style("opacity", (d) => (d.fighter === "Alex Pereira" ? 1 : 0.5))
      .attr("class", (d) => (d.fighter === "Alex Pereira" ? "alex-dot" : "other-dot"));
  };

  addDots("first_defense", "first-dot");
  addDots("third_defense", "third-dot");

  // Add name labels in the middle of the lines
  svg
    .selectAll(".name-label")
    .data(reorderedData)
    .enter()
    .append("text")
    .attr("x", (d) => (xScale(formatToYearlessDate(d.first_defense)) + xScale(formatToYearlessDate(d.third_defense))) / 2)
    .attr("y", (d, i) => yScale(i) + yScale.bandwidth() / 2 - 10)
    .attr("text-anchor", "middle")
    .attr("font-size", "12px")
    .attr("fill", (d) => (d.fighter === "Alex Pereira" ? "black" : "#aaa"))
    .style("opacity", (d) => (d.fighter === "Alex Pereira" ? 1 : 0.5))
    .text((d) => d.fighter)
    .attr("class", "name-label")
    .on("mouseover", (event, d) => {
      // Highlight the associated line and dots for the hovered fighter
      d3.selectAll(".other-line")
        .filter((datum) => datum.fighter === d.fighter)
        .transition()
        .duration(300)
        .style("opacity", 1)
        .attr("stroke", "black");

      d3.selectAll(".other-dot")
        .filter((datum) => datum.fighter === d.fighter)
        .transition()
        .duration(300)
        .style("opacity", 1)
        .attr("fill", "black");

      // Highlight the hovered fighter's name
      d3.selectAll(".name-label")
        .filter((datum) => datum.fighter === d.fighter)
        .transition()
        .duration(300)
        .style("opacity", 1)
        .style("fill", "black");

      // Tooltip setup
      let tooltip = d3.select("#tooltip");
      if (tooltip.empty()) {
        tooltip = d3.select("#cleveland-dot-plot")
          .append("div")
          .attr("id", "tooltip")
          .style("position", "absolute")
          .style("background-color", "rgba(0, 0, 0, 0.7)")
          .style("color", "white")
          .style("padding", "5px")
          .style("border-radius", "4px")
          .style("font-size", "12px")
          .style("pointer-events", "none");
      }

      tooltip
        .style("display", "block")
        .html(`<strong>${d.fighter}</strong><br>Days: ${d.number_days}`)
        .style("left", `${event.pageX + 10}px`)
        .style("top", `${event.pageY + 10}px`);
    })
    .on("mouseout", (event, d) => {
      // Reset the associated line and dots
      d3.selectAll(".other-line")
        .filter((datum) => datum.fighter === d.fighter)
        .transition()
        .duration(300)
        .style("opacity", 0.5)
        .attr("stroke", "#aaa");

      d3.selectAll(".other-dot")
        .filter((datum) => datum.fighter === d.fighter)
        .transition()
        .duration(300)
        .style("opacity", 0.5)
        .attr("fill", "#aaa");

      // Reset the text label of the fighter
      d3.selectAll(".name-label")
        .filter((datum) => datum.fighter === d.fighter)
        .transition()
        .duration(300)
        .style("opacity", (datum) => (datum.fighter === "Alex Pereira" ? 1 : 0.5))
        .style("fill", (datum) => (datum.fighter === "Alex Pereira" ? "black" : "#aaa"));

      // Hide tooltip
      d3.select("#tooltip").style("display", "none");
    });

})();
