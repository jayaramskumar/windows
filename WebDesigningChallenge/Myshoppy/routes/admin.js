var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  let product=[
    {
      name:'IPHONE 11',
      category:'Mobile',
      description:'Apple iPhone 11 (64GB)',
      image:"https://m.media-amazon.com/images/I/71tpxtLD0aL._SL1500_.jpg"
    },
    {
      name:'Galaxy M52',
      category:'Mobile',
      description:'Samsung Galaxy M52 5G (ICY Blue, 6GB RAM, 128GB Storage) Latest Snapdragon 778G 5G | sAMOLED 120Hz Display',
      image:"https://m.media-amazon.com/images/I/81-tqKsrTuL._SL1500_.jpg"
    },
    {
      name:'oneplus nord 2',
      category:'Mobile',
      description:'OnePlus Nord 2 5G (Blue Haze, 8GB RAM, 128GB Storage)',
      image:"https://m.media-amazon.com/images/I/61TnX0PmqES._SL1500_.jpg"
    },
    {
      name:'Oppo Reno 6 Pro',
      category:'Mobile',
      description:'Oppo Reno 6 Pro 5G (Aurora, 12GB RAM, 256GB Storage), Medium (CPH2249)',
      image:"https://m.media-amazon.com/images/I/71otei-O3-L._SL1500_.jpg"
    }
  ]
  res.render('admin',{product})
});

router.get('/add-product',(req, res) => {
    res.render('product');
  })

router.post('/admin',(req,res)=>{
  console.log(req.body)
  console.log(req.files.Image)
})
module.exports = router;
