
class PicShow {
	// Current point in AddData array is  AllDataIndex
	constructor(){
			this.div = document.getElementById("PicShow")
			this.picE = document.getElementById("PicElement")
			this.picD = document.getElementById("PicDesc"); this.picD.style.display="none";
			this.vidE = document.getElementById("VidElement"); this.vidE.style.display="none";
			this.caption = document.getElementById("captionSpot")
			this.descBut = document.getElementById("descButton")
			this.notes = document.getElementById("notesSpot")
			this.search = document.getElementById('selectBox')
			document.getElementById("prevButton").addEventListener("click", () => this.move(-1));
			document.getElementById("nextButton").addEventListener("click", () => this.move( 1));
			document.getElementById("hideButton").addEventListener("click", () => this.hidePane());
			document.getElementById("descButton").addEventListener("click", () => this.showDesc(true)); 
			this.hideNotes();
			this.DIndex = -1; // Index into AllData
			this.PIndex = -1; // Index into picture array
			this.hasPics = false;
			this.pics = [];
			this.PLength = 0;
			this.slideshow = false
	}

	setDIndex(i) {
		    // is this Slide Show?  Don't change DIndex or PIndex
		    console.log("Click",i,AllData[i])
			try {if (AllData[i].Name==="Slide Show") {console.log("SS"); this.slideshow = true; this.slideShowStart();return;}} 
			catch(err){console.log("SlideShowErr",err)}

			this.DIndex = -1; this.PIndex = -1; this.pics = []; this.PLength = 0; this.hidePane();
			try {this.DIndex = i;
				 var dd = AllData[this.DIndex]
				 this.hasPics = ("Pics" in dd && dd.Pics.length>0);
				 if (this.hasPics) {
					 this.pics = dd.Pics; this.PLength = this.pics.length; this.PIndex = 0; 
				     this.setImg(); this.div.style.display = "block";
				 }
				 else {this.picD.style.display="none"; try{this.showDesc(true);} catch{}} // If no pics, try for Page, regardless
				 try {if (dd.Page.display) {this.showDesc(true);}} catch {}				 // If pics, rely on display flag to decide if Page is shown
				 return true;
				}
			catch {this.DIndex = -1; this.PIndex = -1; this.pics = []; this.PLength = 0; this.hidePane(); return false;}
	}

	hideNotes()   {this.notes.style.display="none";}

	showDesc(b)	  {
			if (!b) {this.picD.style.display = "none"; return;};
			if ("Page" in AllData[this.DIndex]) this.descOnly(AllData[this.DIndex].Page.url);
			if ("page" in this.pics[this.PIndex]) this.descOnly(this.pics[this.PIndex].page);
	}

	descOnly(d)   { 
			this.picD.innerHTML = "<iframe src="+d+"?idx="+this.DIndex+" width=\"100%\" height=\"100%\"/>"
			this.picD.style.display = "flex";
			this.div.style.display = "block";
			this.search.style.display = "none"
	}
	

	hidePane() {   // handle both desc iframe and picture block; check desc first
	       if (this.picD.style.display != "none") {  // have two windows open
	       	  this.picD.style.display="none";  // hide the story
	       	  if (this.DIndex >=0 && this.PIndex >= 0) return;  // some pics, so leave main div showing
	       	} 
	       this.div.style.display    = "none";
	       this.search.style.display = "block";
	       this.vidE.innerHTML = "";
	       this.slideshow = false;
	       try {clearInterval(this.interval);} catch {}
	}

	nextImg() {
	   		this.PIndex += 1
	   		console.log("next",this.PIndex,this.DIndex,AllData[this.DIndex]);
	   		if (!("Pics" in AllData[this.DIndex]) || this.PIndex > AllData[this.DIndex].Pics.length) {
	   			this.DIndex++; if (this.DIndex > AllData.length) this.DIndex = 0;
	   			this.PIndex = 0;
	   		} 
	   		console.log("next2",this.PIndex,this.DIndex,AllData[this.DIndex]);
	   		if (!("Pics" in AllData[this.DIndex]) || AllData[this.DIndex].Pics.length <= this.PIndex) return false
	   		console.log("next3")
	   	    return ("img" in AllData[this.DIndex].Pics[this.PIndex])
	}


	move(n)	  { 
		   console.log("move")

		   if (!this.slideshow) {
			   this.PIndex += 1;
			   if (this.PIndex < 0) this.PIndex = this.PLength-1;
			   if (this.PIndex >= this.PLength) this.PIndex = 0;
			   this.setImg();
		   } else {	// usually slideshow mode; only do images
		   	   console.log("Calling next????")
		   	   while (!this.nextImg()) {console.log(".")}
		   	   console.log("and back")
		   	   this.pics = AllData[this.DIndex].Pics
		   	   this.setImg();
		   }
	}

	slideShowStart () {  // starting from last image shown.
			console.log("Starting slideshow")
			if (this.DIndex < 0 ) this.DIndex = 0;
			function tick() {console.log("tick")}
			this.interval = setInterval(()=>{console.log("tick");this.move(1)},5000)
			console.log("interval set")
			this.slideshow = true
			this.move(1);
			this.div.style.display = "block"
	}

	setImg() {
		   try {
			   if ("img" in this.pics[this.PIndex]) 
			   {
			        this.vidE.style.display = "none";
			        try {this.document.getElementById("ifvid").pause();} catch {}
			        try {this.vidE.innerHTML = ""} catch{}
			        this.picE.src = this.pics[this.PIndex].img;
			        this.picE.style.display="block";
			   } 
		       else if ("vid" in this.pics[this.PIndex]) 
		       {
					this.vidE.innerHTML = "<iframe id=\"ifvid\" src=\""+this.pics[this.PIndex].vid+"\" width=\"100%\" height=\"100%\" allow=\"autoplay\"></iframe>"
						this.vidE.style.display="block"
						this.picE.style.display = "none"		
				   }
		       else this.hidePane();

		       var nms = " "+(this.PIndex+1).toString()+"/"+this.PLength.toString();
			   var tag = ""
			   try {tag = AllData[this.DIndex].Tags[0]} catch {}

			   document.getElementById("selectBox").style.display = "none"

				if ("caption" in this.pics[this.PIndex]) 
					{this.caption.innerHTML = AllData[this.DIndex].Name+" "+tag+": "+this.pics[this.PIndex].caption+" "+nms;}
				else {this.caption.innerHTML = AllData[this.DIndex].Name+" "+tag+" "+nms;}

				if ("page" in this.pics[this.PIndex] || "Page" in AllData[this.DIndex]) 
					{this.descBut.innerHTML="Note"; this.descBut.style.display = "block";} 
				else {this.descBut.style.display = "none";}

				// Show story by default
				if ("Page" in AllData[this.DIndex]) {
					this.descBut.innerHTML="<span style=\"color: #00ff00\">&#128214;</span>";
					this.descBut.style.display = "block";}

				if ("note" in this.pics[this.PIndex]) {
					this.notes.innerHTML = "<div id=\"closeNotes\" class=\"hide\">&#10540;</div>"+this.pics[this.PIndex].note;
					document.getElementById("closeNotes").addEventListener("click", () => this.hideNotes());  
					this.notes.style.display = "block";
				} else {this.notes.style.display = "none";}
		   }
		   catch {console.log("Something wrong"); this.hidePane();} // try
	}
}


const PShow = new PicShow()

PShow.descOnly("./Maui/Data/welcome.html")


