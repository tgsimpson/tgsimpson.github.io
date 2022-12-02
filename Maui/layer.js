
const helpers = {
	setStyle: (e,s) => {for (const [k,v] of Object.entries(s)) e.style[k] = v},
    baseStyle: {
			position: "absolute",
			display: "block",
			padding: "6px",
			borderRadius: "0 3px 3px 0",
			minWidth: "3%",
			pointerEvents: "all",
			textAlign: "center",
		},
}

class Control {
	constructor (name,xp,yp,f,parent) {
		this.element = document.createElement('div')
		parent.appendChild(this.element)
		var settings = {left: xp,top: yp,backgroundColor: "rgba(0,0,0,0.3)",fontSize: "30px",}
		helpers.setStyle(this.element,helpers.baseStyle)
		helpers.setStyle(this.element,settings)
		this.element.style.background = "rgba(0,0,0,0.3)"

		this.element.innerHTML = name
		this.element.id = "Control"+name
		this.element.addEventListener('click',f)
		this.element.addEventListener('mouseover',this.mouseover.bind(this))
		this.element.addEventListener('mouseout', this.mouseout.bind(this))
	}

	mouseover(evt) {
		this.element.style.background = "gray"
	}

	mouseout(evt) {
		this.element.style.background = "rgba(0,0,0,0.3)"
	}
	setText(c) {this.element.innerHTML = c}
}

class InfoWindow {
	constructor (name,yp,cl,parent) {
		this.element = document.createElement('div')
		parent.appendChild(this.element)
		var settings = {left: "10%", width:"80%", bottom: yp, backgroundColor: "rgba(0,0,0,0.6)",fontSize:"15px",color:"#f2f2f2"}
		helpers.setStyle(this.element,helpers.baseStyle)
		helpers.setStyle(this.element,settings)

		this.element.innerHTML = name
		this.element.id = "Control"+name


		console.log("Putting in ctrl?",cl)
		if (cl) this.control = new Control("&#10540;","98%","2%",this.close.bind(this),this.element)
	}
	setContent(c,cl) {
		this.element.innerHTML = c
		if (cl) this.control = new Control("&#10540;","98%","2%",this.close.bind(this),this.element)
		this.show()
	}
	close() {this.hide()}
	show() {this.element.style.display="block"; }//this.element.animate([{opacity:0.5},{opacity:1}],3000)}
	hide() {this.element.style.display="none"; }//this.element.animate([{opacity:1},{opacity:0}],3000)}
	animate(n,t,f) {
		this.element.innerHTML = n
		this.element.style.display="block"
		const an = this.element.animate([{opacity:0},{opacity:1}],t)
		an.onfinish = (ev) => {this.hide();f()}
	}
}



class Layer {
	constructor(name,type,parent,player,data) {
	  this.name = name
	  this.parent = parent
	  this.player = player
	  this.data = data
	  this.stack = null

	  this.element = document.createElement(type)
	  this.parent.appendChild(this.element)
	  this.element.id = "layer"+name
	  // Full Screen
	  this.element.style.position="absolute"
	  this.element.style.display = "none"
      this.element.style.top = 0
	  this.element.style.left = 0
	  this.element.style.width = "100%"
	  this.element.style.height = "100%"	

	  this.fadeInAnimation = null
	  this.fadeOutAnimation = null

	  this.time = 1000 // 1 second animations, but default
	}
	playerEvent(t,d) {this.player.event(this.name,t,d)}	// send event from this layer to the Player
	setTime(t) {this.time = t}
	getElement() {return this.element}
	show() {this.element.style.display = "block"; this.fadeIn()}
	hide() {var an = this.fadeOut(); an.onfinish = (evt) => {this.element.style.display = "none";}}
	fadeIn() {return this.element.animate([{opacity:0},{opacity:1}],this.time)}
	fadeOut() {return this.element.animate([{opacity:1},{opacity:0}],this.time)}
	setContent(c) {this.element.innerHTML = c}

	setStack(s) {this.stack = s}
	getBase() {return this.stack.base}
	getCtrl() {return this.stack.ctrl}
	hideStack() {for (const [k,v] of Object.entries(this.stack)) v.hide()}
	showStack() {for (const [k,v] of Object.entries(this.stack)) v.show()}
}

//========= MAP

class MapLayer extends Layer {
	constructor(name,type,parent,player,data) {
		super(name,type,parent,player,data)
		this.MapObject = null
	}
	setMap(map) {this.MapObject = map}
	getMap() {return this.MapObject}
}

class MapLayerControls extends Layer {
	constructor(name,type,parent,player,data) {
		super(name,type,parent,player,data)
		this.element.style.pointerEvents = "none"
		this.searchControl = new Control("&#128269;","95%","46%",this.search.bind(this),this.element)	// magnifying glass
		this.slideShowControl = new Control(">>","95%","54%",this.slideShow.bind(this),this.element)	// >> slideshow start
		this.textbox = new InfoWindow('mapTxtOvly',"4%",false,this.element)
		this.textbox.hide()
		this.tags = this.data.getTags();

		this.searchBox = new InfoWindow('SearchBox',"50%",false,this.element)
		this.searchBox.hide()
		this.markers = null
		this.map = null
	}
	mapReady() 	{this.map = this.getBase().getMap(); this.markers = this.map.getMarkers(); }

	//=== Slide show
	slideShow() {this.player.slideShow(true);this.getBase().getMap().originalZoomCenter();}
	runTransition(f) {  
		var infoW = this.map.highlightMarker(this.data.getCurrent().marker)
		this.textbox.animate(this.data.getCurrent().Name,3000,()=>{this.getBase().getMap().restoreMarker(this.data.getCurrent().marker,infoW); f()})
	}
	//=== Search / Filter
	search(evt) {this.filterPoints();}
	showSB(toshow) {if (toshow) {this.searchBox.show()} else {this.searchBox.hide()}}
  filterPoints() {
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
      html = html+"<br>"
      html = html+"<input type='submit' id='applySearch' value='Apply'>"
      html = html+"<input type='submit' id='clearSearch' value='No Filters'>"

      this.searchBox.setContent(html+"<div id='closeSearch' class='hide'>&#10540;</div>",true);

      // set the boxes
      for (var i=0;i<this.tags.length;i++)  document.getElementById(this.tags[i].tag+"Tag").checked = this.tags[i].on;
      document.getElementById('closeSearch').addEventListener("click", function() {this.showSB(false)}.bind(this));
      document.getElementById('applySearch').addEventListener("click", function() {this.doSearch()}.bind(this));
      document.getElementById('clearSearch').addEventListener("click", function() {this.clearSearch()}.bind(this));

      this.showSB(true);
  }
  clearSearch() {
    this.showSB(false)
    for (var i=0;i<this.markers.length;i++) this.markers[i].setMap(this.map.getMap())  // put all markers back on the map
    for (var i=0;i<this.tags.length;i++) this.tags[i].on = true               // all tags are being shown
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
      	try{
        	var intersect = filters.filter(x => this.data.getN(this.markers[i].dataIndex).Tags.includes(x))
 //       	console.log("Setting",this.markers[i],this.map.getMap())
        	if (intersect.length > 0) {this.markers[i].setMap(this.map.getMap())}
        	else {this.markers[i].setMap(null)}
      	} 
      	catch(err) {console.log("tag error",i);this.markers[i].setMap(null)}
      }
  }
}


//===== Description Layer

class WebLayer extends Layer {
	constructor(name,type,parent,player,data) {
		super(name,type,parent,player,data)
	    this.element.style.backgroundColor = "#FFFFFF"
	    this.element.style.opacity = 0.9
	}
	showPage(url,index) {
		this.element.innerHTML = "<iframe src="+url+"?idx="+index+" width=\"100%\" height=\"100%\"/>"
		this.showStack()
	}
}

class WebLayerControls extends Layer {
	constructor(name,type,parent,player,data) {
		super(name,type,parent,player,data)
		this.element.style.pointerEvents = "none"
		this.closeControl = new Control("x","95%","5%",this.close.bind(this),this.element)
	}
	close() {this.playerEvent('close',{})}
}


//==== Picture Layers

class PicLayer extends Layer {
	constructor(name,type,parent,player,data) {
		super(name,type,parent,player,data)
		this.canvas = new CanvasCtrl(this.element)
	}
	init() {
		try {this.canvas.first(this.data.getCurrentPicture().img); 
		     this.getCtrl().showInfo()
		     return true;
		}
		catch (err) {console.log("No Pics?",err); this.hideStack(); return false}
	}
	finish() {this.hideStack();}  // this.sshow.stop()
}

class PicLayerControls extends Layer {
	constructor(name,type,parent,player,data) {
		super(name,type,parent,player,data)
		this.element.style.pointerEvents = "none"
		this.leftControl = new Control("&#10094;","2%","50%",this.left.bind(this),this.element)
		this.rightControl = new Control("&#10095;","95%","50%",this.right.bind(this),this.element)
		this.closeControl = new Control("&#10540;","95%","5%",this.close.bind(this),this.element)
		this.playControl = new Control(">>","2%","5%",this.play.bind(this),this.element)
		this.playing = false
		this.timer = null

		this.caption = new InfoWindow("caption","4%",false,this.element)
		this.notes   = new InfoWindow("notes","8%",true,this.element)
	}
	left() 				{this.move(-1)}
	right() 			{this.move(1)}
	play() 				{this.playing ? this.pause() : this.resume()}
	pause()  			{clearInterval(this.timer); 						this.playControl.setText(">>"); this.playing = false}
	resume() 			{this.timer = setInterval(()=>this.move(1),5000); 	this.playControl.setText("||"); this.playing = true }
	move(n) 			{this.data.findNextPictureIndex(n); this.getBase().canvas.next(this.data.getCurrentPicture().img); this.showInfo();}
	close() 			{this.playerEvent('close',{}); this.playing = false;} //if(this.playing) this.play()}
	setCaption(c) {this.caption.setContent(c,false);}
	setNotes(n) 	{this.notes.setContent(n,true)}
	closeNotes() 	{this.notes.close()}
	showInfo() {
		if ('caption' in this.data.getCurrentPicture())
			this.setCaption(this.data.getCurrent().Name+": "+this.data.getCurrentPicture().caption)
		else this.setCaption(this.data.getCurrent().Name)
		if ('note' in this.data.getCurrentPicture()) 
			this.setNotes(this.data.getCurrentPicture().note) 
		else {this.closeNotes()}
	}

}

class CanvasCtrl {
  constructor(cv) {
    this.one = {img: null, scale:0, x:0, y:0, w:0, h:0},
    this.two = {img: null, scale:0, x:0, y:0, w:0, h:0}
    this.transition = 0
    this.step = 3
    this.switch = this.TfadeIn

    // canvas elements, including b1 and b2 'offscreen'
    this.cv = cv; this.cv.width = window.innerWidth; this.cv.height = window.innerHeight;
    this.ctx = this.cv.getContext('2d')
    this.clear()

    this.transition = {percent:0}
  }

  loadImg(img,dst) {
      var scale = Math.min(this.cv.width/img.width,this.cv.height/img.height)
      var x = (this.cv.width/2)-(img.width/2) * scale
      var y = (this.cv.height/2)-(img.height/2)*scale
      dst.img = img; dst.x = x; dst.y = y; dst.w = img.width*scale; dst.h = img.height*scale;
  }

  TfadeIn() {
//     this.ctx.fillStyle = 'black'
//     this.ctx.fillRect(0,0,this.cv.width,this.cv.height);
     try {
     	this.ctx.globalAlpha = 1-this.transition/100;
     	this.ctx.filter = "blur(60px)"
     	this.ctx.drawImage(this.one.img,0,0,window.innerWidth,window.innerHeight)
     	this.ctx.filter = "blur(0px)"
     	this.showImg(this.one);
     } catch {}

     try {	// second image may not be loaded
     	this.ctx.globalAlpha = this.transition/100;
     	this.ctx.filter = "blur(60px)"
     	this.ctx.drawImage(this.two.img,0,0,window.innerWidth,window.innerHeight)
     	this.ctx.filter = "blur(0px) drop-shadow(-5px 5px 3px #aaa)"
     	this.showImg(this.two);
     } catch {}
  }

  intervalStep() {
  	  this.transition += this.step; 
  	  this.switch()
 //     this.TfadeIn();
      if (this.transition < 100) requestAnimationFrame(this.intervalStep.bind(this))
      else this.doSwap()
  }

  loadSrc(entry,dst,f) 	{var img = new Image; img.src = entry;  img.onload = function() {this.loadImg(img,dst); f()}.bind(this) }
  showImg(ptr) 					{this.ctx.drawImage(ptr.img, ptr.x, ptr.y, ptr.w, ptr.h)}
  doSwap()     					{for (var key in this.one) {this.one[key] = this.two[key]}}
  nextStart() 					{this.transition=0; requestAnimationFrame(this.intervalStep.bind(this))}
  next(src) 						{this.loadSrc(src, this.two, () => {this.nextStart()})}
  first(src) 						{this.clear(); this.loadSrc(src, this.two, () => {this.nextStart()});}
  clear()								{this.ctx.fillStyle='black'; this.ctx.fillRect(0,0,this.cv.width,this.cv.height);}
}

//==== Video Layers

class VidLayer extends Layer {
	constructor(name,type,parent,player,data) {
		super(name,type,parent,player,data)
		this.vids = []
		this.index = -1
	}
	setVids(v) {
		if (v.length==0) {this.getCtrl().close(); return false;}
		this.vids = v
		this.index = 0
		this.display()
		return true
	}
	display() {
		this.element.innerHTML = "<iframe id=\"ifvid\" src=\""+this.vids[this.index].vid+"\" width=\"100%\" height=\"100%\" allow=\"autoplay\"></iframe>"
	}
	next() {}
	prev() {}
}

class VidLayerControls extends Layer {
	constructor(name,type,parent,player,data) {
		super(name,type,parent,player,data)
		this.element.style.pointerEvents = "none"
		this.leftControl = new Control("&#10094;","5%","50%",this.left.bind(this),this.element)
		this.rightControl = new Control("&#10095;","95%","50%",this.right.bind(this),this.element)
		this.closeControl = new Control("&#10540;","95%","5%",this.close.bind(this),this.element)
	}
	left() {this.getBase().next()}
	right() {this.getBase().prev()}
	close() {this.playerEvent('close',{})}
}

//==== A stack of co-dependent layers

class LayerStack {
	constructor (type,parent,player,data) {
		this.player = player
		this.data = data
		this.parent = parent
		this.stack = {}
		switch(type) {
		case "map":  
			this.stack['base'] = new MapLayer('map','div',parent,player,data)
			this.stack['ctrl'] = new MapLayerControls ('mapc','div',parent,player,data)
			break;
		case "web":  
			this.stack['base'] = new WebLayer('web','div',parent,player,data)
			this.stack['ctrl'] = new WebLayerControls ('webc','div',parent,player,data)
			break;
		case "pics":  
			this.stack['base'] = new PicLayer('pic','canvas',parent,player,data)
			this.stack['ctrl'] = new PicLayerControls ('picc','div',parent,player,data)
			break;
		case "vids":  
			this.stack['base'] = new VidLayer('vid','div',parent,player,data)
			this.stack['ctrl'] = new VidLayerControls ('vidc','div',parent,player,data)
			break;			
		}
		for (const [k,v] of Object.entries(this.stack)) v.setStack(this.stack)
	}
	show() {for (const [k,v] of Object.entries(this.stack)) v.show()}
	hide() {for (const [k,v] of Object.entries(this.stack)) v.hide()}
	get(n) {return this.stack[n]}
	getStack() {return this.stack}
}


// === Holds all Layers

class LayerStackList {
	constructor(player,data) {
		this.player = player
		this.data = data
		this.element = document.body
		this.stacks = {
      		 map :	new LayerStack('map' ,this.element,player,data),
      		 web :  new LayerStack('web' ,this.element,player,data),
     		   pics:  new LayerStack('pics',this.element,player,data),
      		 vids:  new LayerStack('vids',this.element,player,data),
      		}
	}
	getStack(n) {return this.stacks[n]}
	getStackLayer(n,m) {return this.stacks[n].get(m)}
	show(n) {console.log("LSL show "); this.stacks[n].show()}
	showOnly(layer) {console.log("LSL show only"); for (const [k,v] of Object.entries(this.stacks)) (k==layer)?v.show():v.hide()}
	hide(n) {console.log("LSL hide"); this.stacks[n].hide()}
	hideOnly(layer) {console.log("LSL hide only"); for (const [k,v] of Object.entries(this.stacks)) (k==layer)?v.hide():v.show()}
}


//==== The player


class Player {
	constructor() {
		this.state = {}
		this.data = new TheData(AllData,this)

		this.stacks = new LayerStackList(this,this.data)

		this.contentOrder = ["Overlay","Page","Pics","Vids"]
		this.contentIndex = -1

		this.sShow = false
	}

	init(welcome) {
		var mapObject = new MapObject(this.stacks.getStack('map'))
		mapObject.init()
		this.stacks.getStackLayer('map','base').setMap(mapObject)
		this.stacks.getStackLayer('map','ctrl').mapReady()
		this.stacks.show('map')
		if(welcome) {this.stacks.getStackLayer('web','base').showPage("./Maui/Data/welcome.html")}
		this.contentIndex = -1;
	}

	dispatchContent() {
		this.contentIndex++
		while ((this.contentIndex < this.contentOrder.length) && !this.data.has(this.contentOrder[this.contentIndex])) this.contentIndex++
		if (this.contentIndex >= this.contentOrder.length) {this.contentIndex = -1; return false}	
		switch(this.contentOrder[this.contentIndex]) {
		case 'Overlay': 
			this.stacks.getStackLayer('map','base').getMap().showOverlay(this.data.getOverlay())
			break;
		case 'Page':
			this.stacks.getStackLayer('web','base').showPage(this.data.getPage())
			break;
		case 'Pics':
			if (this.stacks.getStackLayer('pics','base').init())
			this.stacks.showOnly('pics')
			break;
		case 'Vids':
			if (this.stacks.getStackLayer('vids','base').setVids(this.data.getVids()))
			this.stacks.showOnly('vids')
			break;
		}
		return true;
	}

	event(f,t,d) {	// from, type, data
		console.log("Event",f,t,d, "SS:",this.sShow)
		if (f=='webc' && t=='close' && !this.data.ready()) {this.stacks.showOnly('map'); return;}  // Welcome screen closed
		if (this.sShow && t=='close') {console.log("END SS"); this.slideShow(false); return;}
		if (t=='marker') this.data.setCurrent(d.index)	// marker was clicked on map
		if (!this.dispatchContent()) this.reset()
	}

	reset() {this.stacks.getStackLayer('map','base').getMap().clean(); this.stacks.showOnly('map')}
//	hide(n) {this.stacks[n].hide()}
//	show(n) {this.stacks[n].show()}
	currentData() {return this.data.getCurrent()}
	slideShow(b) {
		this.sShow = b; 
		if (b) { // start
			console.log("In player, starting slideshow")
			this.data.findNextPictureIndex(0)
			this.stacks.getStackLayer('pics','base').init()
			this.stacks.getStackLayer('pics','ctrl').play()
			this.stacks.showOnly('pics')
		}
		else {
			console.log("In player, stopping slideshow")
			this.stacks.getStackLayer('pics','ctrl').pause()
			this.stacks.showOnly('map')
		}
  }
	isSlideShow() {return this.sShow}
	slideShowMapChange() {	
		this.stacks.getStackLayer('pics','ctrl').pause()		// pause pictures 
		this.stacks.showOnly('map')													// switch to the map view  *** should also show slideshow controls??
		this.stacks.getStackLayer('map','ctrl').runTransition(this.slideShowMapChangeDone.bind(this))
	}
	slideShowMapChangeDone() {
		this.stacks.getStackLayer('pics','ctrl').resume()
		this.stacks.showOnly('pics')
	}
}


//===== Data Management

class TheData {
	constructor(data,player) {
		this.data = data
		this.player = player
		this.index = -1  // Current data Index
		this.contentIndex = 0

		this.tags = []
		this.tagsonly = []
		this.parseTags()
	}
	ready() {return (this.index >= 0)}
	getCurrent() {return this.data[this.index]}
	getN(n) {return this.data[n]}
	setCurrent(c) {this.index = c; if (c >= this.data.length) this.index=0; if (c < 0) this.index = 0;}
	incIndex() {this.index++; if (this.index >= this.data.length) this.index = 0;}
	decIndex() {this.index--; if (this.index < 0) this.index = this.data.length-1;}
	next() {this.incIndex(); return this.getCurrent()}
	prev() {this.decIndex(); return this.getCurrent()}

	has(n) {return n in this.data[this.index]}
	hasPage() {return "Page" in this.data[this.index]}
	getPage() {return this.data[this.index].Page.url}
	getOverlay() {return this.data[this.index].Overlay}
	getVids() {return this.data[this.index].Vids}
	name() {return this.data[this.index].Name}

	// pictures
	hasPics() {try {return this.data[this.index].Pics.length > 0} catch {return false}}
	getPics() {return this.data[this.index].Pics}
	advanceToPics() {
		this.index++; 
		while (!("Pics" in this.data[this.index]) || (this.data[this.index].Pics.length < 1)) this.index++
		this.player.slideShowMapChange()
	}  // do map animation
	findNextPictureIndex(n) {
		if (!this.ready()) this.index=0  // if SlideShow is called before any marker is clicked.
		try {this.contentIndex += n
			if (this.contentIndex < 0) this.contentIndex = this.data[this.index].Pics.length-1; 
			if (this.contentIndex >= this.data[this.index].Pics.length) {this.contentIndex = 0; if (this.player.isSlideShow()) this.advanceToPics()}
			return true
		} catch (err){this.contentIndex = 0; if (this.player.isSlideShow()) this.advanceToPics(); return false}
	}
	getCurrentPicture(n) {return this.data[this.index].Pics[this.contentIndex];}

  parseTags() {
    for (var i=0;i<this.data.length;i++) {
          try { for (var j=0;j<this.data[i].Tags.length;j++) {
                   var yy = this.tagsonly.findIndex(e=>e===this.data[i].Tags[j])
                   if (yy<0) 
                     {this.tags.push({"tag":this.data[i].Tags[j], "on":true, "cnt":0, "seen":0})
                      this.tagsonly.push(this.data[i].Tags[j]) }      
                   else {
                     this.tags[yy].cnt = this.tags[yy].cnt + 1
                     try {if (this.data[i].Status.visited) this.tags[yy].seen = this.tags[yy].seen+1} catch{}}
                 }
               }
          catch {}
     }
  }
  getTags() {return this.tags}
}