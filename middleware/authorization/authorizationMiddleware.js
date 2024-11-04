import { User } from "../../model/user/userModel.js";
import { verifyToken } from "../../helpers/jwt/indexJwt.js";
export const auth = async(req, res, next)=>{
    try{
    // getting the token and check if there is user or not

    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        token = req.headers.authorization.split(' ')[1]
    }

    // cheching the token is valid or not
    if(!token){
        return res.status(400).json({
            status: "failure",
            message:"You are not logged in! Please login to get the access"
        })
    }

    //verification of token
    // const decoded = await promisify (jwt.verify) (token, process.env.JWT_SECRET_KEY)
    const decoded = await verifyToken(token, process.env.JWT_SECRET_KEY)
    // console.log(decoded);

    // check if user exists or not
    const user = await User.findById(decoded.id)
    if(!user){
        return res.status(500).json({
            status:"failure",
            message:"The User with the token is no longer exists"
        })
    }
    req.user = user
    next()
    }
    catch(err){
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({
                status: "failure",
                message: "Token expired! Please log in again to get access."
            });
        }

        // Handle other verification errors
        return res.status(500).json({
            status: "failure",
            message: "Failed to authenticate token."
        });
    }
    
}
