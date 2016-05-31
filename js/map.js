$(function(){

  var width = 800;
  var height = 600;

  var projection = d3.geo.albers().rotate([0, 0])
      .center([8.8, 47]) // Long Lat
      .scale(14000); // Zoom

// Use projection to show the swiss map
  var path = d3.geo.path().projection(projection);

  var svg = d3.select(".swiss_map").append("svg")
      .attr("width", width)
      .attr("height", height);

  var tooltip = d3.select("body")
      .append("div")
      .attr("id", "tooltip");

// Load data
  d3.json("/data/switzerland.json", function(error, topology) {
    if (error) throw error;

    // Add the svg to our website
    svg.selectAll("path")
        .data(topojson.feature(topology, topology.objects.cantons).features)
        .enter().append("path")
        .attr("class", "canton")


        .on("mouseover", function (d) {

          var canton = d.properties.abbr;
          nr_cantons = dataset.cantons[canton]['artists'].length;

          tooltip.text(d.properties.name +" (Artists: " +nr_cantons +")");
          tooltip.style("visibility", "visible");
        })

        .on("mousemove", function (d) {
          tooltip.style("top", (event.pageY ) + "px").style("left", (event.pageX + 10) + "px");
        })
        .on("mouseout", function (d) {
          tooltip.style("visibility", "hidden");
        })

        .on("mousedown", function (d) {
          svg.selectAll("path").attr("class", "canton");
          // Set selected canton
          svg.selectAll("path").filter(function(p){
            return d.properties.abbr == p.properties.abbr;
          }).attr("class", "active_canton");

          var canton = d.properties.abbr;
          var artistsElem = $('#artists');
          var limit = 10;
          artistsElem.empty();

          $('#detail_name').text(d.properties.name );
          showInfo(canton);
        })
        .attr("d", path);

    // Set Zurich as default loaded canton
    svg.select("path").attr("class", "active_canton");
    $('#detail_name').text("Zürich" );
    showInfo('ZH');
  });


  function showInfo(canton){
    var ctx = $("#barChart");
    ctx.empty();
    var data = {
      labels: ["Künstler", "Ausstellungen"],
      datasets: [
        {
          label: canton,
          backgroundColor: "rgba(222, 22, 119,0.4)",
          borderColor: "rgba(188,0,95,1)",
          borderWidth: 1,
          hoverBackgroundColor: "rgba(255,99,132,0.4)",
          hoverBorderColor: "rgba(255,99,132,1)",
          data: [dataset.cantons[canton]['artists'].length, dataset.cantons[canton]['exhibitions'].length],
        }
      ]
    };

    var barChart = new Chart(ctx, {
      type: 'bar',
      data: data,
      options: {
        scales: {
          xAxes: [{
            stacked: true
          }],
          yAxes: [{
            stacked: true
          }]
        }
      }
    });

    barChart.clear();


  }
});