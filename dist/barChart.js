import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

(() => {
  const titleDefenseData = [
      { fighter: 'Alex Pereira', days: 175 },
      { fighter: 'Ronda Rousey', days: 189 },
      { fighter: 'Frank Shamrock', days: 217 },
      { fighter: 'Tito Ortiz', days: 231 },
      { fighter: 'Matt Hughes', days: 238 },
      { fighter: 'Kamaru Usman', days: 278 },
      { fighter: 'Chuck Liddell', days: 336 },
      { fighter: 'Demetrius Johnson', days: 357 }
  ];

  const width = 500;
  const height = 300;
  const margin = { top: 20, right: 20, bottom: 50, left: 50 };

  const xScale = d3.scaleBand()
      .domain(titleDefenseData.map(d => d.fighter))
      .range([margin.left, width - margin.right])
      .padding(0.1);

  const yScale = d3.scaleLinear()
      .domain([0, d3.max(titleDefenseData, d => d.days)])
      .range([height - margin.bottom, margin.top]);

  const svg = d3.select("#bar-chart")
      .append("svg")
      .attr("width", width)
      .attr("height", height);

  svg.append("g")
      .attr("transform", `translate(0, ${height - margin.bottom})`)
      .call(d3.axisBottom(xScale))
      .selectAll("text")
      .attr("transform", "rotate(-45)")
      .attr("text-anchor", "end");

  svg.append("g")
      .attr("transform", `translate(${margin.left}, 0)`)
      .call(d3.axisLeft(yScale));

  svg.selectAll("rect")
      .data(titleDefenseData)
      .enter()
      .append("rect")
      .attr("x", d => xScale(d.fighter))
      .attr("y", d => yScale(d.days))
      .attr("width", xScale.bandwidth())
      .attr("height", d => height - margin.bottom - yScale(d.days))
      .attr("fill", d => d.fighter === 'Alex Pereira' ? '#ff4500' : '#2e8b57');
})();
