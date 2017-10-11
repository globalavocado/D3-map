// set up map

var width = window.innerWidth, 
  height = window.innerHeight;

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
  .await(renderLayers);

  function renderLayers(error, it_comuni, it_regioni, data) {
      if(error) {
        console.log(error);
      };

      var subunits_com = topojson.feature(it_comuni, it_comuni.objects.italia);
      var subunits_reg = topojson.feature(it_regioni, it_regioni.objects.italia);

      // add communes

      svg.append("path")
        .datum(subunits_com)
        .attr("class", "comuni")
        .attr("d", path);

      // add regions
      
      svg.append("path")
        .datum(subunits_reg)
        .attr("class", "regioni")
        .attr("d", path);

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