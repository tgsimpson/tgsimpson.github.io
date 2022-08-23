
// if SERVER, use spreadseet; otherwise fake data (to get around CORS)
var SERVER = true;
if (location.origin === "file://") {SERVER = false}
var fakeData = {Wf:[{c:[{v:"haha"},0,0,{v:20.8},{v:-156.4},{v:"https://photos.app.goo.gl/Er1Aasnjo215irwQA"}]}],
                bf:[{label:"Name"},{label:"Been to?"},{label:"Lat/Lng"},{label:"Lat"},{label:"Lng"},{label:"Pics"}]}

//===== MAP
var map = new ol.Map({
   target: 'map',
   layers:[new ol.layer.Tile({source: new ol.source.OSM()}),],
   view: new ol.View({center: ol.proj.fromLonLat([-156.4,20.8]),zoom: 10})
});

const MapUp = document.getElementById('mapup');

const MapUpOverlay = new ol.Overlay({
  element: MapUp,
  positioning: 'bottom-center',
  stopEvent: false,
});
map.addOverlay(MapUpOverlay);

var PointList = []
//function AddPoint(layer, lat, lng) {
//    var newPoint = new ol.Feature({geometry: new ol.geom.Point(ol.proj.transform([parseFloat(lng), parseFloat(lat)], 'EPSG:4326', 'EPSG:3857'))});
//    MarkerLayer.getSource().addFeature(newPoint);
//    PointList.push(newPoint)
//}
function AddPoint(data,index) {
    var lat = Label2v(data,index,"Lat");
    var lng = Label2v(data,index,"Lng");
    var newPoint = new ol.Feature({geometry: new ol.geom.Point(ol.proj.transform([parseFloat(lng), parseFloat(lat)], 'EPSG:4326', 'EPSG:3857'))});
    MarkerLayer.getSource().addFeature(newPoint);

    var point = {marker:newPoint,name:Label2v(data,index,"Name"),pics:Label2v(data,index,"Pics")}
    PointList.push(point)
//    console.log(PointList)
}

var IconStyle = new ol.style.Icon({
      anchor: [0.5, 0.5],  anchorXUnits: "fraction",  anchorYUnits: "fraction",
      src: "https://upload.wikimedia.org/wikipedia/commons/e/ec/RedDot.svg"   });
var MarkerLayer = new ol.layer.Vector({source: new ol.source.Vector({features:[]}),style: new ol.style.Style({image: IconStyle})});
map.addLayer(MarkerLayer)


map.on("click",function(evt) {
  var feature = map.forEachFeatureAtPixel(evt.pixel,function(feature){return feature})  //get first feature to match
  var match = PointList.findIndex(f => f.marker===feature);
  if (match <0) {MapUp.innerHTML = ""; return;}
  console.log("And match is",match,PointList[match].name,evt.coordinate);
  MapUpOverlay.setPosition(evt.coordinate)
  MapUp.innerHTML = "<p>"+PointList[match].name+"</p><img src="+PointList[match].pics+">"  
})


//===== LOAD SPREADSHEET
document.addEventListener('DOMContentLoaded', init)
 
function init() {
  if (SERVER) {
      google.charts.load('current', {'packages':['corechart']});
      google.charts.setOnLoadCallback(init2);
      return;
    }
  handleSSData(fakeData)
}

function init2() {
     var queryString = encodeURIComponent('SELECT *');
     var query = new google.visualization.Query(
       'https://docs.google.com/spreadsheets/d/1Gpi7Xzp1FaHeNFsyAli3iVcG4GOq3Aa4MCng9FoudIM/gviz/tq?sheet=Beaches&headers=1&tq=' + queryString);
     query.send(handleSSData);
     console.log("Sent query")
    }

function Label2v(data,index,name) {try{return data.Wf[index].c[data.bf.findIndex(e=>e.label==name)].v;} catch {return null;}}

function handleSSData(response) {
     if (SERVER) {
       if (response.isError()) {alert('Error in query: ' + response.getMessage() + ' ' + response.getDetailedMessage()); return;}
       data = response.getDataTable();
     }
     else {data = response;}
     console.log("data is",data)

     // Parse markers data
     for (var i = 0, len = data.Wf.length; i < len; i++) {
         try        {AddPoint(data,i)}
         catch(err) {console.log("ERROR element ",i,err)}
      }
}

//===== do something usefull

