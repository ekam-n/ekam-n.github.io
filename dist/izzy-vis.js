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

    const maxFollowers = d3.max(followersData, (d) => d.followers_count);
    const yScaleFollowers = d3
      .scaleLinear()
      .domain([0, Math.ceil(maxFollowers / 1e6) * 1e6]) // Ensure the domain covers up to the nearest million
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

    // Add horizontal y-axis label above y-axis
    svgWins
      .append("text")
      .attr("x", margin.left - 32)
      .attr("y", margin.top - 20) // Positioned above the y-axis
      .attr("text-anchor", "start")
      .attr("font-size", "1.2em")
      .attr("fill", "black")
      .text("Cumulative Wins");

    // Axes for followers
    svgFollowers
      .append("g")
      .attr("transform", `translate(0, ${height - margin.bottom})`)
      .call(d3.axisBottom(xScaleFollowers).tickFormat(d3.timeFormat("%b %Y")));

    svgFollowers
      .append("g")
      .attr("transform", `translate(${margin.left}, 0)`)
      .call(
        d3.axisLeft(yScaleFollowers)
          .tickValues(d3.range(0, Math.ceil(maxFollowers / 1e6) + 1).map((d) => d * 1e6)) // Generate ticks for millions
          .tickFormat((d) => d / 1e6) // Format tick labels as millions
      );

    // Add horizontal y-axis label above y-axis
    svgFollowers
      .append("text")
      .attr("x", margin.left - 32)
      .attr("y", margin.top - 20) // Positioned above the y-axis
      .attr("text-anchor", "start")
      .attr("font-size", "1.2em")
      .attr("fill", "black")
      .text("Instagram Followers (Millions)");

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

    // Add dot annotation for March 4, 2017
    const annotationDate = new Date(2017, 2, 4); // March 4, 2017 (month is 0-indexed)

      console.log("hi");
      svgWins
        .append("circle")
        .attr("cx", xScaleWins(annotationDate))
        .attr("cy", yScaleWins(9.6))
        .attr("r", 6)
        .attr("fill", "black")
        .attr("stroke", "black")
        .attr("stroke-width", 2);

      svgWins
        .append("text")
        .attr("x", xScaleWins(annotationDate))
        .attr("y", yScaleWins(9.6) + 30) // Slightly below the dot
        .attr("text-anchor", "start")
        .attr("font-size", "12px")
        .attr("fill", "black")
        .selectAll("tspan")
        .data(["Izzy's last kickboxing match,", "a KO-loss to Pereira"]) // Split the text into two lines
        .enter()
        .append("tspan")
        .attr("x", xScaleWins(annotationDate)) // Same x position for both lines
        .attr("dy", (d, i) => i === 0 ? "0em" : "1.2em") // First line stays in position, second line moves down
        .text(d => d);

  };

  // Initial draw
  draw();

  // Resize listener
  window.addEventListener("resize", draw);
}

drawVis();
