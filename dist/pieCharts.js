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

const totalWidth = fighters.length * (width + 20); // Adjust for gap
const containerHeight = height + namePadding + bottomPadding; // Calculate height dynamically

// Create SVG container
const svgContainer = d3.select("#pie-charts")
  .append("svg")
  .attr("width", totalWidth)
  .attr("height", containerHeight);

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

  // Chart group for each pie
  const chartGroup = svgContainer.append("g")
    .attr("class", "fighter-group")
    .attr("transform", `translate(${index * (width + 20) + width / 2}, ${height / 2})`)
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
  const fighterText = svgContainer.append("text")
    .attr("class", "fighter-name")
    .attr("x", index * (width + 20) + width / 2)
    .attr("y", height + namePadding)
    .attr("text-anchor", "middle")
    .style("font-size", "15px")
    .style("opacity", fighter.name === "Alex Pereira" ? 1 : 0.5) // Set opacity for text
    .text(fighter.name);

  // Add hover interaction with transitions
  chartGroup
    .on("mouseover", () => {
      if (fighter.name !== "Alex Pereira") {
        chartGroup.transition().duration(300).style("opacity", 1); // Bring chart to full opacity
        fighterText.transition().duration(300).style("opacity", 1); // Highlight fighter name
      }
    })
    .on("mouseout", () => {
      if (fighter.name !== "Alex Pereira") {
        chartGroup.transition().duration(300).style("opacity", 0.5); // Dim chart opacity
        fighterText.transition().duration(300).style("opacity", 0.5); // Reset text opacity
      }
    });
});
