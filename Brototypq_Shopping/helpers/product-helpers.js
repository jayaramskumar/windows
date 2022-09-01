var db = require('../config/connection')
var collection = require('../config/collections')
const { promise, reject } = require('bcrypt/promises')
const { ObjectId } = require('mongodb')
var objectId = require('mongodb').ObjectId
module.exports={
     addProduct:(product,callback)=>{
         db.get().collection('product').insertOne(product).then((data)=>{
             console.log(data)
             callback(data.insertedId)
         })
     },
     getAllProducts:()=>{
         return new Promise(async (resolve,reject)=>{
            let products= await db.get().collection('product').find().toArray()
            resolve(products)
         })
     },
     deleteProduct:(prodId)=>{
                return new Promise((resolve,reject)=>{
                    db.get().collection('product').remove({_id:objectId(prodId)}).then((response)=>{
                        console.log(response)
                        resolve(response)
                    })
                })
             },

    getProductDetails:(proId)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection('product').findOne({_id:ObjectId(proId)}).then((product)=>{
                resolve(product)
            })
        })
    },
       
    updateProduct:(proId,proDetails)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection('product').updateOne({_id:ObjectId(proId)},{
                $set:{
                    Name:proDetails.Name,
                    Description:proDetails.Description,
                    Category:proDetails.Category,
                    Price:proDetails.Price
                }
            }).then((response)=>{
                resolve()
            })
        })
    }
     
 }