import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

async function drawVis() {

  const ufcDataset = [

    // {date: "2012-3-24", result: 1 },
    // {date: "2013-6-15", result: 1 },
    // {date: "2015-8-8", result: 1 },
    // {date: "2015-9-5", result: 1 },
    // {date: "2015-9-19", result: 1 },
    // {date: "2016-1-13", result: 1 },
    // {date: "2016-3-13", result: 1 },
    // {date: "2016-5-7", result: 1 },
    // {date: "2016-5-28", result: 1 },
    {date: "2017-7-28", result: 1 },
    {date: "2017-11-24", result: 1 },
    {date: "2018-2-11", result: 1 },
    {date: "2018-4-14", result: 1 },
    {date: "2018-7-6", result: 1 },
    {date: "2018-11-3", result: 1 },
    {date: "2019-2-10", result: 1 },
    {date: "2019-4-13", result: 1 },
    {date: "2019-10-6", result: 1 },
    {date: "2020-3-7", result: 1 },
    {date: "2020-9-27", result: 1 },
    {date: "2021-3-6", result: 0 },
    {date: "2021-6-12", result: 1 },
    {date: "2022-2-12", result: 1 },
    {date: "2022-7-2", result: 1 },

  ];

  const followersDataset = await d3.csv("./datasets/stylebender-historical-stats.csv", d3.autoType);

  

}

drawVis();