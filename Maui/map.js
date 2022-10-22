
// Google maps api key:  AIzaSyDLlibEWsGms7qd_zmrSCZiNa-Ol61r99M

class MauiMap {
    constructor() {
      const HideStuff = [
        "poi",
        "transit",
 //       "landscape.labels"
        ]
      var HideList = []
      for (var i=0;i<HideStuff.length;i++) HideList.push({featureType: HideStuff[i],stylers:[{visibility:"off"}]})
      HideList.push({"featureType": "landscape","elementType": "labels","stylers": [{"visibility": "off"}]}) // landscape.labels doesn't work

      this.baseZoom = 10.5
      this.map = new google.maps.Map(document.getElementById("map"), 
          {
            zoom: this.baseZoom,
            center: {lng: -156.345, lat: 20.8},
            styles: HideList,
            gestureHandling: "greedy",
//            mapTypeId: 'terrain',
            streetViewControl:false,
          });

      // changes on Zoom
     // var res = window.screen.width * window.devicePixelRatio
     // console.log("res",res,window.screen.width,window.devicePixelRatio)

     // macbook air is 2; high res phones are 3 to 4
      this.baseScale = 1 * window.devicePixelRatio

      this.map.addListener("zoom_changed", () => {
        var zz = this.map.getZoom();  // from 4 to 16 or something.  At 10, should be 1

        var zzs = 1; if (zz>this.baseZoom) zzs = 1+(zz-this.baseZoom)/2; if (zz<this.baseZoom) zzs = 1-(this.baseZoom-zz)/2
        // Change marker size
        for (var i=0;i<this.markers.length;i++) {
          var ci = this.markers[i].getIcon()
          ci.scale = this.baseScale*this.markers[i].scaler*zzs
          this.markers[i].setIcon(ci)

          try {
            if (AllData[this.markers[i].dataIndex].Status.visited) {
              if (zz>12) {
                var fs = (zz-6)+(window.devicePixelRatio*1.5)
                this.markers[i].setLabel({"text":this.markers[i].getTitle(),"color":this.markers[i].icon.fillColor,"fontSize":fs+"pt"})
              } 
              else {this.markers[i].setLabel(null)}
            }
          } catch{}
        }
        // if Zoom is high, turn on labels.

      });
      this.markers = []
      this.groups = []

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
//         {"id":"Trail", "path": "M 0 0 L 2 0 L 2 2 Z"},
         {"id":"Trail", "path":"M 1.3911 0.1288 z z M 1.3 0.3662 c 0.11 0 0.2 -0.0829 0.2 -0.1843 s -0.09 -0.1843 -0.2 -0.1843 s -0.2 0.0829 -0.2 0.1843 S 1.19 0.3662 1.3 0.3662 z M 0.93 0.6795 L 0.65 1.9788 h 0.21 l 0.18 -0.7372 l 0.21 0.1843 v 0.5529 h 0.2 v -0.6911 l -0.21 -0.1843 l 0.06 -0.2765 C 1.43 0.9651 1.63 1.0573 1.85 1.0573 v -0.1843 c -0.19 0 -0.35 -0.0921 -0.43 -0.2212 l -0.1 -0.1474 c -0.056 -0.082 -0.168 -0.1152 -0.265 -0.0774 L 0.55 0.6242 V 1.0573 h 0.2 V 0.744 L 0.93 0.6795 z"},

//         {"id":"Misc.", "path": "M 0.003 1.963 Q 0 0 2 0 Q 2 2 0.038 1.994 L 0.743 1.239 C 1.979 1.305 0.758 0.044 0.717 1.199",},
//         {"id":"Place", "path": "M 0 2 L 0 1 L 0.5 0 L 1.5 0 L 2 1 L 2 2 L 1.2 2 L 1.2 1.6 L 0.8 1.6 L 0.8 2 Z"},
         {"id": "Place", "path": "M 0.315 0.2351 A 0.2025 0.1924 0 0 1 0.5175 0.0427 h 0.135 A 0.2025 0.1924 0 0 1 0.855 0.2351 V 0.5557 h 0.27 V 0.2351 A 0.2025 0.1924 0 0 1 1.3275 0.0427 h 0.135 A 0.2025 0.1924 0 0 1 1.665 0.2351 v 0.3055 a 0.0675 0.0641 0 0 0 0.0373 0.0573 l 0.1208 0.0573 A 0.2025 0.1924 0 0 1 1.935 0.8274 V 1.7741 a 0.2025 0.1924 0 0 1 -0.2025 0.1924 h -0.405 A 0.2025 0.1924 0 0 1 1.125 1.7741 v -0.3847 a 0.0675 0.0641 0 0 1 0.0197 -0.0454 l 0.1153 -0.1094 V 1.1329 a 0.0675 0.0641 0 0 0 -0.0675 -0.0641 h -0.405 a 0.0675 0.0641 0 0 0 -0.0675 0.0641 v 0.1017 l 0.1153 0.1094 A 0.0675 0.0641 0 0 1 0.855 1.3894 v 0.3847 A 0.2025 0.1924 0 0 1 0.6525 1.9665 h -0.405 A 0.2025 0.1924 0 0 1 0.045 1.7741 V 0.8274 a 0.2025 0.1924 0 0 1 0.112 -0.1721 l 0.1207 -0.0573 A 0.0675 0.0641 0 0 0 0.315 0.5406 V 0.2351 z M 0.5175 0.171 a 0.0675 0.0641 0 0 0 -0.0675 0.0641 V 0.2992 h 0.27 v -0.0641 a 0.0675 0.0641 0 0 0 -0.0675 -0.0641 h -0.135 z M 0.72 0.4275 H 0.45 v 0.1131 a 0.2025 0.1924 0 0 1 -0.112 0.1721 l -0.1207 0.0573 A 0.0675 0.0641 0 0 0 0.18 0.8274 V 1.5817 h 0.54 v -0.1658 l -0.1153 -0.1094 A 0.0675 0.0641 0 0 1 0.585 1.2611 v -0.1283 A 0.2025 0.1924 0 0 1 0.7875 0.9405 h 0.405 A 0.2025 0.1924 0 0 1 1.395 1.1329 v 0.1283 a 0.0675 0.0641 0 0 1 -0.0197 0.0454 l -0.1153 0.1094 V 1.5817 h 0.54 V 0.8274 a 0.0675 0.0641 0 0 0 -0.0373 -0.0573 l -0.1208 -0.0573 A 0.2025 0.1924 0 0 1 1.53 0.5406 V 0.4275 h -0.27 v 0.1924 a 0.0675 0.0641 0 0 1 -0.0675 0.0641 h -0.405 a 0.0675 0.0641 0 0 1 -0.0675 -0.0641 V 0.4275 z m 0.54 -0.1283 h 0.27 v -0.0641 a 0.0675 0.0641 0 0 0 -0.0675 -0.0641 h -0.135 a 0.0675 0.0641 0 0 0 -0.0675 0.0641 V 0.2992 z m 0.54 1.4107 h -0.54 v 0.0641 a 0.0675 0.0641 0 0 0 0.0675 0.0641 h 0.405 a 0.0675 0.0641 0 0 0 0.0675 -0.0641 V 1.71 z m -1.08 0 H 0.18 v 0.0641 a 0.0675 0.0641 0 0 0 0.0675 0.0641 h 0.405 a 0.0675 0.0641 0 0 0 0.0675 -0.0641 V 1.71 z"},
//         {"id":"Puʻu",   "path": "M 0 2 L 1 0 L 2 2 Z"},
         {"id": "Puʻu", "path":"M 0.9702 1.1414 z M 0 1.4595 C 0 1.4259 0.0095 1.393 0.0274 1.3645 L 0.721 0.2592 C 0.7421 0.2253 0.7792 0.2048 0.8192 0.2048 C 0.8592 0.2048 0.8963 0.2253 0.9178 0.2592 L 1.3206 0.9014 L 1.4749 0.6486 C 1.4851 0.6275 1.511 0.6144 1.536 0.6144 C 1.561 0.6144 1.584 0.6275 1.5971 0.6486 L 2.0195 1.3411 C 2.0381 1.3715 2.048 1.407 2.048 1.4429 C 2.048 1.5507 1.9603 1.6384 1.8525 1.6384 H 0.1789 C 0.0801 1.6384 0 1.5555 0 1.4595 L 0 1.4595 z"},
//          {"id":"Puu",   "path": "M 0 2 L 0 0 L 0.8 0 Q 1.982 0.529 0.747 1.005 L 0.3 1 L 0.3 1.8 L 0.4 1.8 L 0.4 1.1 L 0.6 1.1 Q 0.767 2.559 1 1.1 L 1.1 1.1 L 1.1 1.8 L 1.2 1.8 L 1.2 1.1 L 1.4 1.1 Q 1.592 2.534 1.8 1.1 L 2 1.1 L 2 2 Z"},
//         {"id":"Random","path": "M 0.001 0.506 L 0.729 0.418 L 0.026 1.441 L 1 1 L 0.207 1.997 L 1.403 1.475 L 2 2 L 1.722 0.948 L 1.995 0.01 L 1.198 0.653 L 0.94 0.086 L 0.251 -0.003 Z"},
//         {"id":"Beach", "path": "M 0.189 1.986 Q -0.3 -0.365 1.995 0.17 Q 1.405 0.518 1.349 1.098 L 1.99 1.653 L 1.733 1.996 L 1.067 1.451 Q 0.578 1.35 0.199 1.986"},
         {"id":"Beach", "path": "M 0.3508 0.4816 l 0.3104 0.1315 c 0.1068 -0.2873 0.2622 -0.5083 0.4226 -0.6114 c -0.2915 -0.0172 -0.574 0.1301 -0.7554 0.3931 C 0.3076 0.4245 0.3198 0.4688 0.3508 0.4816 z M 0.7527 0.6512 l 0.725 0.3058 c 0.1087 -0.4274 0.0566 -0.8152 -0.1296 -0.8938 c -0.0224 -0.0092 -0.046 -0.0143 -0.0703 -0.0143 C 1.1017 0.0488 0.888 0.2926 0.7527 0.6512 z M 1.5854 0.213 c 0.019 0.0572 0.0327 0.1219 0.0399 0.1945 c 0.0175 0.1756 -0.0042 0.3805 -0.0574 0.5875 l 0.3119 0.1316 c 0.0308 0.0132 0.0646 -0.0119 0.0654 -0.0497 C 1.9526 0.7395 1.8179 0.4168 1.5854 0.213 z M 1.6051 1.577 h -0.6293 l 0.1976 -0.6283 l -0.1828 -0.077 l -0.2215 0.7054 H 0.1459 C 0.0654 1.577 0 1.6526 0 1.7459 C 0 1.7769 0.0218 1.8022 0.0486 1.8022 h 1.6538 c 0.0269 0 0.0486 -0.0252 0.0486 -0.0531 C 1.751 1.6526 1.6857 1.577 1.6051 1.577 z"},
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
                labelOrigin: new google.maps.Point(0,3)
               }
      try {ic.path = this.icons.find(e=>(e.id===AllData[i].Tags[0])).path} catch{} // if there is a custom icon path based on first tag.
      var rs = 1.0 // size based on type
      try { if (AllData[i].Status.visited)  
               if ("Pics" in AllData[i] && AllData[i].Pics.length>0)   
                                               {rs = 1.8; ic.fillOpacity = 0.8; ic.fillColor = "#22F"}   // visited and Pics
               else                            {rs = 1.3; ic.fillOpacity = 0.8; ic.fillColor = "#66F"}   // visited, but no Pics
            if ("Page" in AllData[i])          {rs = 1.8; ic.fillOpacity = 0.8; ic.fillColor = "#0F0"}   // has a write up
            if (AllData[i].Status.planning)    {rs = 1.6; ic.fillOpacity = 0.7; ic.strokeWeight = 0.8; ic.fillColor = "#FF6"; ic.strokeColor = "#000"}   // planning to do more
            else if (AllData[i].Page.proofed)  {rs = 1.8; ic.fillOpacity = 0.8; ic.strokeWeight = 0.8; ic.strokeColor = "#000"} // write up is good to go
            if (AllData[i].Tags[0]=="Misc.")   {rs = 1.5; ic.fillOpacity = 0.6; ic.fillColor = "#F3F"}   // miscellaneous
       } catch {}
       // custom icon in AllData?
       try { if ("Icon" in AllData[i]) {
         ic.path = AllData[i].Icon.path;
         rs = AllData[i].Icon.scale;
         ic.anchor = new google.maps.Point(AllData[i].Icon.anchor[0],AllData[i].Icon.anchor[1]);
         ic.labelOrigin = new google.maps.Point(AllData[i].Icon.text[0],AllData[i].Icon.text[1]);
       }} catch {}
       
       //  Draw a group for this one?
       /*
       try { if ("Group" in AllData[i]) {
         const xyz = 0.003 // icon height  (should actually index to the icon anchor) 
                           // Icons are scaled to 2,2, so anchor is at 1,1.... but how does this map to Lat Lng?
         const coords = [{lat:AllData[i].Lat+xyz/2,                  lng:AllData[i].Lng-AllData[i].Group.width/2-xyz},
                         {lat:AllData[i].Lat+xyz/2,                  lng:AllData[i].Lng+AllData[i].Group.width/2},
                         {lat:AllData[i].Lat-AllData[i].Group.length,lng:AllData[i].Lng+AllData[i].Group.width/2},
                         {lat:AllData[i].Lat-AllData[i].Group.length,lng:AllData[i].Lng-AllData[i].Group.width/2-xyz},
                        ]

         const group = new google.maps.Polygon({
              paths: coords,
              strokeColor: ic.fillColor,
              strokeOpacity: 0.8,
              strokeWeight: 0.5,
              fillColor: ic.fillColor,
              fillOpacity: 0.1,
          });
          group.setMap(this.map);
          this.Groups.push(group);
       }} catch {}
       */

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





 


