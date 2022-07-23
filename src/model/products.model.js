// ______________________________________ IMPORTS START ________________________

const mongoose = require('mongoose');


// ______________________________________ IMPORTS END  ________________________
// ______________________________________ SCHEMA START  _______________________

const ProductSchema = new mongoose.Schema({

    name : {
        type:String,
        required:true
    },
    created_at : {
        type : Date,
        required : true,
        default : Date.now()
    },
    price:{
        type:Number,
        required:true
    },
    category: [{
        type:String
    }],
    img :{
        data:Buffer,
        contentType:String,       
    },
    brand : {
        type:String
    }
});

// ______________________________________ SCHEMA END  ____________________________
//  _____________________________________ MODEL METHODS START _____________________

ProductSchema.methods = {

};

//  _____________________________________ MODEL METHODS END ______________________
//  _________________________________________ EXPORTS _____________________________
const Product = module.exports = mongoose.model('Product', ProductSchema);