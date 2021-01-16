const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const keys = require("../../config/keys")

const validateSignUpInput = require("../../validation/signup")
const validateSignInInput = require("../../validation/signin")

const User = require("../../models/User")

router.post("/register",(req,res) => {
    const {errors,isValid} = validateSignUpInput(req.body)
    if(!isValid){
        return res.status(400).json(errors)
    }

    User.findOne({email:req.body.email})
    .then(user => {
        if(user){
           return res.status(400).json({email:"Email already registered"})
        }else{
            const newUser = new User({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password
            })
            
            bcrypt.genSalt(10,(err,salt) => {
                bcrypt.hash(newUser.password, salt,(err,hash)=> {
                    if(err)throw err;
                    newUser.password = hash;
                    newUser.save()
                    .then(doc => {
                        res.status(200).json({user:doc})
                        console.log("User succeffuly created")
                    })
                    .catch(err => {
                        res.status(400).json({error: "Error creating new user"})
                        console.log(err)
                    })
                })
            })
        }
    })
})


router.post("/login", (req,res) => {
    const {errors,isValid} = validateSignInInput(req.body)
    if(!isValid){
        return res.status(400).json(errors)
    }

    const email = (req.body.email)
    const password = (req.body.password)

    User.findOne({email})
    .then(user => {
        if(!user){
            return res.status(400).json({emailnotfound:"Email not found"})
        }

        bcrypt.compare(password,user.password)
        .then(isMatch => {
            if(isMatch){
                const payload = {
                    id:user._id,
                    name: user.name
                }

                jwt.sign(payload,keys.SECRET,{ expiresIn:31556926 }, (err,token) => {
                    if(err){
                        res.status(400).json({token:"Token creation failed"})
                    }else{
                        res.status(200).json({
                            success: true,
                            token: "Bearer " + token
                        })
                    }
                })
            }else{
                res.status(400).json({passwordincorect: "Password incorect"})
            }
        })
    })
    
})

module.exports = router