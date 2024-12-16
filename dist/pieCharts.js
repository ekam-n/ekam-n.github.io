import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

const fighters = [
  { name: "Alex Pereira", totalWins: 12, knockouts: 10 },
  { name: "Dricus Du Plessis", totalWins: 22, knockouts: 9 },
  { name: "Jon Jones", totalWins: 28, knockouts: 11 },
  { name: "Islam Makhachev", totalWins: 26, knockouts: 5 },
  { name: "Zhang Weili", totalWins: 25, knockouts: 11 },
  { name: "Valentina Shevchenko", totalWins: 24, knockouts: 8 }
];

const width = 175; // Pie chart width
const height = 175; // Pie chart height
const radius = Math.min(width, height) / 2;
const namePadding = 30; // Space between pie charts and fighter names
const bottomPadding = 20; // Additional padding at the bottom

function drawCharts() {
  // Remove the previous SVG to prevent duplication
  d3.select("#pie-charts svg").remove();

  const screenWidth = window.innerWidth;
  const fightersPerRow = screenWidth < 750 ? 3 : fighters.length; // 3 per row for screen width < 750px
  const numberOfRows = Math.ceil(fighters.length / fightersPerRow);

  const totalWidth = fightersPerRow * (width + 20); 
  const containerHeight = numberOfRows * (height + namePadding + bottomPadding); 

  // Create SVG container with responsive sizing
  const svgContainer = d3.select("#pie-charts")
    .append("svg")
    .attr("viewBox", `0 0 ${totalWidth} ${containerHeight}`)
    .attr("preserveAspectRatio", "xMidYMid meet")
    .style("width", "100%")
    .style("height", "auto");

  // Tooltip setup
  const tooltip = d3.select("#pie-charts")
    .append("div")
    .style("position", "absolute")
    .style("background-color", "rgba(0, 0, 0, 0.7)")
    .style("color", "white")
    .style("padding", "5px")
    .style("border-radius", "4px")
    .style("font-size", "12px")
    .style("display", "none")
    .style("pointer-events", "none");

  // Colors
  const defaultColor = d3.scaleOrdinal(["#5e5e5e", "rgba(210, 211, 210, 0.95)"]); // Dark grey and light grey for others
  const alexColor = d3.scaleOrdinal(["#ebac00", "rgba(210, 211, 210, 0.5)"]); // Yellow and 50% grey for Alex

  fighters.forEach((fighter, index) => {
    const data = [
      { type: "Knockouts", value: fighter.knockouts },
      { type: "Other Wins", value: fighter.totalWins - fighter.knockouts }
    ];

    const rowIndex = Math.floor(index / fightersPerRow);
    const colIndex = index % fightersPerRow;

    const xPosition = colIndex * (width + 20) + width / 2;
    const yPosition = rowIndex * (height + namePadding + bottomPadding) + height / 2;

    // Chart group for each pie
    const chartGroup = svgContainer.append("g")
      .attr("class", "fighter-group")
      .attr("transform", `translate(${xPosition}, ${yPosition})`)
      .style("opacity", fighter.name === "Alex Pereira" ? 1 : 0.5); // Set opacity conditionally

    const pie = d3.pie().value(d => d.value);
    const arc = d3.arc().innerRadius(0).outerRadius(radius);

    const pieSlices = chartGroup.selectAll("path")
    .data(pie(data))
    .enter()
    .append("path")
    .attr("d", arc)
    .attr("fill", (d, i) => {
      return fighter.name === "Alex Pereira" ? alexColor(i) : defaultColor(i);
    })
    .on("mouseover", (event, d) => {
      tooltip
        .style("display", "block")
        .html(`<strong>${d.data.type}:</strong> ${d.data.value}`)
        .style("left", `${event.pageX + 10}px`)
        .style("top", `${event.pageY + 10}px`);

      if (d.data.type === "Knockouts" && fighter.name !== "Alex Pereira") {
        pieSlices
          .filter((_, i) => i === 0)
          .transition()
          .duration(300)
          .attr("fill", "black")
          .style("opacity", 1);
      }
    })
    .on("mousemove", (event) => {
      tooltip
        .style("left", `${event.pageX + 10}px`)
        .style("top", `${event.pageY + 10}px`);
    })
    .on("mouseout", () => {
      tooltip.style("display", "none");

      if (fighter.name !== "Alex Pereira") {
        pieSlices
          .filter((_, i) => i === 0)
          .transition()
          .duration(300)
          .attr("fill", defaultColor(0))
          .style("opacity", 0.5);
      }
    });

    // Add fighter name below each pie chart with padding
    svgContainer.append("text")
      .attr("class", "fighter-name")
      .attr("x", xPosition)
      .attr("y", yPosition + height / 2 + namePadding)
      .attr("text-anchor", "middle")
      .style("font-size", "15px")
      .style("opacity", fighter.name === "Alex Pereira" ? 1 : 0.5) 
      .text(fighter.name);

    // Add hover interaction with transitions
    chartGroup
      .on("mouseover", () => {
        if (fighter.name !== "Alex Pereira") {
          chartGroup.transition().duration(300).style("opacity", 1);
        }
      })
      .on("mouseout", () => {
        if (fighter.name !== "Alex Pereira") {
          chartGroup.transition().duration(300).style("opacity", 0.5);
        }
      });
  });
}

// Draw charts on page load
drawCharts();

// Redraw charts on window resize
window.addEventListener('resize', drawCharts);
