const Validator = require('validator')
const isEmpty = require('is-empty')

module.exports = function validateSignInInput (data) {
    let errors = {}

    data.email = !isEmpty(data.email)? data.email : ""
    data.password = !isEmpty(data.password)? data.password : ""

    if (Validator.isEmpty(data.email)) { 
        errors.email = " Email is required "
    }else if (!Validator.isEmail(data.email)){
        errors.email = " Inter a valid email id"
    }

    if (Validator.isEmpty(data.password)) {
        errors.password = "Password is required"
    }
    
    return {
        errors,
        isValid: isEmpty(errors)
    }
}