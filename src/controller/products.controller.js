// IMPORTS
multer = require('multer')
const path = require('path')
const fs = require("fs");
const jwt = require('jsonwebtoken');

// MODEL
ProductsModel = require('../model/products.model')
AccountsModel = require('../model/accounts.model')



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


const create = (req,res)=>{

    //Image Buffer
    var img = fs.readFileSync(req.file.path);
    var encode_img = img.toString('base64');


    var productObject = {
        img: {
            data:new Buffer.from(encode_img,'base64'),
            contentType:req.file.mimetype
        },
        price : req.body.price,
        brand: req.body.brand,
        category:req.body.category,
        name:req.body.name,
    };

    

    ProductsModel.create(productObject,function(err,result){
        if(err){
            console.log(err);
        }else{
            console.log("Product Added");
            res.contentType(productObject.img.contentType);
            res.send(productObject.img.data);
        }
    })
}


// ENDPOINT for all images of the business
const allProducts = (req,res) => {

    ProductsModel.find({}, function(err, products){
        return res.send(products)
    })

}

const getProduct = (req,res)=>{

    ProductsModel.findOne({_id:req.params.productID}, function(err, product){
        if(err){
            return res.send(err.message)
        }
        if (!product){
            return res.send("Product do not exist")
        }
        return res.send(product)
    })
}

const deleteProduct = (req, res)=>{
  
    ProductsModel.deleteOne({_id:req.params.productID}, (err)=>{
        if (err){
            return res.send(err.message)
        }
        return res.send("Product Deleted")

    })
}

const getWishlist = (req, res)=> {

    const userID = (jwt.verify(req.cookies.token, process.env.JWT_SECRET)).id;

    AccountsModel.findOne({_id:userID}, (err, user)=>{
        if(err){
            return res.send(err.message)
        }

        if (!user){
            return res.send("No user found")
        }

        ProductsModel.find({_id:user.wishlist}, (err, products)=>{
            if (err){
                return res.send(err.message)
            }
            if (!products){
                return res.send("Empty wishlish")
            }
            
            return res.send(products)
        })
    })
}

const addToWishlist = (req, res)=>{

    const userID = (jwt.verify(req.cookies.token, process.env.JWT_SECRET)).id;

    AccountsModel.findOne({_id:userID}, (err, user)=>{
        if(err){
            return res.send(err.message)
        }

        if (!user){
            return res.send("No user found")
        }

        AccountsModel.findByIdAndUpdate(userID, { "$push": { "wishlist": req.body.productID }}, (err,raw)=>{
            if (err){
                return res.send(err.message)
            }

            return res.send("Added to Wishlist")
        })
    })

}







module.exports = {
    upload,
    create,
    allProducts,
    getProduct,
    deleteProduct,
    getWishlist,
    addToWishlist
}

