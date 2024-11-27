import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

async function drawVis() {

  const kickboxingDataset = [

    { result: 1, special_fight: 0, knockout: 0, izzy_fight: 0 }, 
    { result: 1, special_fight: 0, knockout: 1, izzy_fight: 0 },
    { result: 1, special_fight: 1, knockout: 0, izzy_fight: 0 }, // WGP 85kg title
    { result: 1, special_fight: 0, knockout: 0, izzy_fight: 0 },
    { result: 0, special_fight: 0, knockout: 0, izzy_fight: 0 },
    { result: 1, special_fight: 0, knockout: 0, izzy_fight: 0 },
    { result: 1, special_fight: 0, knockout: 0, izzy_fight: 0 },
    { result: 1, special_fight: 0, knockout: 0, izzy_fight: 0 },
    { result: 0, special_fight: 0, knockout: 0, izzy_fight: 0 },
    { result: 1, special_fight: 0, knockout: 0, izzy_fight: 0 },
    { result: 1, special_fight: 1, knockout: 0, izzy_fight: 0 }, // Glory mw Tournament
    { result: 1, special_fight: 0, knockout: 0, izzy_fight: 0 },
    { result: 0, special_fight: 0, knockout: 0, izzy_fight: 0 },
    { result: 1, special_fight: 0, knockout: 0, izzy_fight: 0 },
    { result: 1, special_fight: 0, knockout: 0, izzy_fight: 0 },
    { result: 0, special_fight: 0, knockout: 0, izzy_fight: 0 },
    { result: 1, special_fight: 0, knockout: 0, izzy_fight: 0 },
    { result: 1, special_fight: 1, knockout: 0, izzy_fight: 1 }, // first izzy fight
    { result: 1, special_fight: 0, knockout: 0, izzy_fight: 0 },
    { result: 0, special_fight: 0, knockout: 0, izzy_fight: 0 },
    { result: 1, special_fight: 1, knockout: 0, izzy_fight: 1 }, // second izzy fight
    { result: 1, special_fight: 0, knockout: 0, izzy_fight: 0 },
    { result: 0, special_fight: 0, knockout: 0, izzy_fight: 0 },
    { result: 1, special_fight: 1, knockout: 0, izzy_fight: 0 }, // defends WGP 85kg
    { result: 1, special_fight: 1, knockout: 0, izzy_fight: 0 }, // wins glory mw
    { result: 1, special_fight: 0, knockout: 0, izzy_fight: 0 },
    { result: 1, special_fight: 0, knockout: 0, izzy_fight: 0 },
    { result: 1, special_fight: 0, knockout: 0, izzy_fight: 0 },
    { result: 1, special_fight: 0, knockout: 0, izzy_fight: 0 },
    { result: 1, special_fight: 0, knockout: 0, izzy_fight: 0 },
    { result: 1, special_fight: 1, knockout: 0, izzy_fight: 0 }, // 5th glory mw defense
    { result: 1, special_fight: 1, knockout: 0, izzy_fight: 0 }, // wins glory light hw
    { result: 0, special_fight: 0, knockout: 0, izzy_fight: 0 }

  ];

  // console.log(kickboxingDataset);

// Initial dimensions
let width = window.innerWidth * 0.98;
let height = window.innerHeight * 0.3;
let padding = width * 0.05;

// Create the SVG
const svg = d3
  .select("#timeline")
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
svg
  .selectAll("rect")
  .data(kickboxingDataset)
  .enter()
  .append("rect")
  .attr("x", (_, i) => xScale(i)) // Position based on index
  .attr("y", height / 2 - 20) // Centered vertically
  .attr("width", (_, i) => xScale(i + 1) - xScale(i)) // Adjust width to connect rectangles
  .attr("height", height * 0.1) // Height of the rectangles
  .attr("fill", (d) =>
    d.izzy_fight ? "#006400" : d.result ? "#90EE90" : "#FF9999" // Dark green for Izzy fights, light green for wins, lighter red for losses
  );

// Add text labels for Izzy fights
svg
  .selectAll("text")
  .data(kickboxingDataset.filter((d) => d.izzy_fight)) // Filter only Izzy fights
  .enter()
  .append("text")
  .attr("x", (_, i) => xScale(kickboxingDataset.findIndex((d) => d.izzy_fight && i-- === 0)) + 20) // Find the index of each Izzy fight
  .attr("y", height / 2 + height * 0.15) // Below the rectangles
  .attr("text-anchor", "middle")
  .attr("font-size", "clamp(0.75rem, 1.5vw, 1rem)")
  .classed("text-gray-700", true)
  .text((_, i) => `Izzy Fight ${i + 1}`);

// Add resize listener
window.addEventListener("resize", () => {
  // Update dimensions
  width = window.innerWidth * 0.9;
  height = window.innerHeight * 0.3;
  padding = width * 0.05;

  // Update scales
  xScale.range([padding, width - padding]);

  // Update SVG dimensions
  svg.attr("width", width).attr("height", height);

  // Update rectangles
  svg
    .selectAll("rect")
    .attr("x", (_, i) => xScale(i))
    .attr("y", height / 2 - height * 0.1 / 2)
    .attr("width", (_, i) => xScale(i + 1) - xScale(i))
    .attr("height", height * 0.1)
    .attr("fill", (d) =>
      d.izzy_fight ? "#006400" : d.result ? "#90EE90" : "#FF9999"
    );

  // Update text labels
  svg
    .selectAll("text")
    .attr(
      "x",
      (_, i) => xScale(kickboxingDataset.findIndex((d) => d.izzy_fight && i-- === 0))
    )
    .attr("y", height / 2 + height * 0.15);
});





  

}

drawVis();