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

    container.selectAll("svg").remove();
    container.selectAll("div").remove();

    let chartWidthPercentage = containerWidth < 700 ? "100%" : "75%";
    const isSmallScreen = window.innerWidth < 500;
    const fontSize = isSmallScreen ? "16px" : "12px";

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

    svg
      .append("g")
      .attr("transform", `translate(0, ${height - margin.bottom})`)
      .call(d3.axisBottom(xScale).ticks(5))
      .selectAll("text")
      .attr("text-anchor", "middle")
      .style("font-size", fontSize);

    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", height - margin.bottom / 2 + 15)
      .attr("text-anchor", "middle")
      .style("font-size", fontSize)
      .text("Strikes Attempted per Minute");

    svg
      .append("g")
      .attr("transform", `translate(${margin.left}, 0)`)
      .call(d3.axisLeft(yScale).ticks(5))
      .selectAll("text")
      .style("font-size", fontSize);

    svg
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -(height / 2.25))
      .attr("y", margin.left / 2.25 - 15)
      .attr("text-anchor", "middle")
      .style("font-size", fontSize)
      .text("Striking Accuracy (%)");

    const tooltip = container
      .append("div")
      .style("position", "absolute")
      .style("background-color", "rgba(0, 0, 0, 0.7)")
      .style("color", "white")
      .style("padding", "8px")
      .style("border-radius", "5px")
      .style("font-size", fontSize)
      .style("display", "none")
      .style("pointer-events", "none");

    const fighterGroups = svg.selectAll(".fighter-group")
      .data(filteredFighterStats)
      .enter()
      .append("g")
      .attr("class", "fighter-group");

    fighterGroups
      .append("circle")
      .attr("cx", (d) => xScale(d.strikesAttempted))
      .attr("cy", (d) => yScale(d.strikingAccuracy))
      .attr("r", isSmallScreen ? 8 : 5)
      .attr("fill", "black")
      .style("opacity", (d) => (d.name === "Alex Pereira" ? 1 : 0.3))
      .on("mouseover", onHover)
      .on("mousemove", onMove)
      .on("mouseout", onMouseOut);

    fighterGroups
      .append("text")
      .attr("x", (d) => xScale(d.strikesAttempted) + 8)
      .attr("y", (d) => yScale(d.strikingAccuracy) + 3)
      .attr("font-size", isSmallScreen ? "14px" : "10px")
      .attr("fill", "#333")
      .style("opacity", (d) => (d.name === "Alex Pereira" ? 1 : 0.3))
      .text((d) => isSmallScreen ? d.name.split(" ").slice(-1)[0] : d.name)
      .on("mouseover", onHover)
      .on("mousemove", onMove)
      .on("mouseout", onMouseOut);

    function onHover(event, d) {
      tooltip
        .style("display", "block")
        .html(
          `<strong>${d.name}</strong><br>Strikes Attempted: ${d.strikesAttempted}<br>Striking Accuracy: ${d.strikingAccuracy}%`
        );

      if (d.name !== "Alex Pereira") {
        d3.select(this.parentNode).select("circle")
          .transition()
          .duration(300)
          .style("opacity", 1);
        
        d3.select(this.parentNode).select("text")
          .transition()
          .duration(300)
          .style("opacity", 1);
      }
    }

    function onMove(event, d) {
      const tooltipWidth = 150;
      const tooltipDirection = d.strikesAttempted > 3 ? "left" : "right";
      const xPosition = tooltipDirection === "left"
        ? event.pageX - tooltipWidth - 10
        : event.pageX + 10;
      const yPosition = event.pageY - 28;

      tooltip.style("left", `${xPosition}px`).style("top", `${yPosition}px`);
    }

    function onMouseOut(event, d) {
      tooltip.style("display", "none");

      if (d.name !== "Alex Pereira") {
        d3.select(this.parentNode).select("circle")
          .transition()
          .duration(300)
          .style("opacity", 0.3);

        d3.select(this.parentNode).select("text")
          .transition()
          .duration(300)
          .style("opacity", 0.3);
      }
    }
  }

  drawChart();
  window.addEventListener("resize", drawChart);
})();
