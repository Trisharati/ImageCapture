const mongoose = require('mongoose')
const imageSchema = new mongoose.Schema({

    imageString:String
})

module.exports = new mongoose.model('Gallery',imageSchema,'Gallery')