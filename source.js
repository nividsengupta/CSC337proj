function storeUser(){
    var username=document.getElementById('username').value
    window.localStorage.setItem("username", username)
}

function deleteUser(){
    window.localStorage.setItem("username",null)
    sendReq('/lg_out')
}

function sendReq(url){
    var username =window.localStorage.getItem("username")
    var body = {}
    if(username!=null){
        body={'username':username}
    }
    fetch(url,{
        'headers':{'Content-Type':'application/json'},
        'method':'POST',
        'body': JSON.stringify(body)
    })
    .then(function(res){
        return res.text()
    })
    .then(function(text){
        document.open()
        document.write(text)
        document.close()
    })
    .catch(function(err){
        console.log(err)
    })
}