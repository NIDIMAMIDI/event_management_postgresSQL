import { User } from "../../model/user/userModel.js";
import { LoginHistory } from "../../model/loginHistory/loginHistoryModel.js";
import dotenv from "dotenv";
import { createToken } from "../../helpers/jwt/indexJwt.js";
import { hashPassword, passwordChecking } from "../../helpers/bycrypt/bcryptHelpers.js";
import generator from "generate-password"
import { randomPasswordGenerator } from "../../helpers/password/passwordGeneratorHelpers.js";

dotenv.config({ path: './.env' });

export const signup = async(req, res, next)=>{
    try{
        // Fetching validated from the  authValidator File
        const {email, password, role} = req.body;
        
        // convert the email to the lowercase email
        const loweredEmail  = email.toLowerCase()

        //check if there email is already exists are not
        const existingUser = await User.findOne({email : loweredEmail});
        if(existingUser){
            return res.status(500).json({
                status:"failure",
                message: "User Email is already exits"
            })
        }

        //hash the password with bcrypt module
        const hashedPassword = await hashPassword(password, 12)
        // creating a new user 
        const newUser = await User.create({
            email:loweredEmail,
            password: hashedPassword,
            role
        })
        // creating JWT token and cookie
        const { token, cookieOptions } =  createToken(newUser);

        // save login History
        await LoginHistory.create({
            userId: newUser._id,
            token : token
        })
        res.cookie('jwt', token, cookieOptions);
        // respoinding success
        
        res.status(201).json({
            status:"success",
            message: "User signup registration successfull",
            data:{
                newUser,
                token
            }
        })
    }
    catch(error){
      res.status(500).json({
            status:"failure",
            message:error.message
        })
    }

}


export const login = async(req, res, next)=>{
   try{
         // fetching validated data from the authValidator 
        const {email, password, role} = req.body;

        // converting email to a lowerCase
        const loweredEmail = email.toLowerCase();

        // check if user email exists in database
        const user = await User.findOne({email : loweredEmail})
        // console.log(user);
        if(!user){
            return res.status(500).json({
                status:"failure",
                message: "Invalid email"
            })
        }

        // check if password is correct or not
        const isPAsswordCorrect = await passwordChecking(password, user.password)
        
    
        if(!isPAsswordCorrect){
            return res.status(500).json({
                status: "failure",
                message : "Invalid Password"
            })
        }
        // creating jwt token and cookie
        const {token, cookieOptions} = createToken(user)

        // save the login history
        await LoginHistory.create({
            userId: user._id,
            token:token
        })

        res.cookie('jwt', token, cookieOptions)
        //success response
        // console.log(req.cookies.token);
        res.status(200).json({
            status: "success",
            message:"Login Successfull",
            data:{
                user,
                token
            }
        })
   }
   catch(err){
        res.status(500).json({
            status: "failure",
            message:err.message
        })
   }
}


export const forgotPassWord = async(req, res, next)=>{
    try{
        const {email} = req.body;
        const loweredCaseEmail = email.toLowerCase()
        // check if user exists or not
        const user = await User.findOne({email : loweredCaseEmail})
        if(!user) {
            return res.status(404).json({
                status : "faulire",
                message : "User with this email does not exist"
            })
        }
        // Generating a random password

        const randomPassword = await randomPasswordGenerator()
        console.log(randomPassword);

        // Hashing the random password
        // const hashedPassword = await hashPassword(randomPassword, 12);


        //stroing the hashed random generated password into the database
        user.password = randomPassword
        user.save()

        res.status(200).json({
            status:"success",
            data:{
                generatedPassword : randomPassword
            }
        })
    }
    catch(err){
        res.status(500).json({
            status: "failure",
            message: err.message
        })
    }
}
