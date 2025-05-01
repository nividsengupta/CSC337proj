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
        if((user.username==username)&&(user.userType=="admin")){
            return true
        }
    }
    return false
}

function checkUser(username){
    for (var i=0; i<userList.length; i++){
        var user = userList[i]
        if((user.username==username)&&(user.userType=="user")){
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
    else if(checkUser(req.body.username)){
        res.sendFile(path.join(rootFolder, 'home_user.html'))
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
    if(req.body.usertype=="admin" && req.body.admincode=="1234"){
        res.sendFile(path.join(rootFolder,"create_action.html"))
    }
    else if(req.body.usertype=="user"){
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
    res.sendFile(path.join(rootFolder, "view.html"))
})

app.post("/view_action",express.json(),function(req,res){
    var posts=``
    try{
        var content = fs.readFileSync("post_data.json", {'encoding':"utf8"})
        var parsedContent=JSON.parse(content)
        var coursesArray = parsedContent["courses"]
        var index = coursesArray.indexOf(req.body.course)
        if(index==-1)res.sendFile(path.join(rootFolder, "view_failure.html"))
        else{
            var postsArray = parsedContent['posts']
            var coursePosts = postsArray[index]
            for (var i=0; i<coursePosts.length; i++){
                post=coursePosts[i]
                posts+=`<div>Post number${i+1}<br>${post}</div>`
            }
            res.send(`
            <!DOCTYPE html><!-Remember to add header and navigation bar->
<html>
    <body>
        <h1>Posts from course ${coursesArray[index]}</h1>
        ${posts}
    </body>
</html>
                `)
        }
        
    }catch(err){
        console.log(err)
    }

})

app.post('/add', express.json(), function(req, res){
    res.sendFile(path.join(rootFolder, 'add.html'))
})

app.post('/add_action', express.json(),function(req,res){
    try{
        var content =fs.readFileSync("post_data.json",{'encoding':"utf8"})
        var parsedContent=JSON.parse(content)
        var coursesArray=parsedContent["courses"]
        var index=coursesArray.indexOf(req.body.course)
        var postsArray = parsedContent["posts"]
        if(index==-1){
            coursesArray.push(req.body.username)
            postsArray.push([req.body.review])
        }
        else{
            postsArray[index].push(req.body.review)
        }
        try{
            fs.writeFileSync("posts_data.json",JSON.stringify(parsedContent),{'encoding':"utf8"})
        }catch(err){
            console.log(err)
        }
    }catch(err){
        console.log(err)
    }
    res.sendFile(path.join(rootFolder, 'add_action.html'))
})

app.post('/delete', express.json(), function(req, res){
    res.sendFile(path.join(rootFolder, 'delete.html'))
})

app.post('/delete_action', express.json(),function(req,res){
    try{
        var content =fs.readFileSync("post_data.json",{'encoding':"utf8"})
        var parsedContent=JSON.parse(content)
        var coursesArray=parsedContent["courses"]
        var index=coursesArray.indexOf(req.body.course)
        var postsArray = parsedContent["posts"]
        if(index==-1)res.sendFile(path.join(rootFolder, 'delete_action_failure.html'))
        else{
            var postIndex =parseInt(req.body.postnumber)-1
            var coursePosts = postsArray[index]
            if(postIndex>=coursePosts.length || postIndex<0)res.sendFile('delete_action_failure.html')
            else{
                coursePosts.splice(postIndex,1)
                try{
                    fs.writeFileSync("posts_data.json",JSON.stringify(parsedContent),{'encoding':"utf8"})
                }catch(err){
                    console.log(err)
                }
            }  
        }
    }catch(err){
        console.log(err)
    }
    res.sendFile(path.join(rootFolder, 'delete_action.html'))
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
    var messageArray = parsedContent["message"]
    messageArray.push(req.body.message)
    try{
        fs.writeFileSync("contact_data.json",JSON.stringify(parsedContent),{'encoding':"utf8"})
    }catch(err){
        console.log(err)
    }
    res.sendFile(path.join(rootFolder, "contact_action.html"))
})

app.get('/message_solved', function(req,res){
    res.sendFile(path.join(rootFolder, 'message_solved.html'))
})
app.post('/msg_action', express.json(), function (req,res){
    var content =fs.readFileSync("contact_data.json",{'encoding':"utf8"})
    var parsedContent=JSON.parse(content)
    var usernameArray=parsedContent["username"]
    var index = usernameArray.indexOf(req.body.username)
    if(index==-1)res.sendFile(path.join(rootFolder, 'message_action_failure.html'))
    else{
        usernameArray.splice(index,1)
        var emailArray = parsedContent["email"]
        emailArray.splice(index,1)
        var messageArray = parsedContent["message"]
        messageArray.splice(index,1)
        try{
            fs.writeFileSync("contact_data.json",JSON.stringify(parsedContent),{'encoding':"utf8"})
        }catch(err){
            console.log(err)
        }
        res.sendFile(path.join(rootFolder, 'message_action.html'))
    }  
})

app.listen(8080, function(){})