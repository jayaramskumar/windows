const express = require("express")
const socketIO = require("socket.io")
var session = require('express-session')
var {engine}  = require('express-handlebars');
var db=require('./database');
const { response } = require("express");
db.connect((err)=>{
    if(err) console.log("Mongodb connection error "+err)
    else console.log("Database connected to port ")
  })  
const server = express()
.use(express.urlencoded({extended:false}))
.use(session({secret:'key',cookie:{maxAge:6000000},resave:false,saveUninitialized:true}))
.get('/',(req,res)=>{
    res.render("login",{error:false})
})
.post('/',(req,res)=>{
    if(req.body.username){
        req.session.username=req.body.username
        console.log("cookie:",req.session.username)
        res.redirect('/message')
    }else{
        res.render("login",{error:true})
    }

})
.get('/message',async(req,res)=>{
    let allMesgs=await db.get().collection("message").find().toArray()
    console.log("Data Retreived")
    console.log(allMesgs)
    res.render('index',{name:req.session.username,mesg:allMesgs})
    console.log("cookie:",req.session.username)
})
.use((req,res,next)=>{
    console.log("cookie:",req.session.username)
    next()
})
.post('/insertInToDb',(req,res)=>{
    return new Promise(async(resolve,reject)=>{
        console.log(req.body)
        await db.get().collection("message").insertOne(req.body).then((response)=>{
            console.log("Data Inserted")
            resolve(true)
        })
    })

})
.get('/message/floor',(req,res)=>{
    res.render('delete')
})
.get('/delete',async(req,res)=>{
    await db.get().collection('message').remove({})
    res.redirect('/message')
    console.log("mesg delete")
})
.set('views',__dirname+'/views')
.set('view engine', 'hbs')
.engine('hbs',engine({extname:'hbs',defaultLayout:'default',layoutsDir:__dirname+'/views'}))
.listen(process.env.PORT||3000) 

const io = socketIO(server)
io.on('connection',(socket)=>{
    console.log("User Connected id:",socket.id)
    socket.on('disconnect',()=> console.log('User Disconnected '))
    socket.on('message',(namedata)=>{
        console.log("message recieved in backend:")
        socket.broadcast.emit('message',(namedata))
        console.log('broadcast send')
    })
})


