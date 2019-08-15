const http = require('http');
const fs = require('fs')
const qs = require('querystring')
const en = require('./ENCRYPTOnode')

const readPOSTrequest = (req)=>{
    body = ''
    post = ''
    req.on('data',(data)=>{
        body+=data

        if(body.length >= 1e6){
            req.connection.destroy()
        }
    })

    req.on('end',()=>{
        post = qs.parse(body)
    })
    
}


var css = (req, res) => {
      var file = fs.readFileSync(`.${req.url}`, {'encoding' : 'utf8'});
      res.writeHead(200, {'Content-Type' : 'text/css'});
      res.write(file);
      res.end();
  }
var js = (req,res) =>{
    res.writeHead(200,{'Content-Type':'text/javascript'})
    var file = fs.readFileSync(`.${req.url}`,'utf-8')
    res.write(file)
    res.end()
}
var html = (req,res) =>{
    res.writeHead(200, {'Content-Type':'text/html'})
    var file = fs.readFileSync(`.${req.url}`,'utf-8')
    res.write(file)
    res.end()
}


var login = (data,db)=>{
    let name = data.name;
    let pass = data.pass;
    let database = getDataBase(db)
    let user = ''
    let correctPass = false
    for(let member of database){
        if(name == member[0] && en.SHA1(pass) == member[1]){
            user = name
            correctPass = true
            break;
        }else if(name == member[0] && en.SHA1(pass) != member[1]){
            user = name
            correctPass = false
            break;
        }
    }
    if(!user){
        console.error(`no user found with this name: ${name}`)
        return false
    }else if (!correctPass) {
        console.error('Wrong Password!')
        return false
    } else if(user && correctPass){
        console.log(`Hello ${name}!!!`)
        return true
    }

}

var signup = (data,db)=>{
    let name = data.name
    let pass = data.pass
    let database = getDataBase(db)
    let userExist = false
    let success = true
    for (let member of database) {
        if(member[0] == name){
            userExist = true
        }
    }
    if(userExist){
        console.log('Sorry name Taken')
        success = false
        return success
    }else{
        fs.readFile(db,'utf-8',(err,data)=>{
            if(err)console.log(err)
            let newMember = `${name}:${en.SHA1(pass)}\n`
            fs.writeFile(db,data+newMember,(err)=>{
                if(err)console.log(err)
            })
        })
        return success
    }
}

getDataBase = (database)=>{
    let data = fs.readFileSync(database,'utf-8')
    let datas = []
    counter = 0
    for(let char in data){
        if(data[char] == '\n'){
            datas.push(data.slice(counter,char))
            counter = char
            
        }
    }
    datas = datas.join(',\n').split('\n').join('').split(',')
    for(let e in datas){
        datas[e] = datas[e].split(':')
    }
    return datas
    
}

exports.html = html
exports.css = css
exports.js = js
exports.readPOSTrequest = readPOSTrequest
exports.login = login
exports.signup = signup
exports.getDataBase = this.getDataBase
