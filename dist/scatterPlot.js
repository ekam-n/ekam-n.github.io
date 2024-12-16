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

  function drawChart() {
    const container = d3.select("#scatterplot");
    const containerWidth = container.node().clientWidth || width;

    // Remove any existing SVG and tooltip
    container.selectAll("svg").remove();
    container.selectAll("div").remove();

    // Determine chart width percentage based on container width
    let chartWidthPercentage = containerWidth < 700 ? "100%" : "75%";

    // Check if the screen width is less than 500px
    const isSmallScreen = window.innerWidth < 500;
    const fontSize = isSmallScreen ? "16px" : "12px";

    // Remove "Max Holloway" and "Stephen Thompson" below 500px
    const filteredFighterStats = isSmallScreen
      ? fighterStats.filter((d) => d.name !== "Max Holloway" && d.name !== "Stephen Thompson")
      : fighterStats;

    const xScale = d3
      .scaleLinear()
      .domain([0, d3.max(filteredFighterStats, (d) => d.strikesAttempted)])
      .range([margin.left, width - margin.right]);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(filteredFighterStats, (d) => d.strikingAccuracy)])
      .range([height - margin.bottom, margin.top]);

    const svg = container
      .append("svg")
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("preserveAspectRatio", "xMidYMid meet")
      .style("width", chartWidthPercentage)
      .style("height", "auto")
      .style("display", "block")
      .style("margin", "0 auto");

    // Add X-axis
    svg
      .append("g")
      .attr("transform", `translate(0, ${height - margin.bottom})`)
      .call(d3.axisBottom(xScale).ticks(5))
      .selectAll("text")
      .attr("text-anchor", "middle")
      .style("font-size", fontSize); // Update font size dynamically

    // X-axis label
    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", height - margin.bottom / 2 + 15)
      .attr("text-anchor", "middle")
      .style("font-size", fontSize) // Update font size dynamically
      .text("Strikes Attempted per Minute");

    // Add Y-axis
    svg
      .append("g")
      .attr("transform", `translate(${margin.left}, 0)`)
      .call(d3.axisLeft(yScale).ticks(5))
      .selectAll("text")
      .style("font-size", fontSize); // Update font size dynamically

    // Y-axis label
    svg
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -(height / 2.25))
      .attr("y", margin.left / 2.25 - 15)
      .attr("text-anchor", "middle")
      .style("font-size", fontSize) // Update font size dynamically
      .text("Striking Accuracy (%)");

    // Tooltip
    const tooltip = container
      .append("div")
      .style("position", "absolute")
      .style("background-color", "rgba(0, 0, 0, 0.7)")
      .style("color", "white")
      .style("padding", "8px")
      .style("border-radius", "5px")
      .style("font-size", fontSize) // Update font size dynamically
      .style("display", "none")
      .style("pointer-events", "none");

    // Add circles with tooltips and hover effects
    svg
      .selectAll("circle")
      .data(filteredFighterStats)
      .enter()
      .append("circle")
      .attr("cx", (d) => xScale(d.strikesAttempted))
      .attr("cy", (d) => yScale(d.strikingAccuracy))
      .attr("r", isSmallScreen ? 8 : 5) // Increase radius for smaller screens
      .attr("fill", (d) => (d.name === "Alex Pereira" ? "#ebac00" : "rgba(210, 211, 210, 0.97)"))
      .style("opacity", 0.97)
      .on("mouseover", function (event, d) {
        tooltip
          .style("display", "block")
          .html(
            `<strong>${d.name}</strong><br>Strikes Attempted: ${d.strikesAttempted}<br>Striking Accuracy: ${d.strikingAccuracy}%`
          );

        if (d.name !== "Alex Pereira") {
          d3.select(this)
            .transition()
            .duration(300)
            .attr("fill", "black")
            .style("opacity", 1);
        }
      })
      .on("mousemove", (event, d) => {
        const tooltipWidth = 150; // Approximate width of tooltip
        const tooltipDirection = d.strikesAttempted > 3 ? "left" : "right";
        const xPosition = tooltipDirection === "left"
          ? event.pageX - tooltipWidth - 10
          : event.pageX + 10;
        
        tooltip
          .style("left", `${xPosition}px`)
          .style("top", `${event.pageY - 28}px`);
      })
      .on("mouseout", function (event, d) {
        tooltip.style("display", "none");

        d3.select(this)
          .transition()
          .duration(300)
          .attr("fill", (d) => (d.name === "Alex Pereira" ? "#ebac00" : "rgba(210, 211, 210, 0.97)"))
          .style("opacity", 0.97);
      });

    // Add labels to points
    svg
      .selectAll("text.label")
      .data(filteredFighterStats)
      .enter()
      .append("text")
      .attr("x", (d) => xScale(d.strikesAttempted) + 8)
      .attr("y", (d) => yScale(d.strikingAccuracy) + 3)
      .attr("font-size", isSmallScreen ? "14px" : "10px") // Update font size dynamically
      .attr("fill", "#333")
      .text((d) => {
        // Extract last name if screen is small, otherwise use full name
        return isSmallScreen ? d.name.split(" ").slice(-1)[0] : d.name;
      })
      .classed("label", true);
  }

  // Initial draw
  drawChart();

  // Add a resize event to redraw the chart
  window.addEventListener("resize", drawChart);
})();
