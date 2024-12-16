import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

async function drawTimeline() {
  const width = 1600; // Increased width for more spacing
  const height = 500; // Increased height for better proportions
  const margin = { top: 150, right: 150, bottom: 150, left: 150 };

  // Data for the timeline
  const timelineData = [
    { year: 2014, text: "Wins Glory Middleweight Contender Tournament" },
    { year: 2015, text: "Wins WGP Kickboxing 85kg title" },
    { year: 2016, text: "Defeats Israel Adesanya by decision", izzyFight: true },
    { year: 2017, text: "Defeats Israel Adesanya by knockout", izzyFight: true },
    { year: 2018, text: "Defends the Glory Middleweight Championship twice" },
    { year: 2019, text: "Wins the interim Glory Light Heavyweight Championship" },
  ];

  // Create the SVG container
  const svg = d3
    .select("#timeline")
    .append("svg")
    .attr("width", "100%")
    .attr("viewBox", `0 0 ${width} ${height}`)
    .style("max-width", `${width}px`)
    .style("display", "block")
    .style("margin", "0 auto");

  // Scales for positioning
  const xScale = d3
    .scalePoint()
    .domain(timelineData.map((d) => d.year))
    .range([margin.left, width - margin.right])
    .padding(0.1); // Adjusted padding for more space between circles

  const circleRadius = 60;
  const lineOffset = circleRadius + 3; // Adjust line offset to stop before the circles

  // Draw the yellow line segments
  const yellowLines = [];
  for (let i = 0; i < timelineData.length - 1; i++) {
    const line = svg
      .append("line")
      .attr("x1", xScale(timelineData[i].year) + lineOffset)
      .attr("y1", height / 2)
      .attr("x2", xScale(timelineData[i + 1].year) - lineOffset)
      .attr("y2", height / 2)
      .attr("stroke", "#ebac00")
      .attr("stroke-width", 8)
      .style("opacity", 0.3);
    yellowLines.push(line);
  }

  // Add line segments extending beyond the first and last circles
  const leftLine = svg
    .append("line")
    .attr("x1", margin.left / 2)
    .attr("y1", height / 2)
    .attr("x2", xScale(timelineData[0].year) - lineOffset)
    .attr("y2", height / 2)
    .attr("stroke", "#ebac00")
    .attr("stroke-width", 8)
    .style("opacity", 0.3);

  const rightLine = svg
    .append("line")
    .attr("x1", xScale(timelineData[timelineData.length - 1].year) + lineOffset)
    .attr("y1", height / 2)
    .attr("x2", width - margin.right / 2)
    .attr("y2", height / 2)
    .attr("stroke", "#ebac00")
    .attr("stroke-width", 8)
    .style("opacity", 0.3);

  // Add the green segment between Izzy fight circles
  const greenLine = svg
    .append("line")
    .attr("x1", xScale(2016) + lineOffset)
    .attr("y1", height / 2)
    .attr("x2", xScale(2017) - lineOffset)
    .attr("y2", height / 2)
    .attr("stroke", "green")
    .attr("stroke-width", 8)
    .style("opacity", 1);

  // Add circles
  const circles = svg
    .selectAll("circle")
    .data(timelineData)
    .enter()
    .append("circle")
    .attr("cx", (d) => xScale(d.year))
    .attr("cy", height / 2)
    .attr("r", circleRadius)
    .attr("fill", (d) => (d.izzyFight ? "green" : "white"))
    .attr("stroke", (d) => (d.izzyFight ? "green" : "#ebac00"))
    .attr("stroke-width", 8)
    .style("opacity", (d) => (d.izzyFight ? 1 : 0.3));

  // Add years below circles
  const yearText = svg
    .selectAll(".year-text")
    .data(timelineData)
    .enter()
    .append("text")
    .attr("x", (d) => xScale(d.year))
    .attr("y", height / 2 + 160) // More space below circles
    .attr("text-anchor", "middle")
    .attr("font-size", "2.5em") // Larger font for years
    .attr("fill", "black")
    .style("opacity", (d) => (d.izzyFight ? 1 : 0.3))
    .text((d) => d.year);

  // Add text above circles
  const eventText = svg
    .selectAll(".event-text")
    .data(timelineData)
    .enter()
    .append("text")
    .attr("x", (d) => xScale(d.year))
    .attr("y", height / 2 - 180) // More space above circles
    .attr("text-anchor", "middle")
    .attr("font-size", "1.3em")
    .attr("fill", "black")
    .style("opacity", (d) => (d.izzyFight ? 1 : 0.3))
    .text((d) => d.text)
    .call(wrapText, 200); // Adjust wrap width for larger spacing

  // Add hover effects with transitions
  circles
    .on("mouseover", function (event, d) {
      if (d.izzyFight) {
        // Highlight Izzy fight elements
        circles.transition().duration(200).style("opacity", (data) => (data.izzyFight ? 1 : 0.3));
        yearText.transition().duration(200).style("opacity", (data) => (data.izzyFight ? 1 : 0.3));
        eventText.transition().duration(200).style("opacity", (data) => (data.izzyFight ? 1 : 0.3));
        greenLine.transition().duration(200).style("opacity", 1);
        yellowLines.forEach((line) => line.transition().duration(200).style("opacity", 0.3));
        leftLine.transition().duration(200).style("opacity", 0.3);
        rightLine.transition().duration(200).style("opacity", 0.3);
      } else {
        // Highlight non-Izzy fight elements
        circles.transition().duration(200).style("opacity", (data) => (data === d ? 1 : 0.3));
        yearText.transition().duration(200).style("opacity", (data) => (data === d ? 1 : 0.3));
        eventText.transition().duration(200).style("opacity", (data) => (data === d ? 1 : 0.3));
        yellowLines.forEach((line, i) => {
          const related = timelineData[i] === d || timelineData[i + 1] === d;
          line.transition().duration(200).style("opacity", related ? 1 : 0.3);
        });
        leftLine.transition().duration(200).style("opacity", d === timelineData[0] ? 1 : 0.3);
        rightLine.transition().duration(200).style("opacity", d === timelineData[timelineData.length - 1] ? 1 : 0.3);
        greenLine.transition().duration(200).style("opacity", 0.3);
      }
    })
    .on("mouseout", function () {
      // Reset opacity for all elements
      circles.transition().duration(200).style("opacity", (d) => (d.izzyFight ? 1 : 0.3));
      yearText.transition().duration(200).style("opacity", (d) => (d.izzyFight ? 1 : 0.3));
      eventText.transition().duration(200).style("opacity", (d) => (d.izzyFight ? 1 : 0.3));
      greenLine.transition().duration(200).style("opacity", 1);
      yellowLines.forEach((line) => line.transition().duration(200).style("opacity", 0.3));
      leftLine.transition().duration(200).style("opacity", 0.3);
      rightLine.transition().duration(200).style("opacity", 0.3);
    });

  // Helper function to wrap text
  function wrapText(selection, width) {
    selection.each(function () {
      const text = d3.select(this);
      const words = text.text().split(/\s+/).reverse();
      let word;
      let line = [];
      let lineNumber = 0;
      const lineHeight = 1.2; // ems
      const y = text.attr("y");
      const dy = 0;
      let tspan = text
        .text(null)
        .append("tspan")
        .attr("x", text.attr("x"))
        .attr("y",y)
        .attr("dy", dy + "em");

      while ((word = words.pop())) {
        line.push(word);
        tspan.text(line.join(" "));
        if (tspan.node().getComputedTextLength() > width) {
          line.pop();
          tspan.text(line.join(" "));
          line = [word];
          tspan = text
            .append("tspan")
            .attr("x", text.attr("x"))
            .attr("y", y)
            .attr("dy", ++lineNumber * lineHeight + dy + "em")
            .text(word);
        }
      }
    });
  }
}

drawTimeline();
