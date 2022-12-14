const { response } = require('express');
var express = require('express');
const productHelpers = require('../helpers/product-helpers');
var router = express.Router();


/* GET users listing. */
router.get('/', function(req,res,next) {
  productHelpers.getAllProducts().then((products)=>{
    //res.render(products)
    res.render('admin/view-products',{admin:true,products})
  })

});

router.get('/add-product',function(req,res){
  res.render('admin/add-products')
})

router.post('/add-product',(req,res)=>{
  productHelpers.addProduct(req.body,(id)=>{
    let image = req.files.Image
    image.mv('./public/product-images/'+id+".jpg",(err,done)=>{
      if(!err){
        res.render("admin/add-products")
      }else{
        console.log(err)
      }
    })
   
  })
})

router.get('/delete-product/:id',(req,res)=>{
  console.log(req.params)
  let proId=req.params.id
  productHelpers.deleteProduct(proId).then((response)=>{
    res.redirect('/admin/')
  })
})


router.get('/edit-product/:id',async(req,res)=>{
  let products=await productHelpers.getProductDetails(req.params.id)
  res.render('admin/edit-products',{products}) 
})


router.post('/edit-product/:id',((req,res)=>{
    productHelpers.updateProduct(req.params.id,req.body).then(()=>{
      res.redirect('/admin')
      if(req.files.Image){
        let image=req.files.Image
        image.mv('./public/product-images/'+req.params.id+".jpg")
      }
    })
}))

module.exports = router;
