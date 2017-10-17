// set up map

var width = window.innerWidth, 
  height = window.innerHeight;

var color_domain = [500, 1000, 5000, 10000, 50000, 100000, 100000, 500000, 1000000]
var ext_color_domain = [0, 500, 1000, 5000, 10000, 50000, 100000, 250000, 500000, 1000000] 
var legend_labels = ["< 500", "500 +", "1 000 +", "5 000 +", "10 000 +", "50 000 +", "100 000 +", "250 000 +", "500 000 +", "> 1 000 000"] 

var color = d3.scaleThreshold() 
    .domain(color_domain) 
    .range(d3.schemeBlues[9]);

var projection = d3.geoAlbers()
  .center([0, 41])
  .rotate([347, 0])
  .parallels([35, 45])
  .scale(3000)
  .translate([width / 2, height / 2]);

var svg = d3.select("#map").append("svg")
    .attr("width", width)
    .attr("height", height);

var path = d3.geoPath()
    .projection(projection);

// append both map layers 

d3.queue()
  .defer(d3.json, "it_comuni.json")
  .defer(d3.json, "it_regioni.json")
  .defer(d3.csv, "comuni2016.csv")
  .await(renderLayers);

  function renderLayers(error, it_comuni, it_regioni, data) {
      if(error) {
        console.log(error);
      };

      var subunits_com = topojson.feature(it_comuni, it_comuni.objects.italia).features;
      var subunits_reg = topojson.feature(it_regioni, it_regioni.objects.italia);
      var rateByCode = {};

      // add data

      data.forEach(function(d) {
                rateByCode[d.ISTAT] = +d.PopResidente; 
              });

      // add communes

      svg.append("g") 
      .attr("class", "comuni") 
      .selectAll("path") 
      .data(subunits_com)
      .enter().append("path")
      .attr("d", path)
      .style("fill", function(d) {
          return color(rateByCode[d.properties.PRO_COM]); 
        })
      .style("opacity", 0.8)

      // add regions
      
      svg.append("path")
        .attr("class", "regioni")
        .datum(subunits_reg)
        .attr("d", path);

      // add a legend

      var legend = svg.selectAll("g.legend") 
      .data(ext_color_domain) 
      .enter().append("g") 
      .attr("class", "legend"); 

      var ls_w = 20, ls_h = 20; 

      legend.append("rect") 
      .attr("x", 20) 
      .attr("y", function(d, i){ 
          return height - (i*ls_h) - 2*ls_h;
        }) 
      .attr("width", ls_w) 
      .attr("height", ls_h) 
      .style("fill", function(d, i) { 
        return color(d); 
        }) 
      .style("opacity", 0.8); 

      legend.append("text") 
      .attr("x", 50) 
      .attr("y", function(d, i){ 
          return height - (i*ls_h) - ls_h - 4;
        }) 
      .text(function(d, i){ 
          return legend_labels[i]; 
        });

      // implement map layer toggle button

      $("#select #toggle").click(function(){
        if ($(this).attr("data") == "showing"){
          $(".regioni").fadeOut();
          $(this).text("mostra regioni");
          $(this).attr("data", "hiding");
        } else {
          $(".regioni").fadeIn();
          $(this).text("nasconde regioni");
          $(this).attr("data", "showing");
        }
      });

  }