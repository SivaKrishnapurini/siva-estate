const express = require('express');
const router = express.Router();
const { signup, signin, googleSignIn, profileUpdate, logOut } = require('../controller/user.controller.js')
const verifyUser = require('../utils/verifyUser.js')

router.post('/signup', signup);
router.post('/signin', signin);
router.post('/googlesignin', googleSignIn)
router.post('/updateuser/:id', verifyUser, profileUpdate)
router.post('/logout/:id', verifyUser, logOut)

module.exports = router;
