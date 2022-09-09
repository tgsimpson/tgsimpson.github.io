
class PicShow {
	// Current point in AddData array is  AllDataIndex
	constructor(){
		this.div = document.getElementById("PicShow")
		this.picE = document.getElementById("PicElement")
		this.picD = document.getElementById("PicDesc")
		this.caption = document.getElementById("captionSpot")
		this.descBut = document.getElementById("descButton")
		document.getElementById("prevButton").addEventListener("click", () => this.move(-1));
		document.getElementById("nextButton").addEventListener("click", () => this.move( 1));
		document.getElementById("hideButton").addEventListener("click", () => this.hidePane());
		document.getElementById("descButton").addEventListener("click", () => this.showDesc(true));

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
			 return true;
			}
		catch {this.DIndex = -1; this.PIndex = -1; this.pics = []; this.PLength = 0;this.hidePane();return false;}
	}

	showDesc(b)	  {if (!b) {this.picD.style.display = "none"; return;};
		// if Page is on main record, use it... otherwise use page (lower case) on image specific one.
				   if ("Page" in AllData[this.DIndex]) {
				   	 this.picD.innerHTML = "<iframe src="+AllData[this.DIndex].Page+" width=\"100%\" height=\"100%\"/>"
				   	 this.picD.style.display = "flex";				   	
				   }
				   if ("page" in this.pics[this.PIndex]) {
				   	 this.picD.innerHTML = "<iframe src="+this.pics[this.PIndex].page+" width=\"100%\" height=\"100%\"/>"
				   	 this.picD.style.display = "flex";
				    }
				  }
	

	hidePane()    {// handle both desc iframe and picture block; check desc first
			       if (this.picD.style.display != "none") {this.picD.style.display="none";return}
			       this.div.style.display="none";
				  }

	move(n)		  {this.PIndex += n;
				   if (this.PIndex < 0) this.PIndex = this.PLength-1;
				   if (this.PIndex >= this.PLength) this.PIndex = 0;
				//   console.log("showing picture",this.PIndex);
				   this.setImg();
				  }

	setImg()	  {try {this.picE.src = this.pics[this.PIndex].img;
						let nms = " "+(this.PIndex+1).toString()+"/"+this.PLength.toString();
						if ("caption" in this.pics[this.PIndex]) {this.caption.innerHTML = AllData[this.DIndex].Name+": "+this.pics[this.PIndex].caption+" "+nms;}
						else {this.caption.innerHTML = AllData[this.DIndex].Name+" "+nms;}
						if ("page" in this.pics[this.PIndex] || "Page" in AllData[this.DIndex]) 
							{this.descBut.style.display = "block";} else {this.descBut.style.display = "none";}
					   }
				   catch {this.hidePane()};
				  }
}

const PShow = new PicShow()

//let PS = new PicShow("PicShow");
//PS.setPics(["./one.png","./two.png","./three.png","./four.png"]);
//PS.setDiv();
//PS.visible(true)
