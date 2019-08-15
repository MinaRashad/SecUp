var http = require('http')
var fs = require('fs')
var qs = require('querystring')
var en = require('./ENCRYPTOnode')
var serverE = require('./serverEssentials')


var server = http.createServer((req,res)=>{
    camfile = `cam_${(req.url).substr(1)}.secup`

    fs.access(camfile,(err)=>{
    POSTdata = null
    //console.log(req.headers)
    if((req.method).toUpperCase() == 'POST'){
        body = ''
        req.on('data',(data)=>{
            body+=data
    
            if(body.length >= 1e6){
                req.connection.destroy()
            }
        })
    
        req.on('end',()=>{
            POSTdata = qs.parse(body)
            
            processPOST(POSTdata,req,res)

        })
    }

        if(err){
            console.log('Camera does not exist or not logged in yet')
            res.write('Camera does not exist or not logged in yet')
            res.end()
            return 0
        }
        let people = fs.createReadStream(camfile,'utf-8')
        people.pipe(res)
    })
    
})

    
let processPOST = (data,req,res)=>{
    camfile = `cam_${(req.url).substr(1)}.secup`
    if(data){
        if(data.peopleOnCamNow){
            fs.writeFileSync(camfile,data.peopleOnCamNow)  
        
        }else{
            console.log(`UnExcepected Data:. 
            peopleOnCamNow=>${data['peopleOnCamNow']}`)
        }
        

    }else{
        console.log('Empty POST request')
        res.end()

}
}











port = 2999           // an available port
hostIP = '127.0.0.1'   // Here we should change the IP depending on the network




server.listen(port, hostIP)
console.log(`Listining at ${hostIP}:${port}`) //Show which ip&port is listenig to
