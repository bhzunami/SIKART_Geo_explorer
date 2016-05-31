var dataset;
$(function(){ 
  function loadingFinished(){
      console.log('finished loading Ausstellungen/persons');
  }

  function loadData(){
    var artists = new Map();
    var ausstellungen = new Set();
    $.getJSON("data/data.json", function(json) {
      dataset = json;
    });
  }
  
  loadData();
});