
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

      // changes on Zoom
      this.baseScale = 2
      this.map.addListener("zoom_changed", () => {
        var zz = this.map.getZoom();  // from 4 to 16 or something.  At 10, should be 1
        var zzs = 1; if (zz>this.baseZoom) zzs = 1+(zz-this.baseZoom)/2; if (zz<this.baseZoom) zzs = 1-(this.baseZoom-zz)/2

        for (var i=0;i<this.markers.length;i++) {
          var ci = this.markers[i].getIcon()
          ci.scale = this.baseScale*this.markers[i].scaler*zzs
          this.markers[i].setIcon(ci)
        }
      });
      this.markers = []

      // setup for filtering
      this.selectBox = document.getElementById('selectBox')
      this.selectBox.addEventListener("click", () => {this.filterPoints();});

      this.searchBox = document.getElementById("searchBox")

      this.tags = []
      var tagsonly = []
      for (var i=0;i<AllData.length;i++) {
            try { for (var j=0;j<AllData[i].Tags.length;j++) {
                     if (!(tagsonly.includes(AllData[i].Tags[j]))) 
                       {this.tags.push({"tag":AllData[i].Tags[j], "on":true})};
                        tagsonly.push(AllData[i].Tags[j])
                       }
                } catch {}
       }
    }

    AddAPoint(i) {
      var ic = {path: google.maps.SymbolPath.CIRCLE,
                scale: this.baseScale,
                fillColor: "#F00",
                fillOpacity: 0.8,
                strokeWeight: 0.4,
               }
      var rs = 1.0 // rescale on zoom
      // color and size based on type
      try { if (AllData[i].Status.visited)     {rs = 1.4; ic.fillColor = "#00F"}
            if ("Page" in AllData[i])          {rs = 1.6; ic.fillColor = "#0F0"}
            if (AllData[i].Status.planning)    {          ic.fillColor = "#FF0"}
            else if (!AllData[i].Page.proofed) {          ic.strokeWeight = 0.8; ic.strokeColor = "#F80"}
            if (AllData[i].Tags[0]=="Misc.")   {rs = 1.6; ic.fillColor = "#F0F"}
       } catch {}

      ic.scale = ic.scale*rs

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



    showSB(b) {if (b) {this.searchBox.style.display="block";} 
               else {this.searchBox.style.display = "none"}}

    filterPoints() {
        // tags
        console.log(this.tags[0])
        var html = "<fieldset align='left'>"+
                     "<legend>Types:</legend>"
        for (var i=0;i<this.tags.length;i++) {
          html = html+
             "<div>"+
             "<input type='checkbox' id='"+this.tags[i].tag+"Tag'"+" name='"+this.tags[i]+"'>"+
             "<label for='"+this.tags[i].tag+"Tag'>"+this.tags[i].tag+"</label>"+
             "</div>"
        }
        html = html+"</fieldset><br>"

/*
        // status
        html = html+"<fieldset align='left'>"+
                      "<legend>Status:</legend>"+
                      "<div><input type='checkbox' id='visitedStatus' name='visitedStatus' checked>"+
                      "<label for 'visitedStatus'>Visited</label>"+
                      "<div><input type='checkbox' id='invisitedStatus' name='invisitedStatus' checked>"+
                      "<label for 'invisitedStatus'>Not Visited</label>"+
                      "<div><input type='checkbox' id='planningStatus' name='planningStatus' checked>"+
                      "<label for 'planningStatus'>Planning</label>"+
                    "</fieldset>"+
                    "<br>"

        //generic search
*/

        //
        html = html+"<br>"
        html = html+"<input type='submit' id='applySearch' value='Apply'>"
        html = html+"<input type='submit' id='clearSearch' value='No Filters'>"

        this.searchBox.innerHTML=html+"<div id='closeSearch' class='hide'>&#10540;</div>";

                        // set the boxes
        for (var i=0;i<this.tags.length;i++) 
          document.getElementById(this.tags[i].tag+"Tag").checked = this.tags[i].on;

        document.getElementById('closeSearch').addEventListener("click", function() {this.showSB(false)}.bind(this));
        document.getElementById('applySearch').addEventListener("click", function() {this.doSearch()}.bind(this));
        document.getElementById('clearSearch').addEventListener("click", function() {this.clearSearch()}.bind(this));

        this.showSB(true);
    }

    clearSearch() {
      this.showSB(false)
      for (var i=0;i<this.markers.length;i++) this.markers[i].setMap(this.map)
      for (var i=0;i<this.tags.length;i++) this.tags[i].on = true
    }

    doSearch() {
        this.showSB(false)
        // Tags
        var filters = [];
        for (var i=0;i<this.tags.length;i++) {
          var box = document.getElementById(this.tags[i].tag+"Tag")
          if (box.checked) {filters.push(this.tags[i].tag); this.tags[i].on = true;}
          else this.tags[i].on = false;
        }

        for (var i=0;i<this.markers.length;i++) {
          var intersect = filters.filter(x => AllData[this.markers[i].dataIndex].Tags.includes(x))
          if (intersect.length > 0) {this.markers[i].setMap(this.map)}
          else {this.markers[i].setMap(null)}
        }
    }
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





 


