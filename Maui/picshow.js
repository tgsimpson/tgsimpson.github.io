
class PicShow {
	// Current point in AddData array is  AllDataIndex
	constructor(){
		this.div = document.getElementById("PicShow")
		this.picE = document.getElementById("PicElement")
		this.picD = document.getElementById("PicDesc"); this.picD.style.display="none";
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
	}

	setDIndex(i) {
		try {this.DIndex = i;
			 this.pics = AllData[this.DIndex].Pics;
			 this.PLength = this.pics.length;
			 this.hasPics = (this.PLength >0);
			 if (this.hasPics) this.PIndex = 0; // by default, first picture
			 this.setImg();
			 this.div.style.display = "block";
			 try {if (AllData[this.DIndex].Page.display) this.showDesc(true);}  
			 catch {console.log("no Page",AllData[this.DIndex]);}
			 return true;
			}
		catch {this.DIndex = -1; this.PIndex = -1; this.pics = []; this.PLength = 0; this.hidePane();return false;}
	}

	hideNotes()   {this.notes.style.display="none";}

	showDesc(b)	  {if (!b) {this.picD.style.display = "none"; return;};
				   if ("Page" in AllData[this.DIndex]) this.descOnly(AllData[this.DIndex].Page.url);
				   if ("page" in this.pics[this.PIndex]) this.descOnly(this.pics[this.PIndex].page);
				  }

	descOnly(d)   { this.picD.innerHTML = "<iframe src="+d+"?idx="+this.DIndex+" width=\"100%\" height=\"100%\"/>"
				   	this.picD.style.display = "flex";
				   	this.div.style.display = "block";
				   	this.search.style.display = "none"
				  }
	

	hidePane()    {// handle both desc iframe and picture block; check desc first
			       if (this.picD.style.display != "none") {  // have two windows open
			       	  this.picD.style.display="none";  // hide the story
			       	  if (this.DIndex >=0 && this.PIndex >= 0) return;  // some pics, so leave main div showing
			       	} 
			       this.div.style.display    = "none";
			       this.search.style.display = "block";
				  }

	move(n)		  {this.PIndex += n;
				   if (this.PIndex < 0) this.PIndex = this.PLength-1;
				   if (this.PIndex >= this.PLength) this.PIndex = 0;
				   this.setImg();
				  }

	setImg()	  {try {this.picE.src = this.pics[this.PIndex].img;
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
				   catch {this.hidePane()};
				  }
}

const PShow = new PicShow()

PShow.descOnly("./Maui/Data/welcome.html")


