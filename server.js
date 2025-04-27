var express = require('express')
var app = express()
var path =require('path')
var fs = require('fs')
var crypto=require('crypto')

var rootFolder = path.join(__dirname)

function loadUsers(){
    try{
        var content=fs.readFileSync("user_data.json",{'encoding':'utf8'})
        var parsedContent=JSON.parse(content)
        var usernameArray=parsedContent['username']
        var passwordArray = parsedContent['password']
        var userTypeArray = parsedContent['userTypeArray']
        var result=[]
        for (var i=0;i<usernameArray.length;i++){
            var obj={'username':usernameArray[i], 'password':passwordArray[i], 'userType':userTypeArray[i]}
            result.push(obj) 
        }
        return result
    }catch(err){
        console.log(err)
        return[]
    }
}

userList=loadUsers()

function checkLogin(username, password){
    for (var i=0; i<userList.length;i++){
        var user=userList[i]
        var hashedPass=crypto.createHash('sha256').update(password).digest('hex')
        if((user.username==username)&&(user.password==hashedPass)){
            return true
        }   
    }
    return false
}

function checkAdmin(username){
    for (var i=0; i<userList.length; i++){
        var user = userList[i]
        if((user.username==username)&&(user.userType==admin)){
            return true
        }
    }
    return false
}

app.get("/home", function(req,res){
    res.sendFile(path.join(rootFolder, 'home.html'))
})

app.get('/style.css', function(req, res){
    res.sendFile(path.join(rootFolder, 'style.css'))
})

app.get('/source.js', function(req,res){
    res.sendFile(path.join(rootFolder, "source.js"))
})

app.post('/home', express.json(), function(req, res){
    if(checkAdmin(req.body.username)){
        res.sendFile(path.join(rootFolder, 'home_admin.html'))
    }
    else{
        res.sendFile(path.join(rootFolder, 'home.html'))
    }
})

app.post('/create_user', express.json(), function(req,res){
    res.sendFile(path.join(rootFolder, "create_user.html"))
})

app.post('/create_action', express.urlencoded({'extended':true}), function(req,res){
    var hashedPass=crypto.createHash('sha256').update(req.body.password).digest('hex')
    userList.push({'username':req.body.username, 'password':hashedPass, 'userType':req.body.usertype})
    try{
        var content =fs.readFileSync("user_data.json",{'encoding':"utf8"})
        var parsedContent=JSON.parse(content)
        var usernameArray=parsedContent["username"]
        usernameArray.push(req.body.username)
        var passwordArray= parsedContent["password"]
        passwordArray.push(hashedPass)
        var userTypeArray=parsedContent["userType"]
        userTypeArray.push(req.body.usertype)
        try{
            fs.writeFileSync("user_data.json",JSON.stringify(parsedContent),{'encoding':"utf8"})
        }catch(err){
            console.log(err)
        }
    }catch(err){
        console.log(err)
    }
    if(req.body.userType==admin && req.body.admincode=="1234"){
        res.sendFile(path.join(rootFolder,"create_action.html"))
    }
    else if(req.body.userType==user){
        res.sendFile(path.join(rootFolder,"create_action.html"))
    }
    else{
        res.sendFile(path.join(rootFolder,"create_action_failure.html"))
    } 
})

app.post('/login', express.json(), function(req,res){
    res.sendFile(path.join(rootFolder, "login.html"))
})

app.post('/lgn_action', express.urlencoded(), function(req,res){
    if(checkLogin(req.body.username, req.body.password)){
        res.sendFile(path.join(rootFolder, "lgn_action.html"))
    }
    else{
        res.sendFile(path.join(rootFolder, "lgn_action_failure.html"))
    }
})

app.post("/view", express.json(), function(req,res){
    
})

app.post('/about', express.json(), function(req,res){
    res.sendFile(path.join(rootFolder, "about.html"))
})

app.post('/contact', express.json(), function(req,res){
    res.sendFile(path.join(rootFolder, "contact.html"))
})

app.post('/cont_action', express.urlencoded(),function(req,res){
    var content =fs.readFileSync("contact_data.json",{'encoding':"utf8"})
    var parsedContent=JSON.parse(content)
    var usernameArray=parsedContent["username"]
    usernameArray.push(req.body.username)
    var emailArray = parsedContent["email"]
    emailArray.push(req.body.email)
    var phoneArray = parsedContent["phone"]
    phoneArray.push(req.body.phone)
    var feedbackArray = parsedContent["feedback"]
    feedbackArray.push(req.body.feedback)
    try{
        fs.writeFileSync("contact_data.json",JSON.stringify(parsedContent),{'encoding':"utf8"})
    }catch(err){
        console.log(err)
    }
    res.sendFile(path.join(rootFolder, "contact_action.html"))
})

app.listen(8080, function(){})