console.log('plot.js loaded')

plot={
    data:{}
}

plot.draw=async(obj,fname,div='plotDiv')=>{
    plot.data.fname=fname
    if(typeof(obj)=='string'){
        obj = await(await fetch(obj)).json()
        //console.log(`${obj} loaded`)
    }
    plot.data.obj=obj
    if(typeof(div)=='string'){
        div=document.getElementById(div)
        //console.log('looking for', div)
    }
    console.log('plotting ',fname,obj)
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
    //debugger
    divTools.innerHTML=`<a href="#" onclick="plot.extractTraces(plot.data.obj.traces,'${fname}')">${fname}</a>`
	divTools.innerHTML+=`<br><a href="#" onclick="plot.extractTracesDetailed(plot.data.obj,'traces_${fname}')">traces_${fname}</a>`
	divTools.innerHTML+=`<br><a href="#" onclick="plot.saveFile(JSON.stringify(plot.data.obj),'${fname.slice(0,-4)}.json')">${fname.slice(0,-4)}.json (source data)</a>`
    //debugger
}
plot.extractTraces=(traces,fname)=>{
    // sort by length
    traces.sort((a,b)=>{
        let res=0
        if(a.x.length>b.x.length){
            res=-1
        }else{
            res=1
        }
        return res
    })
    // pack by shared x
    let tt=[['x'].concat(traces[0].x)]
    let currentX=traces[0].x
    traces.forEach(ti=>{
        if(JSON.stringify(ti.x)==JSON.stringify(currentX.slice(0,ti.x.length))){ // don't repeat x column if it is he same
            tt=tt.concat([[ti.name.toString()].concat(ti.y)])
        }else{
            currentX=ti.x
            tt=tt.concat([['x'].concat(ti.x)])
            tt=tt.concat([[ti.name.toString()].concat(ti.y)])
            //debugger
        }
        //debugger
    })
    let csv=''
    for(var i=0 ; i<tt[0].length ; i++){
        csv += tt[0][i]
        for(var j=1 ; j<tt.length ; j++){
            if(i<tt[j].length){
                csv += ','+tt[j][i]
            }    
        }
        csv += '\n'
    }
    plot.saveFile(csv,fname)
    //debugger
}

plot.extractTracesDetailed=(obj,fname)=>{ // separating individual traces while having access to all details in obj
    let csv=''
	// table headers
	let n = obj.traces.length
	let m = Math.max(...obj.traces.map(t=>t.x.length)) // max length of traces
	obj.traces.forEach((tt,i)=>{
		csv+=obj.layout.xaxis.title.text
		csv+=','
		csv+=tt.name
		if(i<(n-1)){
			csv+=','
		}else{
			csv+='\n'
		}
		//debugger
	})
	console.log(csv)
	// table rows
	function defined(x){
		if(typeof(x)=='undefined'){
			return ''
		}else{
			return x
		}
	}
	for(var j=0;j<m;j++){
		obj.traces.forEach((tt,i)=>{
			csv+=`${defined(tt.x[j])},${defined(tt.y[j])}` 
			//debugger
			if(i<(n-1)){
				csv+=','
			}else{
				csv+='\n'
			}
		})
	}
    plot.saveFile(csv,fname)
    //debugger
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
