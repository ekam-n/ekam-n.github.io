import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

async function drawVis() {
  const ufcData = await d3.csv("../datasets/ufc_dataset_with_cumulative_wins.csv", d3.autoType);
  const followersData = await d3.csv("../datasets/filtered_followers_dataset.csv", d3.autoType);

  const container = d3.select("#izzy");

  // Initial dimensions
  let width = container.node().getBoundingClientRect().width;
  const height = 400;
  const margin = { top: 50, right: 50, bottom: 50, left: 60 };

  // Create SVGs for the two graphs
  const svgWins = container
    .append("svg")
    .attr("width", "100%")
    .attr("height", height)
    .classed("bg-gray-100", true);

  const svgFollowers = container
    .append("svg")
    .attr("width", "100%")
    .attr("height", height)
    .classed("bg-gray-100", true);

  const draw = () => {
    width = container.node().getBoundingClientRect().width;

    // Scales for cumulative wins
    const xScaleWins = d3
      .scaleTime()
      .domain(d3.extent(ufcData, (d) => d.date))
      .range([margin.left, width - margin.right]);

    const yScaleWins = d3
      .scaleLinear()
      .domain([0, d3.max(ufcData, (d) => d.cumulative_wins)])
      .range([height - margin.bottom, margin.top]);

    // Scales for followers
    const xScaleFollowers = d3
      .scaleTime()
      .domain(d3.extent(followersData, (d) => d.date))
      .range([margin.left, width - margin.right]);

    const yScaleFollowers = d3
      .scaleLinear()
      .domain([0, d3.max(followersData, (d) => d.followers_count)])
      .range([height - margin.bottom, margin.top]);

    // Clear existing elements in both SVGs
    svgWins.selectAll("*").remove();
    svgFollowers.selectAll("*").remove();

    // Axes for cumulative wins
    svgWins
      .append("g")
      .attr("transform", `translate(0, ${height - margin.bottom})`)
      .call(d3.axisBottom(xScaleWins).tickFormat(d3.timeFormat("%b %Y")));

    svgWins
      .append("g")
      .attr("transform", `translate(${margin.left}, 0)`)
      .call(d3.axisLeft(yScaleWins));

    // Axes for followers
    svgFollowers
      .append("g")
      .attr("transform", `translate(0, ${height - margin.bottom})`)
      .call(d3.axisBottom(xScaleFollowers).tickFormat(d3.timeFormat("%b %Y")));

    svgFollowers
      .append("g")
      .attr("transform", `translate(${margin.left}, 0)`)
      .call(d3.axisLeft(yScaleFollowers));

    // Line for cumulative wins
    const lineWins = d3
      .line()
      .x((d) => xScaleWins(d.date))
      .y((d) => yScaleWins(d.cumulative_wins));

    svgWins
      .append("path")
      .datum(ufcData)
      .attr("fill", "none")
      .attr("stroke", "green")
      .attr("stroke-width", 2)
      .attr("d", lineWins);

    // Line for followers
    const lineFollowers = d3
      .line()
      .x((d) => xScaleFollowers(d.date))
      .y((d) => yScaleFollowers(d.followers_count));

    svgFollowers
      .append("path")
      .datum(followersData)
      .attr("fill", "none")
      .attr("stroke", "#E1306C") // Instagram pink/purple
      .attr("stroke-width", 2)
      .attr("d", lineFollowers);

    // Labels for cumulative wins
    svgWins
      .append("text")
      .attr("x", width / 2)
      .attr("y", height - 10)
      .attr("text-anchor", "middle")
      .text("Date");

    svgWins
      .append("text")
      .attr("x", -height / 2)
      .attr("y", 20)
      .attr("transform", "rotate(-90)")
      .attr("text-anchor", "middle")
      .text("Cumulative Wins");

    // Labels for followers
    svgFollowers
      .append("text")
      .attr("x", width / 2)
      .attr("y", height - 10)
      .attr("text-anchor", "middle")
      .text("Date");

    svgFollowers
      .append("text")
      .attr("x", -height / 2)
      .attr("y", 20)
      .attr("transform", "rotate(-90)")
      .attr("text-anchor", "middle")
      .text("Instagram Followers");
  };

  // Initial draw
  draw();

  // Resize listener
  window.addEventListener("resize", draw);
}

drawVis();
