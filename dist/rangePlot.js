import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

(async () => {
  // Load the CSV data once
  const titleDefenseData = await d3.csv("../datasets/fast_defenses.csv", d3.autoType);

  const container = d3.select("#cleveland-dot-plot");
  
  // Add a resize listener
  window.addEventListener("resize", resize);
  
  resize(); // Initial draw

  function resize() {
    const node = container.node();
    const containerWidth = node.clientWidth || 800; // fallback if no clientWidth
    
    // Remove previous SVG if any
    container.selectAll("svg").remove();
    container.selectAll("#tooltip").remove();

    // Determine how many fighters to show based on width
    let maxFighters;
    if (containerWidth < 600) {
      maxFighters = 5; 
    } else if (containerWidth < 700) {
      maxFighters = 10;
    } else {
      maxFighters = titleDefenseData.length;
    }

    // Filter/Reorder data
    const midpoint = Math.floor(titleDefenseData.length / 2);
    const reorderedData = [
      ...titleDefenseData.filter((d) => d.fighter !== "Alex Pereira").slice(0, midpoint),
      ...titleDefenseData.filter((d) => d.fighter === "Alex Pereira"),
      ...titleDefenseData.filter((d) => d.fighter !== "Alex Pereira").slice(midpoint),
    ].slice(0, maxFighters); // Take only up to maxFighters

    // Dimensions
    const initialWidth = 800;
    const initialHeight = 600;
    const margin = { top: 40, right: 40, bottom: 80, left: 60 };
    
    // Responsive width and height calculations (similar logic to previous examples)
    const width = Math.min(Math.max(containerWidth, 300), initialWidth);
    const height = initialHeight;

    const svg = container
      .append("svg")
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("preserveAspectRatio", "xMidYMid meet")
      .style("width", "100%")
      .style("height", "auto");

    // Define scales
    const xScale = d3.scaleTime()
      .domain([new Date(0, 0, 1), new Date(0, 11, 31)]) // January 1 to December 31
      .range([margin.left, width - margin.right]);

    const yScale = d3.scaleBand()
      .domain(reorderedData.map((d, i) => i))
      .range([margin.top, height - margin.bottom])
      .padding(0.3);

    // Adjust circle radius and line thickness based on width
    let circleRadius, lineThickness, fontSize, axisFontSize;
    if (width < 600) {
      circleRadius = 8;
      lineThickness = 3;
      fontSize = "14px";
      axisFontSize = "16px";
    } else if (width < 700) {
      circleRadius = 6;
      lineThickness = 2;
      fontSize = "12px";
      axisFontSize = "14px";
    } else {
      circleRadius = 5;
      lineThickness = 2;
      fontSize = "12px";
      axisFontSize = "14px";
    }

    // Adjust the number of ticks on the x-axis based on width
    // For very narrow screens, show fewer month ticks (every 2 months)
    let tickInterval = d3.timeMonth.every(1);
    if (width < 600) {
      tickInterval = d3.timeMonth.every(2); // show every 2 months
    }

    const xAxis = d3.axisBottom(xScale)
      .ticks(tickInterval)
      .tickFormat(d3.timeFormat("%b"));

    // Add x-axis
    svg.append("g")
      .attr("transform", `translate(0, ${height - margin.bottom})`)
      .call(xAxis)
      .attr("font-size", fontSize);

    // Add grid lines (if desired, same tick interval)
    svg
      .append("g")
      .attr("class", "grid")
      .attr("transform", `translate(0, ${height - margin.bottom})`)
      .call(
        d3.axisBottom(xScale)
          .ticks(tickInterval)
          .tickSize(-(height - margin.top - margin.bottom))
          .tickFormat("")
      )
      .style("stroke-dasharray", "2,2")
      .style("opacity", 0.5);

    // Add lines
    svg.selectAll(".line")
      .data(reorderedData)
      .enter()
      .append("line")
      .attr("x1", (d) => xScale(formatToYearlessDate(d.first_defense)))
      .attr("x2", (d) => xScale(formatToYearlessDate(d.third_defense)))
      .attr("y1", (d, i) => yScale(i) + yScale.bandwidth() / 2)
      .attr("y2", (d, i) => yScale(i) + yScale.bandwidth() / 2)
      .attr("stroke", (d) => (d.fighter === "Alex Pereira" ? "#ebac00" : "#aaa"))
      .attr("stroke-width", lineThickness)
      .style("opacity", (d) => (d.fighter === "Alex Pereira" ? 1 : 0.5))
      .attr("class", (d) => (d.fighter === "Alex Pereira" ? "alex-line" : "other-line"));

    // Tooltip
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
        .style("font-size", fontSize)
        .style("pointer-events", "none")
        .style("display", "none");
    }

    // Helper function to add dots
    const addDots = (dataKey, className) => {
      svg
        .selectAll(`.${className}`)
        .data(reorderedData)
        .enter()
        .append("circle")
        .attr("cx", (d) => xScale(formatToYearlessDate(d[dataKey])))
        .attr("cy", (d, i) => yScale(i) + yScale.bandwidth() / 2)
        .attr("r", circleRadius)
        .attr("fill", (d) => (d.fighter === "Alex Pereira" ? "#ebac00" : "#aaa"))
        .style("opacity", (d) => (d.fighter === "Alex Pereira" ? 1 : 0.5))
        .attr("class", (d) => (d.fighter === "Alex Pereira" ? "alex-dot" : "other-dot"));
    };

    addDots("first_defense", "first-dot");
    addDots("third_defense", "third-dot");

    // Add name labels
    svg.selectAll(".name-label")
      .data(reorderedData)
      .enter()
      .append("text")
      .attr("x", (d) => (xScale(formatToYearlessDate(d.first_defense)) + xScale(formatToYearlessDate(d.third_defense))) / 2)
      .attr("y", (d, i) => yScale(i) + yScale.bandwidth() / 2 - 10)
      .attr("text-anchor", "middle")
      .attr("font-size", fontSize)
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

        tooltip.style("display", "none");
      });

    // Optionally, you could add an x-axis label if needed
    svg.append("text")
      .attr("x", width / 2)
      .attr("y", height - margin.bottom / 2)
      .attr("text-anchor", "middle")
      .attr("font-size", axisFontSize)
      .text("Month");
  }

  function formatToYearlessDate(d) {
    return new Date(0, d.getMonth(), d.getDate());
  }
})();
