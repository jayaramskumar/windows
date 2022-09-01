var db = require('./database')
const bcrypt = require('bcrypt')
const async = require('hbs/lib/async')
const { ObjectId } = require('mongodb')
const { reject } = require('bcrypt/promises')

module.exports={
    CheckUserDetails:(userdata)=>{
        let response={}
        return new Promise(async(resolve,reject)=>{
            let user = await db.get().collection('signupdetails').findOne({username:userdata.username})
            console.log(user)
            if(user){
                var isReal = await bcrypt.compare(userdata.password,user.password)
                if(isReal){
                    response.status=true
                    resolve(response)
                    // req.session.username=user.username
                    // req.session.loggedIn=true
                    // res.redirect('/')
                    console.log('LogIn successful')
                }else{
                    response.status="Invalid password"
                    resolve(response)
                    console.log('Invalid Password')
                    // req.session.loggedIn="Invalid password"
                    // res.redirect('/signIn')
                }
            }else{
                response.status="Username or password error"
                resolve(response)
                console.log('Username or password error')
                // req.session.loggedIn="Username or password error"
                // res.redirect('/signIn')
            }
        })
    },
    testDatabase1:(hello)=>{
        return new Promise(async(resolve,reject)=>{
            let data=await db.get().collection('order').aggregate([
                
                {
                    $match:{}
                },
                {
                    $unwind:'$products'
                },
                {
                    $project:{
                        delieveryDetails:1,userId:1,item:'$products.item'
                    }
                },
                {
                    $lookup:{
                        from:'product',
                        localField:'item',
                        foreignField:'_id',
                        as:'Product-Alexa'
                    }
                },
                {
                    $match:{ item: new ObjectId("6286776a5e92223024509920")}
                },
                {
                    $lookup:{
                        from:"user",
                        localField:"userId",
                        foreignField:"_id",
                        as:"Details"
                    }
                },
                {
                    $unwind:'$Details'
                },
                {
                    $project:{
                        delieveryDetails:1,name:'$Details.Name'
                    }
                }
          
            
            ]).toArray()
            resolve(data)
        })
    },
    testDatabase2:()=>{
        return new Promise((resolve,reject)=>{
            let total=db.get().collection('cart').aggregate([
                {
                    $match:{'_id':ObjectId("628d6f5f435e0f3e0fe330fd")}
                },
                {
                    $unwind:'$products'
                },
                {
                    $project:{
                        item:'$products.item',quantity:'$products.quantity'
                    }
                },
                {
                    $lookup:{
                        from:'product',
                        localField:'item',
                        foreignField:'_id',
                        as:'product'
                    }
                },
                {
                    $unwind:"$product"
                },
                {
                    $group:{
                        _id:null,
                        total:{$sum:{$multiply:[{$toInt:'$quantity'},{$toInt:'$product.Price'}]}}
                    }
                }
            ]).toArray()
            resolve(total)
        })
    },
    testDatabase3:()=>{
        let sample1={
            Fruit:'apple',
            quantity:1
        }
        let sample={
            Fruit:'oarnge',
            quantity:1
        }
        db.get().collection('cart').updateOne({'_id':ObjectId("628d6f5f435e0f3e0fe330fd")},{
        //$push:{test:sample},
         // $inc:{'test.$.quantity':1} //Give second conditon in updateOne
         $pull:{test:{Fruit:'apple'}}
            
        })
    },
    testDatabase:()=>{
            return new Promise(async(resolve,reject)=>{
                let total= await db.get().collection('cart').aggregate([
                    {
                        $match:{
                            user:ObjectId("62866a08bc834ad5f13cf3f0")
                        }
                    },
                    {
                        $lookup:{
                            from:'product',
                            let :{prodList:"$products"},
                            pipeline:[
                                {
                                    $match:{
                                        $expr:{
                                            $in:['$_id','$$prodList.item']
                                        }
                                    }
                                }
                            ],
                            as:'productDetails'
                        }
                    },
                    {
                        $unwind:'$productDetails'
                    }
                ]).toArray()
                resolve(total)
    })
    },
    changeQuantity:(value)=>{
        return new Promise(async(resolve,reject)=>{
            await db.get().collection('cart').updateOne({user:ObjectId("62866a08bc834ad5f13cf3f0"),'products.item':ObjectId("628675b0c0551df85319d0bc")},
                {
                    $inc:{'products.$.quantity':value}
                }
            )
            resolve(true)
        })
    }
}