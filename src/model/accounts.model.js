// ______________________________________ IMPORTS START ________________________

const mongoose = require('mongoose');
const crypto = require('crypto');
const { kStringMaxLength } = require('buffer');

// ______________________________________ IMPORTS END  ________________________
// ______________________________________ SCHEMA START  _______________________

const AccountsSchema = new mongoose.Schema({
    email:{
        type: String,
        required: true,
        unique: true
    },
    name : {
        type: String,
        maxlength : 30,
        required:true
    },
    wishlist : [{
        type: String
    }],
    joined_at :{
        type:Date,
        required: true,
        default:Date.now()
    },
    
    hash : String,
    salt : String
});

// ______________________________________ SCHEMA END  ____________________________
//  _____________________________________ MODEL METHODS START _____________________

AccountsSchema.methods = {

    // Encrypting Password
    setPassword : function(password) { 
    this.salt = crypto.randomBytes(16).toString('hex'); 
    this.hash = crypto.pbkdf2Sync(password, this.salt,  
        100, 64, `sha512`).toString(`hex`); 
    },

    // Decrypting password
    validPassword : function(password) { 
        var hash = crypto.pbkdf2Sync(password,  
        this.salt, 100, 64, `sha512`).toString(`hex`); 
        return this.hash === hash; 
    },
};

//  _____________________________________ MODEL METHODS END ______________________
//  _________________________________________ EXPORTS _____________________________

const Accounts = module.exports = mongoose.model('Accounts', AccountsSchema);