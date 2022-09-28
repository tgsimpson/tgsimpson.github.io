
//===== MAP
var map = new ol.Map({
  target: 'map',
  layers:[new ol.layer.Tile({source: new ol.source.OSM()})],
  view: new ol.View({center: ol.proj.fromLonLat([-156.345,20.8]),zoom: 10.66}),
  })
const MapUp = document.getElementById('mapup');
const MapUpOverlay = new ol.Overlay({element: MapUp,positioning: 'bottom-center',stopEvent: false,});
map.addOverlay(MapUpOverlay);

const baseRadius = 3.4;

//set default visibility in AllData to zoom level 10
for (p=0;p<AllData.length;p++) AllData.visible = 10;

var PointList = []

function point2Style(i) {
  var m = PointList[i].marker;
  var s = new ol.style.Style({
       image: new ol.style.Circle({radius: m.circleRadius,
                                   fill: new ol.style.Fill({color: m.circleColor}),
                                   stroke: new ol.style.Stroke({color: m.borderColor,width: m.borderWidth,})}),
    });
  s.random = 32;
  return s
}

function AddAPoint(i) {
    PointList[i].marker = {}  // store color, size, etc.

    var clr = new ol.color.asArray([255,0,0,0.5]);
    var bor = new ol.color.asArray([150,150,150,1]);
    var rad = baseRadius;
    var bwd = 1;
    try{
      if (AllData[i].Status.visited) {clr = new ol.color.asArray([0,0,255,0.6]); rad = rad * 1.3}
      if ("Page" in AllData[i]) {clr = new ol.color.asArray([50,255,50,0.9]); bor = new ol.color.asArray([0,255,0,1.0]); rad = rad*1.35}
      if (AllData[i].Status.revisit) {bor = new ol.color.asArray([0,255,255,1.0]) ; bwd = 2}
      if (AllData[i].Status.planning) {clr = new ol.color.asArray([255,255,0,1.0]);bor = new ol.color.asArray([0,0,255,1.0]); rad = rad*1.1}
    }
    catch {}

    PointList[i].marker.circleColor = clr
    PointList[i].marker.circleRadius = rad
    PointList[i].marker.borderColor = bor
    PointList[i].marker.borderWidth = bwd
  


 //   const pointStyle = new ol.style.Style({
 //      image: new ol.style.Circle({radius: rad,fill: new ol.style.Fill({color: clr}),stroke: new ol.style.Stroke({color: bor,width: bwd,})}),
 //   });

    var p = new ol.Feature({geometry: new ol.geom.Point(ol.proj.transform([parseFloat(AllData[i].Lng), parseFloat(AllData[i].Lat)], 'EPSG:4326', 'EPSG:3857'))});

    p.setStyle([point2Style(i)]);
    MarkerLayer.getSource().addFeature(p);

    return (p);
}

var MarkerLayer = new ol.layer.Vector({source: new ol.source.Vector({features:[]}),});
map.addLayer(MarkerLayer)


map.on("click",function(evt) {
  var feature = map.forEachFeatureAtPixel(evt.pixel,function(feature){return feature})  //get first feature to match
  var match = PointList.findIndex(f => f.feature===feature);
  if (match <0 || AllData[match]==null) {MapUp.innerHTML = ""; return;}
//  console.log("And match is",match,AllData[match]);
  MapUpOverlay.setPosition(evt.coordinate)
  if (!PShow.setDIndex(match)) {MapUp.innerHTML = "<p>"+AllData[match].Name+"</p>";}
})

map.on("pointermove",function(evt){
  var feature = map.forEachFeatureAtPixel(evt.pixel,function(feature){return feature})  //get first feature to match
  var match = PointList.findIndex(f => f.feature===feature);
  if (match <0 || AllData[match]==null) {MapUp.innerHTML = ""; return;}
//  console.log("And match is",match,AllData[match]);
  MapUpOverlay.setPosition(evt.coordinate)
  MapUp.innerHTML = "<p>"+AllData[match].Name+"</p>";
})

map.getView().on('change:resolution', (event) => {
//    console.log("zoom changed",map.getView().getZoom());
    var z = map.getView().getZoom();
    // Zoom 10 - radius 3 to 5
    // Zoom 11 - 4 to 6
    // Zoom 12 - 5
    // Zoom 13 - 6

    // z = 11; current = 3  current+(z-10)
    // z = 13; current
    
    var f = MarkerLayer.getSource().getFeatures();

    for (i=0;i<f.length;i++) {
      var s = f[i].getStyle();
      console.log("and random is ",s[0].random)
      var g = s[0].getImage();
//      console.log(s,g,g.getRadius());
      var r = g.getRadius();
      var br = 10-baseRadius;

      // base case, using 3.... r should be about (z-7).
      // if r is bigger than that, then by what factor... bigger by r-(z-7)... lets say z is 10, normal is 3, r is 4 => 4-3 = 1/3 

      var m = 1+(r-(z-br))/(z-br);
      //console.log("r.m",r,m)
      // if originally 3, r is now bigger... r-3 is the diff
      g.setRadius(((z-br)*m));
    }
  
    // style.getImage().setRadius(r)
    //f.foreach((x,i)=>{console.log(x,i);})

    //f.foreach((x,i)=>{x.style.getImage.setRadius(z-7)})
});

//===== LOAD SPREADSHEET
document.addEventListener('DOMContentLoaded', init)
function init() {
   // for now, assume everything is a Beach
   for (var i=0, len = AllData.length; i<len; i++){
     PointList[i] = {}
     try {PointList[i].feature = AddAPoint(i)}
     catch (err) {console.log("issue with element",i,err)}
   }
   document.getElementById("selectBox").addEventListener("click", () => filterPoints());
}


function filterPoints() {
  console.log("Do your filtering magic here")
  alert("Search / Filter coming soon.")
}
 


