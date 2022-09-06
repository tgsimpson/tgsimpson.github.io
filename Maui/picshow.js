
class PicShow {
	// Current point in AddData array is  AllDataIndex
	constructor(){
		this.div = document.getElementById("PicShow")
		this.picE = document.getElementById("PicElement")
		this.picD = document.getElementById("PicDesc")
		document.getElementById("prevButton").addEventListener("click", () => this.move(-1));
		document.getElementById("nextButton").addEventListener("click", () => this.move( 1));
		document.getElementById("hideButton").addEventListener("click", () => this.visible(false));
//		document.getElementById("descButton").addEventListener("click", () => this.showDesc(true));

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
			 this.visible(true);
			 return true;
			}
		catch {this.DIndex = -1; this.PIndex = -1; this.pics = []; this.PLength = 0;this.visible(false);return false;}
	}

	visible(b)    {if (b) {this.div.style.display = "block"} else {this.div.style.display = "none"}}

	move(n)		  {this.PIndex += n;
				   if (this.PIndex < 0) this.PIndex = this.PLength-1;
				   if (this.PIndex >= this.PLength) this.PIndex = 0;
				   console.log("showing picture",this.PIndex);
				   this.setImg();
				  }

	setImg()	  {try {this.picE.src = this.pics[this.PIndex].img}
				   catch {this.visble(false)};
				  }
}

const PShow = new PicShow()

//let PS = new PicShow("PicShow");
//PS.setPics(["./one.png","./two.png","./three.png","./four.png"]);
//PS.setDiv();
//PS.visible(true)
