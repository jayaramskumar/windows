const express = require("express")
const app = express()
const path = require("path")
const {engine} = require("express-handlebars")
const moogoose = require("mongoose")
require("./Database")
const DetailModel=moogoose.model("Detail")//Creates a  collection named details
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')
const Handlebars=require('handlebars')
const bodyparser=require("body-parser")
const { Console } = require("console")
app.use(bodyparser.urlencoded({
    extended:true
}))
app.use(bodyparser.json())

app.get('/',function(req,res){
    res.render("Fruits/addOrEdit",{Title:'Enter your Credentials'})
})

app.post('/',(req,res)=>{
    if(req.body._id){
       DetailModel.findByIdAndUpdate({_id:req.body._id},req.body,{new:true},(err,docs)=>{
           if(!err){
               res.redirect('/list')
           }else{
               console.log("Error in updating value "+err)
           }
    })
    }else{
        var Detail = new DetailModel()
        Detail.fullname=req.body.fullname;
        Detail.email=req.body.email;
        Detail.mobile=req.body.mobile;
        Detail.City=req.body.City;
        Detail.save((err,docs)=>{
            if(!err){
                res.redirect("/list")
            }else{
                console.log("Error during insertion ******  "+err)
            }
        })
    }
    console.log(req.body)
})

app.get('/list',(req,res)=>{
    DetailModel.find((err,docs)=>{
        if(!err){
            res.render("Fruits/list",{data:docs})
        }else{
            console.log("Error in retreiving data "+err)
        }
    })
    
})

app.get('/edit/:_id',(req,res)=>{
  //  console.log(req.params) 
    DetailModel.findById(req.params._id,(err,docs)=>{
        if(!err){
            res.render("Fruits/addOrEdit",{prevalue:docs,Title:"Update Student"})
        }else{
            console.log("Error in retrieving previous information "+err)
            
        }
    }

)
})
   
app.get("/delete/:_id",(req,res)=>{
    DetailModel.findByIdAndRemove(req.params._id,(err,docs)=>{
        if(!err){
            res.redirect("/list")
        }else{
            console.log("Error in deleting  item ",err)
        }
    })
})


    


  
app.set("views",path.join(__dirname,"/views"))
app.engine("hbs",engine({extname:"hbs",defaultLayout:"main.hbs",layoutsDir:path.join(__dirname,"/views/layouts/"),handlebars: allowInsecurePrototypeAccess(Handlebars)}))
app.set("view engine","hbs")
app.listen(process.env.PORT || 5000)