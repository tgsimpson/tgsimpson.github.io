var map = new ol.Map({
   target: 'map',
   layers:[
            new ol.layer.Tile({
              source: new ol.source.OSM()
            }),
          ],
   view: new ol.View({
          center: ol.proj.fromLonLat([-156.4,20.8]),
          zoom: 10
         })
});


document.addEventListener('DOMContentLoaded', init)
 
function init() {
      google.charts.load('current', {'packages':['corechart']});
      google.charts.setOnLoadCallback(init2);
    }

function init2() {
      var queryString = encodeURIComponent('SELECT *');
      console.log("YYYY")
      // var sheetstring = "https://docs.google.com/spreadsheets/d/1Gpi7Xzp1FaHeNFsyAli3iVcG4GOq3Aa4MCng9FoudIM/edit?usp=sharing"
      var query = new google.visualization.Query(
       'https://docs.google.com/spreadsheets/d/1Gpi7Xzp1FaHeNFsyAli3iVcG4GOq3Aa4MCng9FoudIM/gviz/tq?sheet=Beaches&headers=1&tq=' + queryString);
      // 'https://docs.google.com/spreadsheets/d/1qOAQSGMsyhO8zXUGx1htaqrpDPAQldibMdZpNegMaWg/gviz/tq?sheet=Sheet1&headers=2&tq=' + queryString);
        console.log("WWWW")
      query.send(handleSSData);
    }

function add_map_point(lat, lng) {
      console.log("Adding point with lat",lat," and long",lng);
      var vectorLayer = new ol.layer.Vector({
        source:new ol.source.Vector({
          features: [new ol.Feature({
                geometry: new ol.geom.Point(ol.proj.transform([parseFloat(lng), parseFloat(lat)], 'EPSG:4326', 'EPSG:3857')),
            })]
        }),
        style: new ol.style.Style({
          image: new ol.style.Icon({
            anchor: [0.5, 0.5],
            anchorXUnits: "fraction",
            anchorYUnits: "fraction",
            src: "https://upload.wikimedia.org/wikipedia/commons/e/ec/RedDot.svg"
          })
        })
      });

      vectorLayer.features[0].on(ʻsingleclickʻ,function(e) {console.log("CLICKKKKK")});
      map.addLayer(vectorLayer); 
    }

function handleSSData(response) {
     if (response.isError()) {
        alert('Error in query: ' + response.getMessage() + ' ' + response.getDetailedMessage());
        return;
      }

      data = response.getDataTable();
      console.log("AND WE HAVE:",data);
      add_map_point(20.8,-156.4);
}