const express = require('express');
var router = express.Router();

const app = express();



/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

/* create custom route for aur links */
//res.render(<layout page's name in views folder to render>,<send object to page if you want such as title or ...>)

router.get('/register', function(req, res, next) {
    res.render('register',{
      'title': 'Register'
    });

});


router.get('/login', function(req, res, next) {
    res.render('login',{
        'title': 'Login'
    });
});



router.post('/register',function (req, res, next) {


    // Get Form Values
    var name = req.body.name;
    var email = req.body.email;
    var userName = req.body.username;
    var password = req.body.password;
    var password2 = req.body.password2;

    // Check for Image Field

    if(req.body.profileimage) {

        console.log('Uploading File ...');

        // File Info
        var profileImageOriginalName   = req.files.profileimage.originalname;
        var profileImageName           = req.files.profileimage.name;
        var profileImageMimeType       = req.files.profileimage.mimetype;
        var profileImagePath           = req.files.profileimage.path;
        var profileImageExt            = req.files.profileimage.extension;
        var profileImageSize           = req.files.profileimage.size;

    } else {

        // Set a Default Image
        var ProfileImageName = 'noimage.png';

    }



    // Form Validation
    req.checkBody('name','Name  is required').notEmpty();
    req.checkBody('email','email is required').notEmpty();
    req.checkBody('email','email is not valid').isEmail();
    req.checkBody('username','userName is required').notEmpty();
    req.checkBody('password','password is required').notEmpty();
    req.checkBody('password2','passwords don\'t match').equals(password);

    // Check for Errors
    var errors = req.validationErrors();

    if(errors) {

        res.render('register',{
            errors : errors,
            name:name,
            email:email,
            username:userName,
            password:password,
            profileimage:profileImageName
        });

    } else {

        var newUser = new User({
            name:name,
            email:email,
            username:userName,
            password:password,
            profileimage:profileImageName
        });

        // Create User

        User.createUser(newUser,function (err, user) {
            if(err) throw err;
            console.log(user);
        });

        // Success Message

        req.flash('success','You are now registered and may login');
        res.location('/');
        res.redirect('/');

    }


});

module.exports = router;
