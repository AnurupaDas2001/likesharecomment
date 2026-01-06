const express = require('express');
const AuthController = require('../controller/AuthController');
const HomeController = require('../controller/HomeController');
const { AuthCheck } = require('../middleware/Auth');
const router = express.Router();


router.post('/like',AuthCheck,HomeController.like );
router.post('/comment', AuthCheck, HomeController.comment);
router.post('/share', AuthCheck, HomeController.share);

router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.post('/post', AuthCheck, HomeController.post);
router.get('/allposts',HomeController.postall);
router.get('/showposts',AuthCheck, HomeController.getPostCounts);


module.exports = router;
