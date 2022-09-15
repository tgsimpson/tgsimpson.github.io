

try {var AllData = window.parent.AllData[0]}
catch {

	var waitvar = false

	function loadScript () {
    	return new Promise((resolve, reject) => {
      	const script = document.createElement('script')
      	script.type = 'text/javascript'
      	script.async = true
      	script.src = `../AllData.json`
      	document.head.append(script);
      	script.addEventListener('load',()=>{waitvar = true; resolve(script)})
      	script.addEventListener('error',()=>{console.log("ERROR LOADING");reject()})
	})}
    
    async function doLoad() {
    	const result = await loadScript();
    	console.log("Should be loaded now...");
    }

   doLoad();
}