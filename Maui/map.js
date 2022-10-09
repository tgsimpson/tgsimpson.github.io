
// Google maps api key:  AIzaSyDLlibEWsGms7qd_zmrSCZiNa-Ol61r99M

class MauiMap {
    constructor() {
      const HideStuff = ["poi","transit","landscape.natural"]
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


       this.icons = [
        // {"id":"Beach", "path":"M 0 0 L 0.10 0.80 Q 0.52.5 0.10, 0.95 0.80 T 0.180 0.80 L 1 1 Z"},
         {"id":"Trail","path": "M 0 2 L 0.5 1.4 L 1 0.6 L 1.5 0.2 L 2 0 L 2 2 Z"},
         {"id":"Misc.","path": "M 0 0 L 0 2 L 2 2 L 2 0 L 0 0",},
         {"id":"Place","path": "M 0 2 L 0 1 L 0.5 0 L 1.5 0 L 2 1 L 2 2 L 1.2 2 L 1.2 1.6 L 0.8 1.6 L 0.8 2 Z"},
//         {"id":"Beach","path": "M10.453 14.016l6.563-6.609-1.406-1.406-5.156 5.203-2.063-2.109-1.406 1.406zM12 2.016q2.906 0 4.945 2.039t2.039 4.945q0 1.453-0.727 3.328t-1.758 3.516-2.039 3.070-1.711 2.273l-0.75 0.797q-0.281-0.328-0.75-0.867t-1.688-2.156-2.133-3.141-1.664-3.445-0.75-3.375q0-2.906 2.039-4.945t4.945-2.039z",},
        // {"id":"Trail","path": "M5,3C4.4477,3,4,2.5523,4,2s0.4477-1,1-1s1,0.4477,1,1S5.5523,3,5,3z M12.5,10H10L9,7L8,5.25L9,5l2.3,1l0,0&#xA;&#x9;c0.2761,0.1105,0.5895-0.0239,0.7-0.3S11.9761,5.1105,11.7,5l0,0L9,4H7L5,5L4,6H2.5C2.2239,6,2,6.2239,2,6.5S2.2239,7,2.5,7H5l1-1&#xA;&#x9;l1,2l-2,2v3.5C5,13.7761,5.2239,14,5.5,14S6,13.7761,6,13.5v-3.11L8,9l1,2h3.5c0.2761,0,0.5-0.2239,0.5-0.5S12.7761,10,12.5,10z"},
       ]
    }

    AddAPoint(i) {
      var ic = {path: google.maps.SymbolPath.CIRCLE,
                scale: this.baseScale,
                fillColor: "#F00",
                fillOpacity: 0.8,
                strokeWeight: 0.4,
               }
      try {ic.path = this.icons.find(e=>(e.id===AllData[i].Tags[0])).path} catch{} // if there is a custom icon path based on first tag.
      var rs = 1.0 // rescale on zoom
      // color and size based on type
      try { if (AllData[i].Status.visited)  
               if ("Pics" in AllData[i] && AllData[i].Pics.length>0)   
                                               {rs = 1.4; ic.fillColor = "#00F"}   // visited and Pics
               else                            {          ic.fillColor = "#44A"}   // visited, but no Pics
            if ("Page" in AllData[i])          {rs = 1.6; ic.fillColor = "#0F0"}   // has a write up
            if (AllData[i].Status.planning)    {          ic.fillColor = "#FF0"}   // planning to do more
            else if (!AllData[i].Page.proofed) {          ic.strokeWeight = 0.8; ic.strokeColor = "#F80"} // write up is good to go
            if (AllData[i].Tags[0]=="Misc.")   {rs = 1.6; ic.fillColor = "#F0F"}   // miscellaneous
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





 


