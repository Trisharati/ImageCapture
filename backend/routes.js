const router = require('express').Router()
const multer = require('multer')
const { uploadImage, viewGallery, deleteImage } = require('./controller')

const formdataParser = multer().fields([])
router.use(formdataParser)
router.post('/storeimage',uploadImage)
router.get('/view-gallery',viewGallery)
router.get('/delete-image/:id',deleteImage)

module.exports = router