var createError = require('http-errors');
 var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var db = require('./config/connection')
 var userRouter = require('./routes/user');
var adminRouter = require('./routes/admin');
const Handlebars = require('handlebars')
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')


 var app = express();
 var session = require('express-session')
 var fileupload = require('express-fileupload') 
 app.use(fileupload())
 app.use(session({secret:'key',cookie:{maxAge:600000,},resave:false,saveUninitialized:true}))

var {engine}  = require('express-handlebars');
const { isRegExp } = require('util/types');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.engine('hbs',engine({extname:'hbs',defaultLayout:'layout',layoutsDir:__dirname+'/views/layout/',partialsDir:__dirname+'/views/partials/',handlebars: allowInsecurePrototypeAccess(Handlebars)}))
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
db.connect((err)=>{
  if(err) console.log("Mongodb connection error "+err)
  else console.log("Database connected to port 27017")
})  




  
 app.use('/',userRouter)
app.use('/admin',adminRouter );

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

 module.exports = app;
 
 


