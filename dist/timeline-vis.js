import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

async function drawVis() {
  const kickboxingDataset = [
    { result: 1, special_fight: 0, knockout: 0, izzy_fight: 0 },
    { result: 1, special_fight: 0, knockout: 1, izzy_fight: 0 },
    { result: 1, special_fight: 1, knockout: 0, izzy_fight: 0 },
    { result: 1, special_fight: 0, knockout: 0, izzy_fight: 0 },
    { result: 0, special_fight: 0, knockout: 0, izzy_fight: 0 },
    { result: 1, special_fight: 0, knockout: 0, izzy_fight: 0 },
    { result: 1, special_fight: 0, knockout: 0, izzy_fight: 0 },
    { result: 1, special_fight: 0, knockout: 0, izzy_fight: 0 },
    { result: 0, special_fight: 0, knockout: 0, izzy_fight: 0 },
    { result: 1, special_fight: 0, knockout: 0, izzy_fight: 0 },
    { result: 1, special_fight: 1, knockout: 0, izzy_fight: 0 },
    { result: 1, special_fight: 0, knockout: 0, izzy_fight: 0 },
    { result: 0, special_fight: 0, knockout: 0, izzy_fight: 0 },
    { result: 1, special_fight: 0, knockout: 0, izzy_fight: 0 },
    { result: 1, special_fight: 0, knockout: 0, izzy_fight: 0 },
    { result: 0, special_fight: 0, knockout: 0, izzy_fight: 0 },
    { result: 1, special_fight: 0, knockout: 0, izzy_fight: 0 },
    { result: 1, special_fight: 1, knockout: 0, izzy_fight: 1 },
    { result: 1, special_fight: 0, knockout: 0, izzy_fight: 0 },
    { result: 0, special_fight: 0, knockout: 0, izzy_fight: 0 },
    { result: 1, special_fight: 1, knockout: 0, izzy_fight: 1 },
    { result: 1, special_fight: 0, knockout: 0, izzy_fight: 0 },
    { result: 0, special_fight: 0, knockout: 0, izzy_fight: 0 },
    { result: 1, special_fight: 1, knockout: 0, izzy_fight: 0 },
    { result: 1, special_fight: 1, knockout: 0, izzy_fight: 0 },
    { result: 1, special_fight: 0, knockout: 0, izzy_fight: 0 },
    { result: 1, special_fight: 0, knockout: 0, izzy_fight: 0 },
    { result: 1, special_fight: 0, knockout: 0, izzy_fight: 0 },
    { result: 1, special_fight: 0, knockout: 0, izzy_fight: 0 },
    { result: 1, special_fight: 0, knockout: 0, izzy_fight: 0 },
    { result: 1, special_fight: 1, knockout: 0, izzy_fight: 0 },
    { result: 1, special_fight: 1, knockout: 0, izzy_fight: 0 },
    { result: 0, special_fight: 0, knockout: 0, izzy_fight: 0 }
  ];

  const container = d3.select("#timeline");

  // Initial dimensions
  let containerWidth = container.node().getBoundingClientRect().width;
  let width = containerWidth;
  let height = window.innerHeight * 0.3;
  let padding = width * 0.05;

  // Create the SVG
  const svg = container
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .classed("bg-gray-100", true);

  // Define the xScale
  const xScale = d3
    .scaleLinear()
    .domain([0, kickboxingDataset.length])
    .range([padding, width - padding]);

  // Draw rectangles
  const drawRects = () => {
    svg
      .selectAll("rect")
      .data(kickboxingDataset)
      .join("rect")
      .attr("x", (_, i) => xScale(i))
      .attr("y", height / 2 - 20)
      .attr("width", (_, i) => xScale(i + 1) - xScale(i))
      .attr("height", height * 0.1)
      .attr("fill", (d) =>
        d.izzy_fight ? "#006400" : d.result ? "#90EE90" : "#FF9999"
      );
  };

  // Add text labels for Izzy fights
  const drawLabels = () => {
    svg
      .selectAll("text")
      .data(kickboxingDataset.filter((d) => d.izzy_fight))
      .join("text")
      .attr("x", (_, i) => xScale(kickboxingDataset.findIndex((d) => d.izzy_fight && i-- === 0)) + 20)
      .attr("y", height / 2 + height * 0.15)
      .attr("text-anchor", "middle")
      .attr("font-size", "clamp(0.75rem, 1.5vw, 0.5rem)")
      .classed("text-gray-700", true)
      .text((_, i) => `Izzy Fight ${i + 1}`);
  };

  // Draw initial visualization
  drawRects();
  drawLabels();

  // Resize listener
  window.addEventListener("resize", () => {
    containerWidth = container.node().getBoundingClientRect().width;
    width = containerWidth;
    height = window.innerHeight * 0.3;
    padding = width * 0.05;

    // Update scales
    xScale.range([padding, width - padding]);

    // Update SVG size
    svg.attr("width", width).attr("height", height);

    // Redraw rectangles and labels
    drawRects();
    drawLabels();
  });
}

drawVis();
