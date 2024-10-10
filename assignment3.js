// Create and render the bar chart
// async function to load data from datasets/videogames_long.csv using d3.csv and then make visualizations
async function render() {
  // load data
  const data = await d3.csv("./datasets/videogames_long.csv");

  // create a bar chart
  const vl1 = vl
    .markBar()
    .data(data)
    .encode(
      vl.x().fieldN("genre").title("Genre"),
      vl.y().fieldQ("global_sales").aggregate("sum").title("Global Sales"), 
      vl.facet().fieldN("platform").title("Platform"), // facet the graph by platform
      vl.color().fieldN("genre")
      .scale({scheme: "category20"}) // make each genre a different color
    )
    // .width("container")
    // .width(1000)
    .height(500)
    .toSpec();

  const view1 = await vegaEmbed("#a3-vis1", vl1).view;
  // view1.run();

  // create an area graph
  const vl2a = vl
  .markArea()
  .data(data)
  .encode(
    vl.x().fieldN("year").title("Year").axis({format: "d"}), 
    vl.y().aggregate("sum").fieldQ("global_sales").title("Global Sales"), 
    vl.color().fieldN("genre").scale({scheme: "category20"}).title("Genre")
  )

  .height(500)
  .toSpec();

  const view2 = await vegaEmbed("#a3-vis2a", vl2a).view
  // view2.run()
    
}

render();