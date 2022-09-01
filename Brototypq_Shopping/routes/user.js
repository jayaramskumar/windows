const { response } = require('express');
var express = require('express');
const async = require('hbs/lib/async');
var router = express.Router();
const productHelpers = require('../helpers/product-helpers');
const userHelpers = require('../helpers/user-helper')
const verifylogin=((req,res,next)=>{
  if(req.session.loggedIn){ 
    next()
  }else{
    res.redirect('/login')
  }
})

// /* GET home page. */

router.get('/',async function(req, res, next) {
  let user = req.session.user
  //console.log(user)
  let cartCount=null
  if(req.session.user){
     cartCount = await userHelpers.getCartCount(req.session.user._id)
  }
 
  productHelpers.getAllProducts().then((products)=>{
    res.render('user/view-products',{products,user,cartCount})
    console.log(req.session)
  })
});

router.get('/login',(req,res)=>{
  if(req.session.loggedIn){
      res.redirect('/')
  }else{
    res.render('user/login',{loginErr:req.session.loginErr})
    req.session.loginErr=false
  }
})

router.get('/signup',(req,res)=>{
  res.render('user/signup')
})

router.post('/signup',(req,res)=>{
  //console.log("hello")
  userHelpers.doSignup(req.body,((response)=>{
    //console.log(response)
    req.session.loggedIn=true
    req.session.user=response
    res.redirect('/')
  })
  )
})

router.post('/login',(req,res)=>{
  userHelpers.doLogin(req.body,(response)=>{
        if(response.status){
          req.session.loggedIn=true
          req.session.user=response.user
          res.redirect('/')
        }else{
          req.session.loginErr="Invalid Username or password"
          res.redirect('/login')
        }
  })
})

router.get('/logout',(req,res)=>{
  req.session.destroy()
  res.redirect('/')
})

router.get('/cart',verifylogin,async(req,res)=>{
  let total = await userHelpers.getTotalAmount(req.session.user._id)
  let CartItems = await userHelpers.getCartProducts(req.session.user._id)
  let products = CartItems
  //console.log(products)
  res.render('user/cart',{products,user:req.session.user._id,total}) 
})


router.get('/add-to-cart/:id',(req,res)=>{
  //console.log("api called")
  userHelpers.addToCart(req.params.id,req.session.user._id).then(()=>{
   res.json({status:true})
  })
})


router.post('/change-product-quantity',(req,res)=>{
  userHelpers.changeProductQuantity(req.body).then(async(response)=>{
    response.total = await userHelpers.getTotalAmount(req.body.user) 
    res.json(response)
  })
})

router.post('/delete-product',(req,res)=>{
  userHelpers.deleteProductFromCart(req.body).then((response)=>{
     res.json(response)
  })
})

router.get('/place-order',verifylogin,async(req,res)=>{
  let total = await userHelpers.getTotalAmount(req.session.user._id)
  res.render("user/place-order",{total,user:req.session.user})
})
 
router.post('/place-order',async(req,res)=>{
  
 let products = await userHelpers.getCartProductsList(req.body.userId)
 let totalPrice= await userHelpers.getTotalAmount(req.body.userId)
  await userHelpers.placeOrder(req.body,products,totalPrice).then((response)=>{
    res.render("user/order-success")
 })
//  console.log(details)

  //console.log(req.body)
})

router.get('/order-success',(req,res)=>{
  res.render('user/order-success',{user:req.session.user})
})

router.get('/orders',async(req,res)=>{
  let orders = await userHelpers.getUserOrders(req.session.user._id)
  res.render('user/orders',{user:req.session.user._id,orders})
  //console.log(orders)
  
})

router.get('/view-order-products/:id',async(req,res)=>{
  let products = await userHelpers.getOrderProducts(req.params.id)
  res.render('user/view-order-products',{user:req.session.user._id,products})
  //console.log("****")
  //console.log(products)

})


module.exports = router;  