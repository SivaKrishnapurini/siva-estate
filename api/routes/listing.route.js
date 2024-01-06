const express = require('express')
const router = express.Router()

const verifyUser = require('../utils/verifyUser.js')
const { CreateListing, ListData, getCreatedList, deleteData, getEditData, getUpdateData, getSearchData, messageUpdate } = require('../controller/listing.controller.js')

router.post('/create-listing', verifyUser, CreateListing)
router.get('/createdData/:id', verifyUser, ListData)
router.get('/getListData/:id', verifyUser, getCreatedList)
router.get('/deleteData/:id', verifyUser, deleteData)
router.get('/getEditData/:id', verifyUser, getEditData)
router.post('/getUpdateData/:id', verifyUser, getUpdateData)
router.get('/search', getSearchData)
router.post('/messages/:id', verifyUser, messageUpdate)
module.exports = router