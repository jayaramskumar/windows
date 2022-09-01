var db = require('./database')
var express = require("express")
var app = express()
var session = require('express-session')
const path = require('path')
const {engine} = require("express-handlebars")
const async = require('hbs/lib/async')
var ObjecId=require('mongodb').ObjectId
const bcrypt = require('bcrypt')
const { response } = require('express')
var functions=require('./functions')


db.connect((err)=>{
    if(err){     
        console.log("Error in connecting to Mongodb",err)
    }else{
        console.log('database connected successfully')
    }
})

app.use(session({secret:'key',cookie:{maxAge:600000},resave:true,saveUninitialized:true}))
app.use(express.urlencoded({extended:false}))
app.set('views',path.join(__dirname,'views'))
app.set('view engine','hbs')
app.engine('hbs',engine({extname:'hbs',defaultLayout:'defaultpage',layoutsDir:'views',partialsDir:'views/partials/'}))  


const verifylogin=(req,res,next)=>{
    if(req.session.loggedIn==true){
        res.render('website',{user:req.session.username})  
    }else{
        next()
    }
}



const showcookie = (req,res,next)=>{
    console.log("cookie :req.session.username",req.session.username)
    console.log("req.session.loggedIn",req.session.loggedIn)
    next()
}

app.use(showcookie)

app.get('/',(req,res)=>{
    res.render('website',{user:req.session.username})
})

app.post('/signedIn',async(req,res)=>{
    functions.CheckUserDetails(req.body).then((response)=>{
        if(response.status==true){
             req.session.username=req.body.username
             req.session.loggedIn=true
             res.redirect('/')
        }else if(response.status=="Invalid password"){
             req.session.loggedIn="Invalid password"
             res.redirect('/signIn')
        }else if(response.status=="Username or password error"){
             req.session.loggedIn="Username or password error"
             res.redirect('/signIn')
        }
    })
})

app.get('/signIn',verifylogin,(req,res)=>{
    res.render('signIn',{value:req.session.loggedIn})
    req.session.loggedIn=""
})

app.get('/signUp',verifylogin,(req,res)=>{  
    res.render('signUp')
})

app.get('/signOut',(req,res)=>{
    req.session.destroy()
    res.redirect('/')
})

app.post('/signUp', async(req,res)=>{
    req.body.password= await bcrypt.hash(req.body.password,10)
    await db.get().collection('signupdetails').insertOne(req.body).then((response)=>{
        req.session.userId=response.insertedId
        res.redirect('/signIn')
    })
})

app.get('/forget',verifylogin,(req,res)=>{
    res.render('forget')
})

app.post('/forget',verifylogin, async(req,res)=>{
    let user = await db.get().collection("signupdetails").findOne({username:req.body.username})
    if(user){
        res.render('newpass',{username:user.username})
    }else{
        res.render('forget',{value:"No such username"})
    }
})

app.post('/newpass',verifylogin, async(req,res)=>{
    newPassword =await bcrypt.hash(req.body.password,10)
    console.log("Newe ",newPassword)
    await db.get().collection("signupdetails").updateOne({username:req.body.username},{
        $set:{
            password:newPassword
        }
    })
    console.log("password updated")
    res.redirect('/signIn')
})

app.get('/test',(req,res)=>{
    res.render('test')
})

app.get('/send',(req,res)=>{
    functions.testDatabase("hello").then((response)=>{
        console.log(response)
    })
   
})

app.get('/add',(req,res)=>{
    res.render("addOrSub")
})

app.get('/increase/:value',(req,res)=>{
    console.log("ajax called")
    functions.changeQuantity(parseInt(req.params.value)).then((response)=>{
        res.json({status:true})
    })
})



app.listen(3001)  




