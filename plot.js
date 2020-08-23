console.log('plot.js loaded')

plot={}

plot.draw=async(obj,fname,div='plotDiv')=>{
    console.log(`drawing ${obj}`)
    if(typeof(obj)=='string'){
        obj = await(await fetch(obj)).json()
        console.log(`${obj} loaded`)
    }
    if(typeof(div)=='string'){
        div=document.getElementById(div)
        console.log('looking for', div)
    }
    if(typeof(div)=='undefined'){
        div=document.createElement('div')
        div.id=div
        console.log(div,'created')
    }
    // clear div
    div.innerHTML=''
    div.className=''
    // draw figure in child div
    let divPlotly = document.createElement('div')
    div.appendChild(divPlotly)
    Plotly.plot(divPlotly,obj.traces,obj.layout)
    // export traces as csv
    let divTools = document.createElement('div')
    div.appendChild(divTools)
    divTools.innerHTML=`<a href="#" onclick="plot.extractTraces(obj.traces,'${fname}')">${fname}</a>`

    //debugger
}
plot.extractTraces=(traces,fname)=>{
    debugger
}

plot.saveFile=function(x,fileName) { // x is the content of the file
	var bb = new Blob([x]);
   	var url = URL.createObjectURL(bb);
	var a = document.createElement('a');
   	a.href=url;
	if (fileName){
		if(typeof(fileName)=="string"){ // otherwise this is just a boolean toggle or something of the sort
			a.download=fileName;
		}
		a.click() // then download it automatically 
	} 
	return a
}


if(typeof(define)!='undefined'){
    define(plot)
}
