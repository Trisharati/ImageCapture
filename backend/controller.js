const model = require('./model')

const uploadImage = async(req,res)=>{
console.log('req body',JSON.parse(req.body.image));
let data = await model({imageString:JSON.parse(req.body.image)}).save()
if(data._id){
    res.status(200).json({message:'Picture stored successfully'})
}
else{
    res.status(500).json({message:'Picture not saved successfully'})
}
}

const viewGallery = async(req,res)=>{
    model.find()
    .then((data)=>{
        res.status(200).json({images:data})
    }).catch((err)=>{
        res.status(500).json({Error:err})
    })
}

const deleteImage = async(req,res)=>{
    console.log(req.params.id);
    model.findOneAndDelete({_id:req.params.id})
    .then(()=>{
        console.log('deleted');
        res.status(200).json({message:'Picture Deleted Successfully',status:1})
    }).catch((err)=>{
        res.status(500).json({message:'Failed To Delete the Picture',Error:err})
    })
}



module.exports = {uploadImage,viewGallery,deleteImage}