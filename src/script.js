let jsonObject = {};
let h = 600;
let w = 1200;
let padding = 100;

document.addEventListener('DOMContentLoaded', function() {
  fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json')
    .then(response => response.json())
    .then(data => {
    jsonObject = data;
    showGraph();
  })
});

function showGraph() {
  let allYears = jsonObject.map(element => element["Year"]);
  let allTimes = jsonObject.map(element => element["Time"]);
  allTimes.forEach(function(d, i) {
    parsedTime = d.split(":");
    allTimes[i] = new Date(1990, 0, 1, 0, parsedTime[0], parsedTime[1]);
  });
  let timeFormat = d3.timeFormat("%M:%S");
  
  let xScale = d3.scaleLinear().domain([d3.min(allYears) - 1, d3.max(allYears) + 1]).range([padding, w - padding]);
  let yScale = d3.scaleTime().domain([d3.min(allTimes), d3.max(allTimes)]).range([h-padding, padding]);
  
  let xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));
  let yAxis = d3.axisLeft(yScale).tickFormat(timeFormat);
  
  let tooltip = d3.select("body")
    .append("div")
    .attr("id", "tooltip")
    .attr("class", "tooltip")
    .style("opacity", 0);
  
  let svg = d3.select("body")
    .append("svg")
    .attr("width", w)
    .attr("height", h);
  
  svg.selectAll("circle")
    .data(jsonObject)
    .enter()
    .append("circle")
    .attr("class", "dot")
    .attr("data-xvalue", (d, i) => allYears[i])
    .attr("data-yvalue", (d, i) => allTimes[i])
    .attr("r", 7)
    .attr("cx", (d, i) => xScale(allYears[i]))
    .attr("cy", (d, i) => yScale(allTimes[i]))
    .style("fill", (d) => {return d.Doping !=="" ? "DarkBlue" : "orange"})
    .on("mouseover", function(event, d) {
    tooltip
      .transition()
      .duration(200)
      .style("opacity", 0.9);
    tooltip
      .html(d.Name + ": " + d.Nationality + "</br>Year: " + d.Year + ", Time: " + d.Time + "</br></br>" + d.Doping)
      .style("left", event.pageX + 20 + "px")
      .style("top", event.pageY - 40 + "px");
    tooltip.attr("data-year", d.Year);
  })
  .on("mouseout", function(event, d) {
    tooltip
      .transition()
      .duration(400)
      .style("opacity", 0);
  });
  
  svg.append("g")
    .attr("id", "x-axis")
    .attr("transform", "translate(0," + (h - padding) + ")")
    .call(xAxis);
  svg.append("g")
    .attr("id", "y-axis")
    .attr("transform", "translate(" + padding + ", 0)")
    .call(yAxis);
  
    svg.append("text")
    .attr("id", "title")
    .attr("x", w / 2)
    .attr("y", 32)
    .attr("text-anchor", "middle")
    .style("font-size", 32)
    .style("font-weight", "bold")
    .text("United States GDP");
  
  svg.append("text")
    .attr("id", "title")
    .attr("x", w / 2)
    .attr("y", 60)
    .attr("text-anchor", "middle")
    .style("font-size", 24)
    .style("font-weight", "bold")
    .text("35 Fastest times up Alpe d'Huez");
  
  let legendContainer = svg.append("g").attr("id", "legend");
  let legend = legendContainer.selectAll("#legend")
    .data(["DarkBlue", "Orange"])
    .enter()
    .append("g")
    .attr("class", "legend-label")
    .attr("transform", (d, i) => {
      return "translate (0," + (h / 2 - i * 20) + ")";
    });
  legend.append("rect")
    .attr("x", w - 18)
    .attr("width", 18)
    .attr("height", 18)
    .style("fill", (d) => d);
  legend.append("text")
    .attr("x", w - 24)
    .attr("y", 9)
    .attr("dy", ".35em")
    .attr("text-anchor", "end")
    .text((d) => {
    if(d == "orange") {
      return "No doping allegations";
    }
    else {
      return "Riders with doping allegations";
    }
  })
}