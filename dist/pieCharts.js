import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

const fighters = [
  { name: "Alex Pereira", totalWins: 12, knockouts: 10 },
  { name: "Dricus Du Plessis", totalWins: 22, knockouts: 9 },
  { name: "Jon Jones", totalWins: 28, knockouts: 11 },
  { name: "Islam Makhachev", totalWins: 26, knockouts: 5 },
  { name: "Zhang Weili", totalWins: 25, knockouts: 11 },
  { name: "Valentina Shevchenko", totalWins: 24, knockouts: 8 }
];

const width = 175; // pie width
const height = 175; // pie height
const radius = Math.min(width, height) / 2;

const totalWidth = fighters.length * (width + 20); // Adjust for gap
const containerHeight = height + 100; // Add space for the legend

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
const color = d3.scaleOrdinal(["#0D0D0D", "rgba(210, 211, 210, 0.95)"]);

// Add legend
const legendGroup = svgContainer.append("g")
  .attr("transform", `translate(${10}, ${height + 40})`); // Position below the charts

const legendData = [
  { label: "Knockouts", color: "#0D0D0D" },
  { label: "Other Wins", color: "rgba(210, 211, 210, 0.95)" }
];

legendGroup.selectAll("rect")
  .data(legendData)
  .enter()
  .append("rect")
  .attr("x", (d, i) => i * 100) // Spacing between legend items
  .attr("width", 15)
  .attr("height", 15)
  .attr("fill", d => d.color);

legendGroup.selectAll("text")
  .data(legendData)
  .enter()
  .append("text")
  .attr("x", (d, i) => i * 100 + 20) // Offset text to the right of each box
  .attr("y", 12) // Center text vertically relative to the box
  .text(d => d.label)
  .style("font-size", "12px")
  .attr("fill", "black");

fighters.forEach((fighter, index) => {
  const data = [
    { type: "Knockouts", value: fighter.knockouts },
    { type: "Other Wins", value: fighter.totalWins - fighter.knockouts }
  ];

  // Chart group for each pie
  const chartGroup = svgContainer.append("g")
    .attr("transform", `translate(${index * (width + 20) + width / 2}, ${height / 2})`);

  const pie = d3.pie().value(d => d.value);
  const arc = d3.arc().innerRadius(0).outerRadius(radius);

  chartGroup.selectAll("path")
    .data(pie(data))
    .enter()
    .append("path")
    .attr("d", arc)
    .attr("fill", (d, i) => color(i))
    .on("mouseover", (event, d) => {
      tooltip
        .style("display", "block")
        .html(`<strong>${d.data.type}</strong>: ${d.data.value}`);
    })
    .on("mousemove", event => {
      tooltip
        .style("left", `${event.pageX + 10}px`)
        .style("top", `${event.pageY + 10}px`);
    })
    .on("mouseout", () => {
      tooltip.style("display", "none");
    });

  // Add fighter name below each pie chart
  svgContainer.append("text")
    .attr("x", index * (width + 20) + width / 2)
    .attr("y", height + 20)
    .attr("text-anchor", "middle")
    .style("font-size", "15px")
    .text(fighter.name);
});
