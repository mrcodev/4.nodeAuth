var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var expressValidator = require("express-validator");
var validator = require("validator");
/*custom module must as following*/
var session = require("express-session");
var passport = require("passport");
var localStrategy = require("passport-local");
var bodyParser = require("body-parser");
var multer = require("multer");
var flash = require("connect-flash");
var mongo = require("mongodb");
var mongoose = require("mongoose");
var db = mongoose.connection;


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// handle file uploads
var upload = multer({ dest: 'uploads/' });
//app.use(multer({dest:'./uploads'}));
app.post('/profile', upload.single('avatar'), function (req, res, next) {
    // req.file is the `avatar` file
    // req.body will hold the text fields, if there were any
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());


//connect-flash and express-messages
app.use(flash());
app.use(function (req, res, next) {
    res.locals.messages = require('express-messages')(req, res);
    next();
});

// handle Express session
app.use(session({
    secret:'secret',
    saveUninitialized: true,
    resave:true
}));

// Passport
app.use(passport.initialize());
app.use(passport.session());


/* ch03 vid 3 19:02 */
/*   ----  you are here   ----   */

//validator
app.use(expressValidator({
    errorFormatter:function (param, msg, value) {
        var namespace = namespace.split('.'),
            root = namespace.shift(),
            formParam = root;

        while (namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param : formParam,
            msg : msg,
            value:value
        };
    }
}));


app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);



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
