const User = require('../model/accounts.model'); 
const jwt = require('jsonwebtoken');
const AccountsModel = require('../model/accounts.model');

//  Creating new user
const createUser = async (req, res) => { 

        let newUser = new User(req.body); 
    
        newUser.setPassword(req.body.password); 
        
        newUser.save((err, User) => { 
            if (err) { 
                return res.status(400).send({
                    "error" : err.message
                });
            } 
            else { 
                User.save(newUser);
                return res.send("Registration Successful"); 
            } 
        }); 
        
    }; 



// User Login and Token Generator
const loginUser =  (req, res) => { 

    // Find user with requested email 
    User.findOne({ email : req.body.email }, function(err, user) { 
        if (user === null) { 
            return res.status(400).send({ 
                error : "User not found."
            }); 
        } 
        else { 
            if (user.validPassword(req.body.password)) { 

                const token = jwt.sign({
                    id : user._id,
                }, process.env.JWT_SECRET);

                res.cookie("token", token, { expire: new Date() + 9999 }, { sameSite: 'None', secure: true});
                return res.status(201).send({ 
                    isLoggedin : true
                }) 
            } 
            else { 
                return res.status(400).send({ 
                    isLoggedin : false
                }); 
            } 
        } 
    }); 
}

// User Logout
const logoutUser = (req, res) => {
    res.clearCookie("token")
    res.send("Logged out")
}


//getUser
const getUser = (req, res)=>{

    const userID = (jwt.verify(req.cookies.token, process.env.JWT_SECRET)).id;

    AccountsModel.findOne({_id:userID}, (err, user)=>{
        if(err){
            return res.send(err.message)
        }

        if (!user){
            return res.send("No business found")
        }

        return res.send(user);
    })
}

//Change Password
const changePassword = (req, res)=>{

    const userID = (jwt.verify(req.cookies.token, process.env.JWT_SECRET)).id;

    AccountsModel.findOne({_id:userID}, (err, user)=>{
        if(err){
            return res.send(err.message)
        }
    
        if (!user){
            return res.send("No business found")
        }

        if(req.body.oldPassword===req.body.newPassword){
            return res.send('Old and new password are same')
        }
    
        if(req.body.newPassword!==req.body.confirmPassword){
            return res.send('Passwords do not match')
        }
        if (!business.validPassword(req.body.oldPassword)){
            return res.send('OLD password is wrong')
        }

        user.setPassword(req.body.newPassword);
        user.save((err,result)=>{
            if(err){
                return res.send(err.message)
            }
            return res.send(result)
        })
    })
}


//Delete User
const deleteUser = (req, res)=>{
    const userID = (jwt.verify(req.cookies.token, process.env.JWT_SECRET)).id;
    AccountsModel.deleteOne({__id :userID}, (err)=>{
        if (err){
            return res.send(err.message)
        }
        return res.send("User Deleted")

    })
}








const AccountsController = {
    createUser,
    loginUser,
    logoutUser,
    deleteUser,
    getUser,
    changePassword
}

module.exports = AccountsController;