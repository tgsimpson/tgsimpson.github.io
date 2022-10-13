
// Google maps api key:  AIzaSyDLlibEWsGms7qd_zmrSCZiNa-Ol61r99M

class MauiMap {
    constructor() {
      const HideStuff = [
        "poi",
        "transit",
      //  "landscape.natural"
        ]
      var HideList = []
      for (var i=0;i<HideStuff.length;i++) HideList.push({featureType: HideStuff[i],stylers:[{visibility:"off"}]})

      this.baseZoom = 10.5
      this.map = new google.maps.Map(document.getElementById("map"), 
          {
            zoom: this.baseZoom,
            center: {lng: -156.345, lat: 20.8},
            styles: HideList,
            gestureHandling: "greedy",
            mapTypeId: 'terrain',
          });

      // changes on Zoom
     // var res = window.screen.width * window.devicePixelRatio
     // console.log("res",res,window.screen.width,window.devicePixelRatio)

     // macbook air is 2; high res phones are 3 to 4
      this.baseScale = 1 * window.devicePixelRatio

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
      this.tagsonly = []
      for (var i=0;i<AllData.length;i++) {
            try { for (var j=0;j<AllData[i].Tags.length;j++) {
                     if (!(this.tagsonly.includes(AllData[i].Tags[j]))) 
                       {this.tags.push({"tag":AllData[i].Tags[j], "on":true, "cnt":0, "seen":0})};
                        this.tagsonly.push(AllData[i].Tags[j])
                       }
                } catch {}
       }


       this.icons = [
        // {"id":"Beach", "path":"M 0 0 L 0.10 0.80 Q 0.52.5 0.10, 0.95 0.80 T 0.180 0.80 L 1 1 Z"},
//         {"id":"Trail", "path": "M 0 2 L 0.347 1.101 L 0.752 0.848 L 1.03 0.494 L 1.385 0.448 L 1.992 0.008 L 2 2 Z"},
         {"id":"Trail", "path": "M 0 0 L 2 0 L 2 2 Z"},

//         {"id":"Misc.", "path": "M 0.003 1.963 Q 0 0 2 0 Q 2 2 0.038 1.994 L 0.743 1.239 C 1.979 1.305 0.758 0.044 0.717 1.199",},
         {"id":"Place", "path": "M 0 2 L 0 1 L 0.5 0 L 1.5 0 L 2 1 L 2 2 L 1.2 2 L 1.2 1.6 L 0.8 1.6 L 0.8 2 Z"},
         {"id":"Puʻu",   "path": "M 0 2 L 1 0 L 2 2 Z"},
//          {"id":"Puu",   "path": "M 0 2 L 0 0 L 0.8 0 Q 1.982 0.529 0.747 1.005 L 0.3 1 L 0.3 1.8 L 0.4 1.8 L 0.4 1.1 L 0.6 1.1 Q 0.767 2.559 1 1.1 L 1.1 1.1 L 1.1 1.8 L 1.2 1.8 L 1.2 1.1 L 1.4 1.1 Q 1.592 2.534 1.8 1.1 L 2 1.1 L 2 2 Z"},
//         {"id":"Random","path": "M 0.001 0.506 L 0.729 0.418 L 0.026 1.441 L 1 1 L 0.207 1.997 L 1.403 1.475 L 2 2 L 1.722 0.948 L 1.995 0.01 L 1.198 0.653 L 0.94 0.086 L 0.251 -0.003 Z"},
         {"id":"Beach", "path": "M 0.189 1.986 Q -0.3 -0.365 1.995 0.17 Q 1.405 0.518 1.349 1.098 L 1.99 1.653 L 1.733 1.996 L 1.067 1.451 Q 0.578 1.35 0.199 1.986"}
       ]
    }

    AddAPoint(i) {

      try {if (AllData[i].Status.hide) return;  // if marked to hide, or not on Maui proper, hide
        if (AllData[i].Lat > 21.04) return;
        if (AllData[i].Lat < 20.57) return;
        if (AllData[i].Lng < -156.72) return;
        if (AllData[i].Lng > -155.95) return;
      } catch{} 

      var ic = {path: google.maps.SymbolPath.CIRCLE,
                scale: this.baseScale,
                fillColor: "#F00",
                fillOpacity: 0.3,
                strokeWeight: 0.2,
                anchor: new google.maps.Point(1,1),
               }
      try {ic.path = this.icons.find(e=>(e.id===AllData[i].Tags[0])).path} catch{} // if there is a custom icon path based on first tag.
      var rs = 1.0 // size based on type
      try { if (AllData[i].Status.visited)  
               if ("Pics" in AllData[i] && AllData[i].Pics.length>0)   
                                               {rs = 1.8; ic.fillOpacity = 0.8; ic.fillColor = "#00F"}   // visited and Pics
               else                            {rs = 1.3; ic.fillOpacity = 0.8; ic.fillColor = "#44A"}   // visited, but no Pics
            if ("Page" in AllData[i])          {rs = 1.8; ic.fillOpacity = 0.8; ic.fillColor = "#0F0"}   // has a write up
            if (AllData[i].Status.planning)    {rs = 1.6; ic.fillOpacity = 0.7; ic.fillColor = "#FF0"}   // planning to do more
            else if (!AllData[i].Page.proofed) {          ic.fillOpacity = 0.8; ic.strokeWeight = 0.8; ic.strokeColor = "#F80"} // write up is good to go
            if (AllData[i].Tags[0]=="Misc.")   {rs = 1.5; ic.fillOpacity = 0.6; ic.fillColor = "#F0F"}   // miscellaneous
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

      // put a cnt on the markers
      try {for (var j=0;j<this.tags.length;j++) {
        if (AllData[i].Tags.includes(this.tags[j].tag)) {
          this.tags[j].cnt = this.tags[j].cnt+1;
          try {if (AllData[i].Status.visited) this.tags[j].seen = this.tags[j].seen+1} catch{}
        }}
      } catch {}

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
             "<input type='checkbox' id='"+this.tags[i].tag+"Tag'"+" name='"+this.tags[i].tag+"'>"+
             "<label for='"+this.tags[i].tag+"Tag'>"+this.tags[i].tag+" ("+this.tags[i].seen+"/"+this.tags[i].cnt+")</label>"+
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





 


