var db = require('../config/connection')
var collection = require('../config/collections')
const bcrypt = require('bcrypt')
const async = require('hbs/lib/async')
const { use, reject } = require('bcrypt/promises')
const { ObjectId } = require('mongodb')
const { response } = require('express')
var objectId = require('mongodb').ObjectId
module.exports={
    doSignup:async(userData,callback)=>{
        //console.log(userData)
            userData.Password= await bcrypt.hash(userData.Password,10)
            //console.log(userData.Password)
            db.get().collection(collection.USER_COLLECTION).insertOne(userData)
            callback(userData)
    },
    doLogin:async(userData,callback)=>{
        let loginStatus = false
        let response={}
        let user=await db.get().collection(collection.USER_COLLECTION).findOne({Email:userData.Email})
        if(user){
             bcrypt.compare(userData.Password,user.Password).then((status)=>{
                 if(status){
                     console.log('Login Successful')
                     response.user=user
                     response.status=true
                     callback(response)
                 }else{
                     console.log('Login Failed')
                     callback({status:false})
                 }
             })
        }else{
            console.log('login failed no such email')
            callback({status:false})
        }
    
    },
    addToCart:((proId,userId)=>{
        let proObj={
            item:objectId(proId),
            quantity:1
        }
        return new Promise(async(resolve,reject)=>{
            let userCart = await db.get().collection(collection.CART_COLLECTION).findOne({user:ObjectId(userId)})
            if(userCart){
                let proExist=userCart.products.findIndex(prodect=> prodect.item==proId)
                if(proExist!=-1){
                    db.get().collection(collection.CART_COLLECTION)
                    .updateOne({user:objectId(userId),'products.item':objectId(proId)},
                    {
                        $inc:{'products.$.quantity':1}
                    }
                    ).then(()=>{
                        resolve()
                    })
                }else{
                    console.log("Cart exist for user")
                    db.get().collection(collection.CART_COLLECTION).updateOne({user:ObjectId(userId)},
                        {
                            $push:{products:proObj}
                        }
                    ).then((response)=>{
                        resolve()
                    })
                }

            }else{
                let CartObj={
                    user:objectId(userId),
                    products:[proObj]
                }
                db.get().collection(collection.CART_COLLECTION).insertOne(CartObj).then((response)=>{
                    resolve()
                })
            }
        })
    }),
    getCartProducts:(userId)=>{
        return new Promise(async(resolve,reject)=>{
            let cartItems = await db.get().collection(collection.CART_COLLECTION).aggregate([
                {
                    $match:{user:objectId(userId)}
                },
                {
                    $unwind:'$products'
                },
                {
                    $project:{
                            item:'$products.item',
                            quantity:'$products.quantity'
                    }
                }, 
                {
                    $lookup:{
                        from:collection.PRODUCT_COLLECTION,
                        localField:"item",
                        foreignField:"_id",
                        as:'product'
                    }
                    
                },
                {
                    $project:{
                        item:1,quantity:1,product:{$arrayElemAt:["$product",0]}
                    }
                }
   
            ]).toArray()
      
             console.log(cartItems)
             resolve(cartItems)
        })
    },
    getCartCount:(userId)=>{
        return new Promise(async(resolve,reject)=>{
            let count = 0
            let cart = await db.get().collection(collection.CART_COLLECTION).findOne({user:ObjectId(userId)})
            if(cart){
                count = cart.products.length
            }
            resolve(count)
        })
    },

    changeProductQuantity:(details)=>{
        details.count=parseInt(details.count)
        details.quantity=parseInt(details.quantity)
        return new Promise((resolve,reject)=>{
            if(details.count==-1 && details.quantity==1){
                db.get().collection(collection.CART_COLLECTION)
                .updateOne(
                    {_id:objectId(details.cart)},
                    {
                        $pull:{products:{item:objectId(details.product)}}
                    }
                    ).then((response)=>{
                        resolve({removeProduct:true})
                    })
            }else{
                db.get().collection(collection.CART_COLLECTION)
                .updateOne({_id:ObjectId(details.cart),'products.item':objectId(details.product)},
                    {
                        $inc:{'products.$.quantity':details.count}
                    }
                    ).then((response)=>{
                        resolve({status:true})
                    })
            }
           
        })
    },
    deleteProductFromCart:((details)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.CART_COLLECTION)
            .updateOne({_id:objectId(details.cart)},
            {
                $pull:{products:{item:objectId(details.product)}}
            }
            ).then((response)=>{
                resolve({productDeleted:true})
            })
            //console.log(details)
        })
    }),
    getTotalAmount:async(userId)=>{
        let userCart = await db.get().collection(collection.CART_COLLECTION).findOne({user:ObjectId(userId)})
        if(userCart){

        return new Promise(async(resolve,reject)=>{
            let total = await db.get().collection(collection.CART_COLLECTION).aggregate([
                {
                    $match:{user:objectId(userId)}
                },
                {
                    $unwind:'$products'
                },
                {
                    $project:{
                            item:'$products.item',
                            quantity:'$products.quantity'
                    }
                }, 
                {
                    $lookup:{
                        from:collection.PRODUCT_COLLECTION,
                        localField:"item",
                        foreignField:"_id",
                        as:'product'
                    }
                },
                {
                    $project:{
                        item:1,quantity:1,product:{$arrayElemAt:["$product",0]}
                    }
                },
                {
                    $group:{
                        _id:null,
                        total:{$sum:{$multiply:[{$toInt:'$quantity'},{$toInt:'$product.Price'}]}}
                    }
                }
            ]).toArray()
      
            // console.log(total[0].total)
             resolve(total[0].total)  
        })
    }
    },
    placeOrder:(order,products,total)=>{
        return new Promise((resolve,reject)=>{
            console.log(order,products,total)
            let status = order['payment-method']==='COD' ? 'placed':'pending'
            let orderObj={
                delieveryDetails:{
                    mobile:order.mobile,
                    address:order.address,
                    pincode:order.pincode
                },
                date:new Date().toLocaleDateString('en-us', { weekday:"long", year:"numeric", month:"short", day:"numeric"}) ,
                userId:ObjectId(order.userId),
                paymentMethod:order['payment-method'],
                products:products,
                totalAmount:total,
                status:status
            }

            db.get().collection(collection.ORDER_COLLECTION).insertOne(orderObj).then((response)=>{
                console.log("order created")
                db.get().collection(collection.CART_COLLECTION).deleteOne({user:objectId(order.userId)})
                console.log("cart cleared")
                resolve()
            })
        })
    },
    getCartProductsList:(userId)=>{
        return new Promise(async(resolve,reject)=>{
            let cart = await db.get().collection(collection.CART_COLLECTION).findOne({user:ObjectId(userId)})
            if(cart){
                resolve(cart.products)
            }else{
                resolve()
            }
        })
    },
    getUserOrders:(userId)=>{
        return new Promise(async(resolve,reject)=>{
            let orders = await db.get().collection(collection.ORDER_COLLECTION)
            .find({userId:objectId(userId)}).toArray()
             resolve(orders)
        })
    },

    getOrderProducts:(orderId)=>{
        return new Promise(async(resolve,reject)=>{
            let orderItems = await db.get().collection(collection.ORDER_COLLECTION).aggregate([
                {
                    $match:{_id:objectId(orderId)}
                },
                {
                    $unwind:'$products'
                },
                {
                    $project:{
                            item:'$products.item',
                            quantity:'$products.quantity'
                    }
                }, 
                {
                    $lookup:{
                        from:collection.PRODUCT_COLLECTION,
                        localField:"item",
                        foreignField:"_id",
                        as:'product'
                    }
                },
                {
                    $project:{
                        item:1,quantity:1,product:{$arrayElemAt:["$product",0]}
                    }
                }
   
            ]).toArray()
            resolve(orderItems)
        })
  
    }
   
}