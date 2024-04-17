const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
require('dotenv').config()

app.use(cors())
app.use(express.json())

const router = require('./routes')
app.use(router)

const port = process.env.PORT || 6000

mongoose.connect(process.env.DBSTRING)
.then(()=>{
    app.listen(port,(err)=>{
        console.log('server is connected at port 6000');
        if(err){
            console.log('Error in connecting server',err);
        }
    })
}).catch((err)=>{
    console.log('Error in connecting database',err);
})
