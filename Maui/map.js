
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

    var clr = new ol.color.asArray([255,0,0,0.66]);
    try{
      if (AllData[i].Status.visited) {clr = new ol.color.asArray([50,255,50,0.66])}
    }
    catch {}
    // figure out color based on something.
    const pointStyle = new ol.style.Style({
       image: new ol.style.Circle({radius: 7,fill: new ol.style.Fill({color: clr}),stroke: new ol.style.Stroke({color: 'white',width: 1,})}),
    });

    var p = new ol.Feature({geometry: new ol.geom.Point(ol.proj.transform([parseFloat(AllData[i].Lng), parseFloat(AllData[i].Lat)], 'EPSG:4326', 'EPSG:3857'))});
    p.setStyle([pointStyle]);
    MarkerLayer.getSource().addFeature(p);
    return (p);
}

//var IconStyle = new ol.style.Icon({
//      anchor: [0.5, 0.5],  anchorXUnits: "fraction",  anchorYUnits: "fraction",
//      src: "https://upload.wikimedia.org/wikipedia/commons/e/ec/RedDot.svg"   });
var MarkerLayer = new ol.layer.Vector({
  source: new ol.source.Vector({features:[]}),
  //style: new ol.style.Style({image: IconStyle})
  });
map.addLayer(MarkerLayer)


map.on("click",function(evt) {
  var feature = map.forEachFeatureAtPixel(evt.pixel,function(feature){return feature})  //get first feature to match
  var match = PointList.findIndex(f => f===feature);
  if (match <0 || AllData[match]==null) {console.log("No data for",match); MapUp.innerHTML = ""; return;}
  console.log("And match is",match,AllData[match]);
  MapUpOverlay.setPosition(evt.coordinate)
  if (!PShow.setDIndex(match)) {MapUp.innerHTML = "<p>"+AllData[match].Name+"</p>";}
})

//===== LOAD SPREADSHEET
document.addEventListener('DOMContentLoaded', init)
function init() {
   // for now, assume everything is a Beach
   for (var i=0, len = AllData.length; i<len; i++){
     try {PointList[i]=AddAPoint(i)}
     catch (err) {PointList[i]=null;console.log("issue with element",i,err)}
   }
}
 


