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
      .scale({scheme: "category20"}), // make each genre a different color
      vl.tooltip().fieldQ("global_sales").aggregate("sum")
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
  .transform(
    vl.aggregate([
      {op: "sum", field: "global_sales", as: "total_global_sales"}
    ])
    .groupby(["year", "genre"])
  )
  .encode(
    vl.x().fieldN("year").title("Year").axis({format: "d"}), 
    vl.y().fieldQ("total_global_sales").title("Global Sales"), 
    vl.color().fieldN("genre").scale({scheme: "category20"}).title("Genre"), 
    vl.tooltip([
      vl.fieldN("year"), 
      vl.fieldN("genre"), 
      vl.fieldQ("total_global_sales")
    ])
  )

  .height(500)
  .toSpec();

  const view2a = await vegaEmbed("#a3-vis2a", vl2a).view
  // view2.run()

  // create the heat map
  const vl2b = vl
  .markRect()
  .data(data)
  .transform(
    vl.aggregate([
      {op: "sum", field: "sales_amount", as: "total_sales_amount"}
    ])
    .groupby(["year", "platform"])
  )
  .encode(
    vl.x().fieldN("year").title("Year").axis({format: "d"}), 
    vl.y().fieldN("platform").title("Platform"), 
    vl.color()
      .aggregate("sum").fieldQ("total_sales_amount")
      .scale({ scheme: 'blues' }) // set color scale to 'blues'
      .title("Total Sales (in millions)"), // title for the color legend
    vl.tooltip([
      vl.fieldN("year"), 
      vl.fieldN("genre"), 
      vl.fieldQ("total_sales_amount")
    ])
  )

  .height(500)
  .toSpec();

  const view2b = await vegaEmbed("#a3-vis2b", vl2b);

  const vl3 = vl
  .markBar()
  .data(data)
  .encode(
    vl.x().fieldN("platform").title("Platform"), // make the genre the x field
    vl.y().aggregate("sum").fieldQ("sales_amount").title("Sales"), // make the global sales the y field, aggregated to a sum
    vl.facet().fieldN("sales_region").title("Region"), // facet the graph by platform
    vl.color().fieldN("platform").scale({scheme: "category20"}), // make each genre a different color
    vl.tooltip().fieldQ("sales_amount").aggregate("sum")
  )
  .height(500)
  .toSpec();

  const view3 = await vegaEmbed("#a3-vis3", vl3);

  const vl4a = vl
  .markLine()
  .data(data)
  .transform(
    vl.filter('datum.sales_region === "jp_sales"')
  )
  .encode(
    vl.x().fieldQ("year").title("Years").axis({format: "d"}), 
    vl.y().aggregate("sum").fieldQ("sales_amount").title("Sales"), 
    vl.color()
      .fieldN("genre")
      .scale({range: ["#bbbbbb"]})
      .condition(
        { 
          test: 'datum.genre === "Role-Playing"',
          value: "red"
        }
      )
    .legend(null), 
    vl.opacity() 
      .condition(
        {
          test: 'datum.genre !== "Role-Playing"', 
          value: 0.5
        }
      )
  )
  .height(500)
  .width(1000)
  .toSpec();

  const view4a = await vegaEmbed("#a3-vis4a", vl4a);

  const vl4b = vl
  .markLine()
  .data(data)
  .transform(
    vl.filter('datum.sales_region === "jp_sales"')
  )
  .encode(
    vl.x().fieldQ("year").title("Years").axis({format: "d"}), 
    vl.y().aggregate("sum").fieldQ("sales_amount").title("Sales"), 
    vl.color()
    .fieldN("genre")
    .scale({range: ["#bbbbbb"]})
    .condition(
      { 
        test: 'datum.genre === "Misc"',
        value: "green"
      }
     )
    .legend(null), 
    vl.opacity() 
      .condition(
        {
          test: 'datum.genre !== "Misc"', 
          value: 0.5
        }
      )
  )
  .height(500)
  .width(1000)
  .toSpec();

  const view4b = await vegaEmbed("#a3-vis4b", vl4b);

  const vl4c = vl
  .markLine()
  .data(data)
  .transform(
    vl.filter('datum.sales_region === "jp_sales"')
  )
  .encode(
    vl.x().fieldQ("year").title("Years").axis({format: "d"}), 
    vl.y().aggregate("sum").fieldQ("sales_amount").title("Sales"), 
    vl.color()
    .fieldN("genre")
    .scale({range: ["#bbbbbb"]})
    .condition(
      { 
        test: 'datum.genre === "Action"',
        value: "blue"
      }
     )
    .legend(null), 
    vl.opacity() 
      .condition(
        {
          test: 'datum.genre !== "Action"', 
          value: 0.5
        }
      )
  )
  .height(500)
  .width(1000)
  .toSpec();

  const view4c = await vegaEmbed("#a3-vis4c", vl4c);
    
}

render();