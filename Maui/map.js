
// Google maps api key:  AIzaSyDLlibEWsGms7qd_zmrSCZiNa-Ol61r99M

class MauiMap {

    constructor() {
      //===== MAP

      this.map = new google.maps.Map(document.getElementById("map"), 
          {
            zoom: 10,
            center: {lng: -156.345, lat: 20.8},
          });

      console.log("Created map?", this.map)

  //    this.searchBox = document.getElementById('searchBox'); this.searchBox.style.display = "none"; 

    }
 
 /*       
      //==== Configs
      this.baseRadius = 3;

      // Event handlers
      document.getElementById("selectBox").addEventListener("click", () => this.filterPoints());
      this.map.on("click",      function(evt) {var feature = this.eventSetUp(evt); if (feature) PShow.setDIndex(feature.dataIndex)}.bind(this))
      this.map.on("pointermove",function(evt) {this.eventSetUp(evt)}.bind(this))
      this.map.getView().on('change:resolution', (event) => {
          var zoom = this.map.getView().getZoom();   
          var features = this.MarkerLayer.getSource().getFeatures();
          var zscale = 1+(zoom-10)/2; if (zscale<1) zscale=1;

          for (var i=0;i<features.length;i++) {
            try { 
                  features[i].visibleStyle = new ol.style.Style({
                             image: new ol.style.Circle({radius: features[i].marker.circleRadius*features[i].marker.radiusScale*zscale,
                                                         fill: new ol.style.Fill({color: features[i].marker.circleColor}),
                                                         stroke: new ol.style.Stroke({color: features[i].marker.borderColor,width: features[i].marker.borderWidth,})}),
                          });
              //features[i].visibleStyle.getImage().setRadius(features[i].marker.circleRadius*features[i].marker.radiusScale*zscale);
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
    */

    AddAPoint(i) {
      var p = new google.maps.Marker({
        position: {lat: AllData[i].Lat, lng: AllData[i].Lng},
        map: this.map,
//        label: AllData[i].Name,
        title: AllData[i].Name,
        icon: {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 6,
                fillColor: "#F00",
                fillOpacity: 0.4,
                strokeWeight: 0.4
              },
      });

      p["dataIndex"] = i;

      console.log("Marker",p)

      p.addListener("click", () => {
        let d = AllData[p.dataIndex]
        console.log("clicked",p.getPosition(),d.Name)
        PShow.setDIndex(p.dataIndex)
      });


    }

/*
    //===== common event handling
    eventSetUp(evt) {
        var feature = this.map.forEachFeatureAtPixel(evt.pixel,function(feature){return feature})
        if (feature) {this.MapUp.innerHTML = "<p>"+AllData[feature.dataIndex].Name+"</p>"; 
                      this.MapUpOverlay.setPosition(evt.coordinate)}
        else {this.MapUp.innerHTML = "";};
        return feature
    }

    showSB(b) {if (b) {this.searchBox.style.display="block";} 
               else {this.searchBox.style.display = "none"}}

    filterPoints() {
  
        // tags
        var html = "<fieldset>"+
                     "<legend>Types:</legend>"
        for (var i=0;i<this.tags.length;i++) {
          html = html+
             "<div>"+
             "<input type='checkbox' id='"+this.tags[i]+"Tag'"+" name='"+this.tags[i]+"'>"+
             "<label for='"+this.tags[i]+"Tag'>"+this.tags[i]+"</label>"+
             "</div>"
        }
        html = html+"</fieldset>"
                // uncheck the boxes
        // for (var i=0;i<this.tags.length;i++) document.getElementById(this.tags[i]+"Tag").checked = false;


        // status
        html = html+"<fieldset>"+
                      "<legend>Status:</legend>"+
                      "<div><input type='checkbox' id='visitedStatus' name='visitedStatus'>"+
                      "<label for 'visitedStatus'>Visited</label>"+
                      "<div><input type='checkbox' id='invisitedStatus' name='invisitedStatus'>"+
                      "<label for 'invisitedStatus'>Not Visited</label>"+
                      "<div><input type='checkbox' id='planningStatus' name='planningStatus'>"+
                      "<label for 'planningStatus'>Planning</label>"+
                    "</fieldset>"+
                    "<br>"

        //generic search

        //
        html = html+"<br>"
        html = html+"<input type='submit' id='applySearch' value='Apply'>"


        this.searchBox.innerHTML=html+"<div id='closeSearch' class='hide'>&#10540;</div>";


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
*/
    //===== INITIALIZE

    init() {
       for (var i=0, len = AllData.length; i<len; i++){
         try {this.AddAPoint(i);}
         catch (err) {console.log("issue with element",i,err)}
       }
    }

}

function initMap() {
  var MM = new MauiMap(); MM.init();
}

//window.initMap = initMap


document.addEventListener('DOMContentLoaded', ()=>{var MM = new MauiMap(); MM.init()})





 


