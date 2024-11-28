import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

const fighters = [
  { name: "Alex Pereira", totalWins: 12, knockouts: 10 },
  { name: "Dricus Du Plessis", totalWins: 22, knockouts: 9 },
  { name: "Jon Jones", totalWins: 28, knockouts: 11 },
  { name: "Islam Makhachev", totalWins: 26, knockouts: 5 }
];

const width = 175;
const height = 175;
const radius = Math.min(width, height) / 2;

fighters.forEach(fighter => {
  const data = [
      { type: "Knockouts", value: fighter.knockouts },
      { type: "Other Wins", value: fighter.totalWins - fighter.knockouts }
  ];

  const pieChartContainer = d3.select("#pie-charts")
      .append("svg")
      .attr("width", width)
      .attr("height", height);

  const group = pieChartContainer
      .append("g")
      .attr("transform", `translate(${width / 2}, ${height / 2})`);

  const color = d3.scaleOrdinal(["#ff4500", "#2e8b57"]);

  const pie = d3.pie().value(d => d.value);
  const arc = d3.arc().innerRadius(0).outerRadius(radius);

  group.selectAll("path")
      .data(pie(data))
      .enter()
      .append("path")
      .attr("d", arc)
      .attr("fill", (d, i) => color(i));

  pieChartContainer
      .append("text")
      .attr("x", width / 2)
      .attr("y", height - 10)
      .attr("text-anchor", "middle")
      .text(fighter.name);
});
