
// Google maps api key:  AIzaSyDLlibEWsGms7qd_zmrSCZiNa-Ol61r99M

class MapObject {
    constructor(mapStack) {
      this.mapStack    = mapStack;                  // mapLayer is a tuple [MapLayer, MapLayerControls]
      this.mapBase     = this.mapStack.get('base')
      this.mapControls = this.mapStack.get('ctrl')
      this.element     = this.mapBase.getElement()

      this.bounds = {north: 21.06, south: 20.558, east: -156, west: -156.73}

      // Stuff to hide on map
      var StyleList = []; 
      const HideStuff = ["poi","transit",/*"landscape.labels"*/ ]
      for (var i=0;i<HideStuff.length;i++) StyleList.push({featureType: HideStuff[i],stylers:[{visibility:"off"}]})
      StyleList.push({"featureType": "landscape","elementType": "labels","stylers": [{"visibility": "off"}]}) // landscape.labels doesn't work
      StyleList.push({featureType: "water", elementType: "geometry.fill",stylers: [{ color: "#7070ff" }],}) // change water color

      this.baseZoom = 10.5
      this.baseCenter = new google.maps.LatLng(20.8,-156.345)
      this.map = new google.maps.Map(this.element, 
          {
            zoom: this.baseZoom,
            center: this.baseCenter, // {lng: -156.345, lat: 20.8},
            styles: StyleList,
            gestureHandling: "greedy",
            // mapTypeId: 'terrain',
            streetViewControl:false,
          });

  //    this.map.fitBounds(this.bounds)

      this.storeZoom = this.map.getZoom()
      this.storeCenter = this.map.getCenter()
      this.storeZoomActive = false

      // Scale markers and fonts basesd on the device pixel ratio
      this.baseScale = 1 * window.devicePixelRatio
      // Map event listeners
      this.map.addListener("zoom_changed", ()=>this.ZoomChange());
      this.map.addListener("rightclick", (event)=>console.log("{\"lat\":",event.latLng.lat(),",\"lng\":",event.latLng.lng(),"},"))
      // Keep a list of things on the map
      this.markers = []
      this.currentMarker = null
      this.groups = []
      this.overlays = [] // index these by marker, so we know what to remove when
      // setup for filtering
//      this.selectBox = document.getElementById('selectBox')
//      this.selectBox.addEventListener("click", () => {this.filterPoints();});
//      this.searchBox = document.getElementById("searchBox")

       // Specialized Icons based on some tags;  Icon may also be encoded directly in AllData for a given marker
      this.icons = [
         {"id":"Trail", "path":"M 1.3911 0.1288 z z M 1.3 0.3662 c 0.11 0 0.2 -0.0829 0.2 -0.1843 s -0.09 -0.1843 -0.2 -0.1843 s -0.2 0.0829 -0.2 0.1843 S 1.19 0.3662 1.3 0.3662 z M 0.93 0.6795 L 0.65 1.9788 h 0.21 l 0.18 -0.7372 l 0.21 0.1843 v 0.5529 h 0.2 v -0.6911 l -0.21 -0.1843 l 0.06 -0.2765 C 1.43 0.9651 1.63 1.0573 1.85 1.0573 v -0.1843 c -0.19 0 -0.35 -0.0921 -0.43 -0.2212 l -0.1 -0.1474 c -0.056 -0.082 -0.168 -0.1152 -0.265 -0.0774 L 0.55 0.6242 V 1.0573 h 0.2 V 0.744 L 0.93 0.6795 z"},
         {"id": "Place", "path": "M 0.315 0.2351 A 0.2025 0.1924 0 0 1 0.5175 0.0427 h 0.135 A 0.2025 0.1924 0 0 1 0.855 0.2351 V 0.5557 h 0.27 V 0.2351 A 0.2025 0.1924 0 0 1 1.3275 0.0427 h 0.135 A 0.2025 0.1924 0 0 1 1.665 0.2351 v 0.3055 a 0.0675 0.0641 0 0 0 0.0373 0.0573 l 0.1208 0.0573 A 0.2025 0.1924 0 0 1 1.935 0.8274 V 1.7741 a 0.2025 0.1924 0 0 1 -0.2025 0.1924 h -0.405 A 0.2025 0.1924 0 0 1 1.125 1.7741 v -0.3847 a 0.0675 0.0641 0 0 1 0.0197 -0.0454 l 0.1153 -0.1094 V 1.1329 a 0.0675 0.0641 0 0 0 -0.0675 -0.0641 h -0.405 a 0.0675 0.0641 0 0 0 -0.0675 0.0641 v 0.1017 l 0.1153 0.1094 A 0.0675 0.0641 0 0 1 0.855 1.3894 v 0.3847 A 0.2025 0.1924 0 0 1 0.6525 1.9665 h -0.405 A 0.2025 0.1924 0 0 1 0.045 1.7741 V 0.8274 a 0.2025 0.1924 0 0 1 0.112 -0.1721 l 0.1207 -0.0573 A 0.0675 0.0641 0 0 0 0.315 0.5406 V 0.2351 z M 0.5175 0.171 a 0.0675 0.0641 0 0 0 -0.0675 0.0641 V 0.2992 h 0.27 v -0.0641 a 0.0675 0.0641 0 0 0 -0.0675 -0.0641 h -0.135 z M 0.72 0.4275 H 0.45 v 0.1131 a 0.2025 0.1924 0 0 1 -0.112 0.1721 l -0.1207 0.0573 A 0.0675 0.0641 0 0 0 0.18 0.8274 V 1.5817 h 0.54 v -0.1658 l -0.1153 -0.1094 A 0.0675 0.0641 0 0 1 0.585 1.2611 v -0.1283 A 0.2025 0.1924 0 0 1 0.7875 0.9405 h 0.405 A 0.2025 0.1924 0 0 1 1.395 1.1329 v 0.1283 a 0.0675 0.0641 0 0 1 -0.0197 0.0454 l -0.1153 0.1094 V 1.5817 h 0.54 V 0.8274 a 0.0675 0.0641 0 0 0 -0.0373 -0.0573 l -0.1208 -0.0573 A 0.2025 0.1924 0 0 1 1.53 0.5406 V 0.4275 h -0.27 v 0.1924 a 0.0675 0.0641 0 0 1 -0.0675 0.0641 h -0.405 a 0.0675 0.0641 0 0 1 -0.0675 -0.0641 V 0.4275 z m 0.54 -0.1283 h 0.27 v -0.0641 a 0.0675 0.0641 0 0 0 -0.0675 -0.0641 h -0.135 a 0.0675 0.0641 0 0 0 -0.0675 0.0641 V 0.2992 z m 0.54 1.4107 h -0.54 v 0.0641 a 0.0675 0.0641 0 0 0 0.0675 0.0641 h 0.405 a 0.0675 0.0641 0 0 0 0.0675 -0.0641 V 1.71 z m -1.08 0 H 0.18 v 0.0641 a 0.0675 0.0641 0 0 0 0.0675 0.0641 h 0.405 a 0.0675 0.0641 0 0 0 0.0675 -0.0641 V 1.71 z"},
         {"id": "Puʻu", "path":"M 0.9702 1.1414 z M 0 1.4595 C 0 1.4259 0.0095 1.393 0.0274 1.3645 L 0.721 0.2592 C 0.7421 0.2253 0.7792 0.2048 0.8192 0.2048 C 0.8592 0.2048 0.8963 0.2253 0.9178 0.2592 L 1.3206 0.9014 L 1.4749 0.6486 C 1.4851 0.6275 1.511 0.6144 1.536 0.6144 C 1.561 0.6144 1.584 0.6275 1.5971 0.6486 L 2.0195 1.3411 C 2.0381 1.3715 2.048 1.407 2.048 1.4429 C 2.048 1.5507 1.9603 1.6384 1.8525 1.6384 H 0.1789 C 0.0801 1.6384 0 1.5555 0 1.4595 L 0 1.4595 z"},
         {"id":"Beach", "path": "M 0.3508 0.4816 l 0.3104 0.1315 c 0.1068 -0.2873 0.2622 -0.5083 0.4226 -0.6114 c -0.2915 -0.0172 -0.574 0.1301 -0.7554 0.3931 C 0.3076 0.4245 0.3198 0.4688 0.3508 0.4816 z M 0.7527 0.6512 l 0.725 0.3058 c 0.1087 -0.4274 0.0566 -0.8152 -0.1296 -0.8938 c -0.0224 -0.0092 -0.046 -0.0143 -0.0703 -0.0143 C 1.1017 0.0488 0.888 0.2926 0.7527 0.6512 z M 1.5854 0.213 c 0.019 0.0572 0.0327 0.1219 0.0399 0.1945 c 0.0175 0.1756 -0.0042 0.3805 -0.0574 0.5875 l 0.3119 0.1316 c 0.0308 0.0132 0.0646 -0.0119 0.0654 -0.0497 C 1.9526 0.7395 1.8179 0.4168 1.5854 0.213 z M 1.6051 1.577 h -0.6293 l 0.1976 -0.6283 l -0.1828 -0.077 l -0.2215 0.7054 H 0.1459 C 0.0654 1.577 0 1.6526 0 1.7459 C 0 1.7769 0.0218 1.8022 0.0486 1.8022 h 1.6538 c 0.0269 0 0.0486 -0.0252 0.0486 -0.0531 C 1.751 1.6526 1.6857 1.577 1.6051 1.577 z"},
       ]
    }

    getMarkers() {return this.markers}

    originalZoomCenter() {
    //  this.map.fitBounds(this.bounds);
   //   this.map.setZoom(this.baseZoom)
    //  this.map.setCenter(this.baseCenter)
    }

    pushState() {
      this.storeZoom = this.map.getZoom()
      this.storeCenter = this.map.getCenter()
      this.storeZoomActive = true;
    }

    popState() {
      if (!this.storeZoomActive) return;
      this.map.setZoom(this.storeZoom)
      this.map.setCenter(this.storeCenter)
      this.storeZoomActive = false;
    }

    // Called when Zoom changes; scales markers and fonts based on baseZoom, and turns on labels if Zoom > 12
    ZoomChange() {
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
    }

    // On initial load of data, create markers
    AddAPoint(i) {
      // Filter out any markers that don't need to be shown
      try {if (AllData[i].Status.hide) return;  
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
      // Change attributes based on Pictures, Page, etc.
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
         if ("path"      in AllData[i].Icon) ic.path = AllData[i].Icon.path;
         if ("scale"     in AllData[i].Icon) rs = AllData[i].Icon.scale;
         if ("fillColor" in AllData[i].Icon) ic.fillColor = AllData[i].Icon.fillColor;
         ic.anchor       = new google.maps.Point(AllData[i].Icon.anchor[0],AllData[i].Icon.anchor[1]);
         ic.labelOrigin  = new google.maps.Point(AllData[i].Icon.text[0],AllData[i].Icon.text[1]);
       }} catch {}
      // With relative scale finally set, set the icon scale
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

      AllData[i].marker = p

      // event listeners
      p.addListener("click", () => {this.onClick(p)});
    }

    highlightMarker(marker) {
       const infoWindow = new google.maps.InfoWindow({content: "<div id='IWID'><strong>&#128308;</strong></div>",})
       
       google.maps.event.addListener(infoWindow,'domready',()=>{
         const iwElement = document.getElementById('IWID')
         iwElement.parentNode.parentNode.nextSibling.remove()
         // iwElement.parentNode.parentNode.parentNode.parentNode.style.backgroundColor = "red" 
       })
       infoWindow.open({anchor:marker,map: this.map,})
       // remove close button

       return infoWindow
    }

    restoreMarker(marker,iW) {
      iW.close()
    }

    showPolyLine(marker,poly,autozoom) {
       var i = marker.dataIndex
       // Zoom map to the poly?
       if (autozoom) {
           this.map.panTo(marker.position)
           var bounds = new google.maps.LatLngBounds();
           for (var i=0;i<poly.points.length;i++) bounds.extend(poly.points[i])
           google.maps.event.addListenerOnce(this.map,'idle',() => {console.log("TRIGGER",this.map,bounds); this.map.fitBounds(bounds)})
//           this.map.fitBounds(bounds)
//           this.map.panToBounds(bounds)
       }

       var pline = new google.maps.Polyline ({path: poly.points, strokeColor: marker.icon.fillColor,})
       pline.setMap(this.map)

       const infoWindow = new google.maps.InfoWindow({
        content: "<table><tr><td>distance</td><td>"+(poly.distance*0.000621371).toFixed(2)+"</td><td>miles</td></tr>"+
                 "<tr><td>elevation</td><td>"+(poly.elevation.pos*3.28084).toFixed(0)+"</td><td>feet</td></tr>"+
                 "<tr><td>time</td><td>"+(poly.time/60000).toFixed(0)+"</td><td>minutes</td></tr></table>"+
                 "<br><em>Click marker again<br>for content.</em>",
       })
       infoWindow.open({anchor:marker,map: this.map,})
       this.overlays.push({marker:marker,polyline:pline,info:infoWindow})  // store for future removal
    }

    onOverlay(marker) {
      var overs = this.overlays.findIndex((e)=>e.marker===marker) // see if this marker has an overlay already
      if (overs<0) {  // show the overlay
           var script = document.createElement('script');      // load overlay data from json file
           script.src = AllData[marker.dataIndex].Overlay.path; script.async = false; document.body.appendChild(script);
           script.addEventListener('load', ()=> this.showPolyLine(marker,AllData[marker.dataIndex].Overlay.load(), true))
           return true;
      }
      else { // overlay is already visible; this click should remove it
           this.overlays[overs].polyline.setMap(null);         // remove overlay from map
           this.overlays[overs].info.close();
           this.overlays.splice(overs,1);                      // remove the element from overlays
           try {AllData[marker.dataIndex].Overlay.unload();} catch(err) {console.log("failed to unload",err)}         // release the variable
           return false
      }
    }

    showOverlay(overlay) {
        this.pushState()
        var script = document.createElement('script');      // load overlay data from json file
        script.src = overlay.path; script.async = false; document.body.appendChild(script);
        script.addEventListener('load', ()=> this.showPolyLine(this.currentMarker,overlay.load(), true))
    }

    hideOverlays() {
      for (var i=0; i<this.overlays.length;i++) {
        this.overlays[i].polyline.setMap(null);
        this.overlays[i].info.close();
        // should call the overlay unload function?
      }
    }

    removeOverlays() {
      this.hideOverlays()
      this.overlays = []
    }

    clean() {
      this.removeOverlays()
      this.popState()
      // if there was an overlay, zoom out a touch?
    }

    onClick(marker) {
      this.currentMarker = marker
//      if ("Overlay" in AllData[marker.dataIndex]) 
//         {try {if (this.onOverlay(marker)) return} catch(err) {console.log("Overlay Error",err)}}
      this.mapBase.playerEvent('marker',{index: marker.dataIndex})
//      PShow.setDIndex(marker.dataIndex)  // if no Overlay in AllData, or second click, show content
    }

    animateTo(data,f) {
      console.log("Map animation here")
      this.map.panTo(new google.maps.LatLng(data.Lat,data.Lng))
      google.maps.event.addListenerOnce(this.map,'idle',() => {console.log("Map Idle"); f()})
    }

/*
    slowPanTo(dst, n_intervals, T_msec) {
      var f_timeout, getStep, i, j, lat_array, lat_delta, lat_step, lng_array, lng_delta, lng_step, pan, ref, startPosition;
      var getStep = function(delta) {
      var start = map.getCenter();

      var lat_delta = (dst.lat()-start.lat())/n_intervals
      var lng_delta = (dst.lng()-start.lng())/n_intervals
      var t_delta = T_msec/n_intervals;

      function doStep(i,lat,lng)
      lat_array = [];
      lng_array = [];
  for (i = j = 1, ref = n_intervals; j <= ref; i = j += +1) {
    lat_array.push(map.getCenter().lat() + i * lat_step);
    lng_array.push(map.getCenter().lng() + i * lng_step);
  }
  f_timeout = function(i, i_min, i_max) {
    return parseFloat(T_msec) / n_intervals;
  };
  pan = function(i) {
    if (i < lat_array.length) {
      return setTimeout(function() {
        map.panTo(new google.maps.LatLng({
          lat: lat_array[i],
          lng: lng_array[i]
        }));
        return pan(i + 1);
      }, f_timeout(i, 0, lat_array.length - 1));
    }
  };
  return pan(0);
};

*/

    // ===== Search / Filter ====


    //===== INITIALIZE Map
    init() {
       console.log("Map initializing...")
       for (var i=0, len = AllData.length; i<len; i++){
         try {this.AddAPoint(i);}
         catch (err) {console.log("issue with element",i,err)}
       }
    }

}




 


