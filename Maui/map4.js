
//===== MAP
var map = new ol.Map({
  target: 'map',
  layers:[new ol.layer.Tile({source: new ol.source.OSM()})],
  view: new ol.View({center: ol.proj.fromLonLat([-156.4,20.8]),zoom: 10}),
  })
const MapUp = document.getElementById('mapup');
const MapUpOverlay = new ol.Overlay({element: MapUp,positioning: 'bottom-center',stopEvent: false,});
map.addOverlay(MapUpOverlay);

var PointList = []
function AddAPoint(i) {
    var clr = new ol.color.asArray([255,0,0,0.5]);
    var bor = new ol.color.asArray([150,150,150,1]);
    var rad = 4;
    var bwd = 1;
    try{
      if (AllData[i].Status.visited) {clr = new ol.color.asArray([0,0,255,0.6]); rad = rad * 1.3}
      if ("Page" in AllData[i]) {clr = new ol.color.asArray([50,255,50,0.9]); bor = new ol.color.asArray([0,255,0,1.0]); rad = rad*1.35}
      if (AllData[i].Status.revisit) {bor = new ol.color.asArray([0,255,255,1.0]) ; bwd = 2}
      if (AllData[i].Status.planning) {clr = new ol.color.asArray([255,255,0,1.0]);bor = new ol.color.asArray([0,0,255,1.0]); rad = rad*1.1}
    }
    catch {}


//    const pointStyle = new ol.style.Style({
//      image: new ol.style.Circle({radius: 5,fill: new ol.style.Fill({color: 'orange',}),}),
//      geometry: function (feature) {return new ol.geom.MultiPoint([[[-5e6, 6e6], [-5e6, 8e6], [-3e6, 8e6],[-3e6, 6e6], [-5e6, 6e6]]]);},
//    });
    // experiments
//const pS2 = new ol.style.Style({
//  image: new ol.style.Icon({
//    anchor: [0, 0],
//    src: './Maui/Data/icons/beach.png',
//    size: [12,12],
//  })
//});

    // figure out color based on something.
    const pointStyle = new ol.style.Style({
       image: new ol.style.Circle({radius: rad,fill: new ol.style.Fill({color: clr}),stroke: new ol.style.Stroke({color: bor,width: bwd,})}),
 //      geometry: function (feature) {return new ol.geom.MultiPoint([[[-5e6, 6e6], [-5e6, 8e6], [-3e6, 8e6],[-3e6, 6e6], [-5e6, 6e6]]]);},
    });

    var p = new ol.Feature({geometry: new ol.geom.Point(ol.proj.transform([parseFloat(AllData[i].Lng), parseFloat(AllData[i].Lat)], 'EPSG:4326', 'EPSG:3857'))});
    p.setStyle([pointStyle]);
//    p.setStyle([pS2]);
    MarkerLayer.getSource().addFeature(p);
    return (p);
}

var MarkerLayer = new ol.layer.Vector({source: new ol.source.Vector({features:[]}),});
map.addLayer(MarkerLayer)


map.on("click",function(evt) {
  var feature = map.forEachFeatureAtPixel(evt.pixel,function(feature){return feature})  //get first feature to match
  var match = PointList.findIndex(f => f===feature);
  if (match <0 || AllData[match]==null) {console.log("No data for",match); MapUp.innerHTML = ""; return;}
  console.log("And match is",match,AllData[match]);
  MapUpOverlay.setPosition(evt.coordinate)
  if (!PShow.setDIndex(match)) {MapUp.innerHTML = "<p>"+AllData[match].Name+"</p>";}
})

map.getView().on('change:resolution', (event) => {
    console.log("zoom changed",map.getView().getZoom());
});

//===== LOAD SPREADSHEET
document.addEventListener('DOMContentLoaded', init)
function init() {
   // for now, assume everything is a Beach
   for (var i=0, len = AllData.length; i<len; i++){
     try {PointList[i]=AddAPoint(i)}
     catch (err) {PointList[i]=null;console.log("issue with element",i,err)}
   }
   document.getElementById("selectBox").addEventListener("click", () => filterPoints());
}

function filterPoints() {
  console.log("Do your filtering magic here")
  alert("Search / Filter coming soon.")
}
 


