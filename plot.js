console.log('census.js loaded')

census={}

census.get=async(q='/data/',apiURL='https://us-central1-nih-nci-dceg-episphere-dev.cloudfunctions.net/episphere_census')=>{ // default returns catalog, could also be, for example census.get('/data/2018/acs/acs1/subject?get=NAME,group(S0101)&for=us:1')
    let url=`${apiURL}?${encodeURIComponent(q)}`
    if(!q.match(/\?/g)){
        url=`${apiURL}?${encodeURIComponent(q)}?date=${Date()}`
    }
    //console.log(`calling ${url}`)
    let res = await (await fetch(url)).text()
    //debugger
    try {
        res=JSON.parse(res)
    }
catch(err) {
    console.log(res)
    }
    return res
}

// example
// census.get('/data/2018/acs/acs1/subject?get=NAME,group(S0101)&for=us:1')
// for debugging with local server: census.get=async(q='/data/',apiURL='http://localhost:3000')

if(typeof(define)!='undefined'){
    define(census)
}
