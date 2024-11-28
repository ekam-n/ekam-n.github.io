import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

async function drawVis() {
  const ufcData = await d3.csv("../datasets/ufc_dataset_with_cumulative_wins.csv", d3.autoType);
  const followersData = await d3.csv("../datasets/filtered_followers_dataset.csv", d3.autoType);

  const container = d3.select("#izzy");

  // Initial dimensions
  let width = container.node().getBoundingClientRect().width;
  let height = width * 0.5;
  const margin = { top: 50, right: 100, bottom: 50, left: 100 };

  // Create scales
  const xScale = d3.scaleTime();
  const yScaleLeft = d3.scaleLinear();
  const yScaleRight = d3.scaleLinear();

  const svg = container
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .classed("bg-gray-100", true);

  const draw = () => {
    // Update dimensions
    width = container.node().getBoundingClientRect().width;
    height = width * 0.5;

    // Update scales
    xScale.domain(d3.extent(ufcData, (d) => d.date)).range([margin.left, width - margin.right]);
    yScaleLeft.domain([9, d3.max(ufcData, (d) => d.cumulative_wins)]).range([height - margin.bottom, margin.top]);
    yScaleRight.domain([0, d3.max(followersData, (d) => d.followers_count)]).range([height - margin.bottom, margin.top]);

    // Update SVG size
    svg.attr("width", width).attr("height", height);

    // Clear existing elements
    svg.selectAll("*").remove();

    // Axes
    svg
      .append("g")
      .attr("transform", `translate(0, ${height - margin.bottom})`)
      .call(d3.axisBottom(xScale).tickFormat(d3.timeFormat("%b %Y")));

    svg
      .append("g")
      .attr("transform", `translate(${margin.left}, 0)`)
      .call(d3.axisLeft(yScaleLeft));

    svg
      .append("g")
      .attr("transform", `translate(${width - margin.right}, 0)`)
      .call(d3.axisRight(yScaleRight));

    // Line for cumulative wins
    const lineWins = d3
      .line()
      .x((d) => xScale(d.date))
      .y((d) => yScaleLeft(d.cumulative_wins));

    svg
      .append("path")
      .datum(ufcData)
      .attr("fill", "none")
      .attr("stroke", "green")
      .attr("stroke-width", 2)
      .attr("d", lineWins);

    // Line for followers
    const lineFollowers = d3
      .line()
      .x((d) => xScale(d.date))
      .y((d) => yScaleRight(d.followers_count));

    svg
      .append("path")
      .datum(followersData)
      .attr("fill", "none")
      .attr("stroke", "#E1306C") // Instagram pink/purple
      .attr("stroke-width", 2)
      .attr("d", lineFollowers);

    // Labels
    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", height - 10)
      .attr("text-anchor", "middle")
      .text("Date");

    svg
      .append("text")
      .attr("x", -height / 2)
      .attr("y", 20)
      .attr("transform", "rotate(-90)")
      .attr("text-anchor", "middle")
      .text("Cumulative Wins");

    svg
      .append("text")
      .attr("x", width - 100)
      .attr("y", margin.top - 10)
      .attr("text-anchor", "middle")
      .text("Instagram Followers")
      .attr("fill", "#E1306C"); // Instagram pink/purple
  };

  // Initial draw
  draw();

  // Resize listener
  window.addEventListener("resize", draw);
}

drawVis();
