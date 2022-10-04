
// Google maps api key:  AIzaSyDLlibEWsGms7qd_zmrSCZiNa-Ol61r99M

class MauiMap {
    constructor() {
      const HideStuff = ["poi","transit",]
      var HideList = []
      for (var i=0;i<HideStuff.length;i++) HideList.push({featureType: HideStuff[i],stylers:[{visibility:"off"}]})

      this.baseZoom = 10.5
      this.map = new google.maps.Map(document.getElementById("map"), 
          {
            zoom: this.baseZoom,
            center: {lng: -156.345, lat: 20.8},
            styles: HideList,
            gestureHandling: "greedy",
          });

      this.baseScale = 2
      this.map.addListener("zoom_changed", () => {
        var zz = this.map.getZoom();  // from 4 to 16 or something.  At 10, should be 1
        var zzs = 1; if (zz>this.baseZoom) zzs = 1+(zz-this.baseZoom)/3; if (zz<this.baseZoom) zzs = 1-(this.baseZoom-zz)/3

        for (var i=0;i<this.markers.length;i++) {
          var ci = this.markers[i].getIcon()
          ci.scale = this.baseScale*this.markers[i].scaler*zzs
          this.markers[i].setIcon(ci)
        }
      });

      this.markers = []
    }

    AddAPoint(i) {
      var ic = {path: google.maps.SymbolPath.CIRCLE,
                scale: this.baseScale,
                fillColor: "#F00",
                fillOpacity: 0.8,
                strokeWeight: 0.4,
               }
      var rs = 1.0 // rescale on zoom
      try {
            if (AllData[i].Status.visited) {
              rs = 1.4
              ic.fillColor ="#00F"
            }
            if ("Page" in AllData[i]) {
              rs = 1.6
              ic.fillColor = "#0F0"
            }
            if (AllData[i].Status.planning) {
              ic.fillColor = "#FF0"
            }
            ic.scale = ic.scale*rs
       } catch {}

      var p = new google.maps.Marker({
        position: {lat: AllData[i].Lat, lng: AllData[i].Lng},
        map: this.map,
        title: AllData[i].Name,
        icon: ic,
      });

      p["dataIndex"] = i;
      p["scaler"] = rs;
      this.markers.push(p)

      p.addListener("click", () => {PShow.setDIndex(p.dataIndex)});
    }

/*

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





 


