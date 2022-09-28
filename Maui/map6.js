


//===== MAP
var map = new ol.Map({
  target: 'map',
  layers:[new ol.layer.Tile({source: new ol.source.OSM()})],
  view: new ol.View({center: ol.proj.fromLonLat([-156.345,20.8]),zoom: 10.66}),
  })
const MapUp = document.getElementById('mapup')
const MapUpOverlay = new ol.Overlay({element: MapUp,positioning: 'bottom-center',stopEvent: false,});
map.addOverlay(MapUpOverlay);
const MarkerLayer = new ol.layer.Vector({source: new ol.source.Vector({features:[]}),});
map.addLayer(MarkerLayer)
  
//===== Markers
const baseRadius = 3.4;
function AddAPoint(i) {
    var feature = new ol.Feature({geometry: new ol.geom.Point(ol.proj.transform([parseFloat(AllData[i].Lng), parseFloat(AllData[i].Lat)], 'EPSG:4326', 'EPSG:3857'))});
    feature.marker = {}
    feature.dataIndex = i

    // defaults
    feature.marker.circleColor  = new ol.color.asArray([255,0,0,0.5]);
    feature.marker.borderColor  = new ol.color.asArray([150,150,150,1]);
    feature.marker.circleRadius = baseRadius;
    feature.marker.radiusScale  = 1;
    feature.marker.borderWidth  = 1;
    // customize
    try{
      if (AllData[i].Status.visited) {  // Spot we have visited
         feature.marker.circleColor = new ol.color.asArray([0,0,255,0.6]); 
         feature.marker.radiusScale = 1.3
       }
      if ("Page" in AllData[i]) { // Story on this node
         feature.marker.circleColor = new ol.color.asArray([50,255,50,0.9]); 
         feature.marker.borderColor = new ol.color.asArray([0,255,0,1.0]); 
         feature.marker.radiusScale = 1.35
       }
      if (AllData[i].Status.revisit) { // been here, but want to revisit
         feature.marker.borderColor = new ol.color.asArray([0,255,255,1.0]) ; 
         feature.marker.borderWidth = 2
       }
      if (AllData[i].Status.planning) { // there's a plan for this one
         feature.marker.circleColor = new ol.color.asArray([255,255,0,1.0]);
         feature.marker.borderColor = new ol.color.asArray([0,0,255,1.0]); 
         feature.marker.radiusSclae = 1.1
       }
    }
    catch {feature.dataIndex = -1}

    var style = new ol.style.Style({
       image: new ol.style.Circle({radius: feature.marker.circleRadius*feature.marker.radiusScale,
                                   fill: new ol.style.Fill({color: feature.marker.circleColor}),
                                   stroke: new ol.style.Stroke({color: feature.marker.borderColor,width: feature.marker.borderWidth,})}),
    });
    feature.setStyle(style);
    return (feature);
}

//===== EVENTS
function eventSetUp(evt) {
    var feature = map.forEachFeatureAtPixel(evt.pixel,function(feature){return feature})
    if (feature) {MapUp.innerHTML = "<p>"+AllData[feature.dataIndex].Name+"</p>"; MapUpOverlay.setPosition(evt.coordinate) }
    else MapUp.innerHTML = "";
    return feature
}

map.on("click",      function(evt) {var feature = eventSetUp(evt); PShow.setDIndex(feature.dataIndex)})
map.on("pointermove",function(evt) {eventSetUp(evt)})

map.getView().on('change:resolution', (event) => {
    var z = map.getView().getZoom();   
    var f = MarkerLayer.getSource().getFeatures();
    for (i=0;i<f.length;i++) {
      var s = f[i].getStyle();
      var g = s[0].getImage();
      var zs = 10-z;
      g.setRadius(f.marker.circleRadius*f.marker.radiusScale*zs);
    }
});

function filterPoints() {
  console.log("Do your filtering magic here")
  alert("Search / Filter coming soon.")
}

//===== INITIALIZE
document.addEventListener('DOMContentLoaded', init)
function init() {
   for (var i=0, len = AllData.length; i<len; i++){
     try {MarkerLayer.getSource().addFeature(AddAPoint(i));}
     catch (err) {console.log("issue with element",i,err)}
   }
   document.getElementById("selectBox").addEventListener("click", () => filterPoints());
}


 


