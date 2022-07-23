// IMPORTS
multer = require('multer')
const fs = require("fs");
const jwt = require('jsonwebtoken');
const AccountsModel = require('../model/accounts.model');

// MODEL
ProductModel = require('../model/products.model')


// STORAGE
var Storage = multer.diskStorage({
    destination: function (req, file, cb) {
        fs.mkdir('./Files/',(err)=>{
            cb(null, './Files/');
         })
        },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now())
    }
  })

var upload = multer({ storage: Storage })


const uploadFile = (req,res)=>{

    //Image Buffer
    var img = fs.readFileSync(req.file.path);
    var encode_img = img.toString('base64');

    //BusinessID
    const userID = (jwt.verify(req.cookies.token, process.env.JWT_SECRET))

    var productObject = {
        img: {
            data:new Buffer.from(encode_img,'base64'),
            contentType:req.file.mimetype
        },

        name:req.body.name,
        type:req.body.type
    };

    

    ProductModel.create(mediaObject,function(err,result){
        if(err){
            console.log(err);
        }else{
            console.log("Saved To database");
            res.contentType(mediaObject.img.contentType);
            res.send(mediaObject.img.data);
        }
    })
}


// ENDPOINT for all images of the business
const allImages = (req,res) => {
    const userID = (jwt.verify(req.cookies.token, process.env.JWT_SECRET)).id

    ProductModel.find({userID:userID}, function(err, files){
        return res.send(files)
    })

}

const getImage = (req,res)=>{
    const userID = (jwt.verify(req.cookies.token, process.env.JWT_SECRET)).id
    ProductModel.findOne({userID:userID, _id:req.params.mediaID}, function(err, file){
        if(err){
            return res.send(err.message)
        }
        if (!file){
            return res.send("Media do not exist or business do not have access to the media")
        }
        return res.contentType(file.img.contentType).send(file.img.data)
        // return res.send(image.image)
    })
}

const deleteFile = (req, res)=>{
    
    ProductModel.deleteOne({userID :userID, _id:req.params.fileID}, (err)=>{
        if (err){
            return res.send(err.message)
        }
        return res.send("File Deleted")

    })
}







module.exports = {
    upload,
    uploadFile,
    allImages,
    getImage,
    deleteFile
}

