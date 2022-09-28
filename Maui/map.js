
class MauiMap {

    constructor() {
      //===== MAP
      this.map = new ol.Map({
        target: 'map',
        layers:[new ol.layer.Tile({source: new ol.source.OSM()})],
        view: new ol.View({center: ol.proj.fromLonLat([-156.345,20.8]),zoom: 10.66}),
        })
      this.MapUp = document.getElementById('mapup')
      this.MapUpOverlay = new ol.Overlay({element: this.MapUp,positioning: 'bottom-center',stopEvent: false,});
      this.map.addOverlay(this.MapUpOverlay);
      this.MarkerLayer = new ol.layer.Vector({source: new ol.source.Vector({features:[]}),});
      this.map.addLayer(this.MarkerLayer)
      this.searchBox = document.getElementById('searchBox'); this.searchBox.style.display = "none"; 
        
      //==== Configs
      this.baseRadius = 3;

      // Event handlers
      document.getElementById("selectBox").addEventListener("click", () => this.filterPoints());
      this.map.on("click",      function(evt) {var feature = this.eventSetUp(evt); PShow.setDIndex(feature.dataIndex)}.bind(this))
      this.map.on("pointermove",function(evt) {this.eventSetUp(evt)}.bind(this))
      this.map.getView().on('change:resolution', (event) => {
          var zoom = this.map.getView().getZoom();   
          var features = this.MarkerLayer.getSource().getFeatures();
          var zscale = 1+(zoom-10)/3; if (zscale<1) zscale=1;

          for (var i=0;i<features.length;i++) {
            try { features[i].visibleStyle.getImage().setRadius(features[i].marker.circleRadius*features[i].marker.radiusScale*zscale);
                  if (features[i].visible) features[i].setStyle(features[i].visibleStyle)


              //var s = f[i].getStyle();
              //    var g = s.getImage();
               //   g.setRadius(f[i].marker.circleRadius*f[i].marker.radiusScale*zs);
                } catch {console.log("not today")}
          }
       })

       // tags
       this.tags = []
       for (var i=0;i<AllData.length;i++) {
            try { for (var j=0;j<AllData[i].Tags.length;j++) {
                     if (!(this.tags.includes(AllData[i].Tags[j]))) this.tags.push(AllData[i].Tags[j]) }
                } catch {}
        }

    }

    AddAPoint(i) {
        var feature = new ol.Feature({geometry: new ol.geom.Point(ol.proj.transform([parseFloat(AllData[i].Lng), parseFloat(AllData[i].Lat)], 'EPSG:4326', 'EPSG:3857'))});
        feature.marker = {}
        feature.dataIndex = i

        // defaults
        feature.marker.circleColor  = new ol.color.asArray([255,0,0,0.5]);
        feature.marker.borderColor  = new ol.color.asArray([0,0,0,1]);
        feature.marker.circleRadius = this.baseRadius;
        feature.marker.radiusScale  = 1;
        feature.marker.borderWidth  = 1;
        // customize
        try{
          if (AllData[i].Status.visited) {  // Spot we have visited
             feature.marker.circleColor = new ol.color.asArray([0,0,255,0.6]); 
             feature.marker.radiusScale = 1.4
           }
          if ("Page" in AllData[i]) { // Story on this node
             feature.marker.circleColor = new ol.color.asArray([50,255,50,0.9]); 
             //feature.marker.borderColor = new ol.color.asArray([0,255,0,1.0]); 
             feature.marker.radiusScale = 1.5
           }
          if (AllData[i].Status.revisit) { // been here, but want to revisit
             feature.marker.borderColor = new ol.color.asArray([50,50,50,1.0]) ; 
             feature.marker.borderWidth = 2
           }
          if (AllData[i].Status.planning) { // there's a plan for this one
             feature.marker.circleColor = new ol.color.asArray([255,255,0,1.0]);
             feature.marker.borderColor = new ol.color.asArray([0,0,255,1.0]); 
             feature.marker.radiusSclae = 1.25
           }
        }
        catch {}

        var style = new ol.style.Style({
           image: new ol.style.Circle({radius: feature.marker.circleRadius*feature.marker.radiusScale,
                                       fill: new ol.style.Fill({color: feature.marker.circleColor}),
                                       stroke: new ol.style.Stroke({color: feature.marker.borderColor,width: feature.marker.borderWidth,})}),
        });
        feature.setStyle(style);
        feature.visibleStyle = style;
        feature.visible = true;

        return (feature);
    }

    //===== common event handling
    eventSetUp(evt) {
        var feature = this.map.forEachFeatureAtPixel(evt.pixel,function(feature){return feature})
        if (feature) {this.MapUp.innerHTML = "<p>"+AllData[feature.dataIndex].Name+"</p>"; 
                      this.MapUpOverlay.setPosition(evt.coordinate)}
        else this.MapUp.innerHTML = "";
        return feature
    }

    showSB(b) {if (b) {this.searchBox.style.display="block";} 
               else {this.searchBox.style.display = "none"}}

    filterPoints() {
  
        var html = "<fieldset>"+
                     "<legend>Types:</legend>"
        for (var i=0;i<this.tags.length;i++) {
          html = html+
             "<div>"+
             "<input type='checkbox' id='"+this.tags[i]+"Tag'"+" name='"+this.tags[i]+"' checked>"+
             "<label for='"+this.tags[i]+"Tag'>"+this.tags[i]+"</label>"+
             "</div>"
        }
        html = html+"</fieldset>"
        html = html+"<input type='submit' id='applySearch' value='Apply'>"

        this.searchBox.innerHTML=html+"<div id='closeSearch' class='hide'>&#10540;</div>";

        // uncheck the boxes
        for (var i=0;i<this.tags.length;i++) document.getElementById(this.tags[i]+"Tag").checked = false;

        document.getElementById('closeSearch').addEventListener("click", function() {this.showSB(false)}.bind(this));
        document.getElementById('applySearch').addEventListener("click", function() {this.doSearch()}.bind(this));
        this.showSB(true);
    }

    doSearch() {
        this.showSB(false)
        var features = this.MarkerLayer.getSource().getFeatures();
// Filter on Features
        var filters = [];
        for (var i=0;i<this.tags.length;i++) {
          var box = document.getElementById(this.tags[i]+"Tag")
          if (box.checked) filters.push(box.name);
        }
        console.log("and our filter is",filters)

        for (var i=0;i<features.length;i++) {
          var intersect = filters.filter(x => AllData[features[i].dataIndex].Tags.includes(x))
          if (intersect.length > 0) {features[i].setStyle(features[i].visibleStyle); features[i].visible=true;}
          else {features[i].setStyle(new ol.style.Style({})); features[i].visible=false}
        }
    }

    //===== INITIALIZE

    init() {
       for (var i=0, len = AllData.length; i<len; i++){
         try {this.MarkerLayer.getSource().addFeature(this.AddAPoint(i));}
         catch (err) {console.log("issue with element",i,err)}
       }
    }

}

document.addEventListener('DOMContentLoaded', ()=>{var MM = new MauiMap(); MM.init()})





 


