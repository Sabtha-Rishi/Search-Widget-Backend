const jwt = require('jsonwebtoken');
const AccountsModel = require('../model/accounts.model');




const isLoggedin = (req, res, next) => {

    try{
        if (!req.cookies.token){
            return res.send('login required');
        }

        const userID = (jwt.verify(req.cookies.token, process.env.JWT_SECRET)).id
        AccountsModel.findOne({ _id : userID }, function(err, user) { 
            
            if(err) {
                return res.send(err.message);
            }
            next()
        })
        
    } catch {
        res.status(401).json({
          error: ('Invalid request!')
        });
    }
}







const ValidatorMiddleware = {
    isLoggedin,
}

module.exports = ValidatorMiddleware;