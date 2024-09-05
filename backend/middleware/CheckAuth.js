import User from "../models/user.model.js";
import jwt from 'jsonwebtoken' ; 


export const CheckAuth = async (req,res,next) => {
    const token = req.cookies.accessToken;
    
    console.log('checkAuth') ; 
     if(!token) {
        return res.status(401).json({message: 'Not authenticated'}) ;
    }

    //verify token
    try {
        const decoded = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET) ;
        console.log('hello') ;
        console.log(decoded.id) ; 
        const user = await User.findById(decoded.id)  ;
   
        req.userId = user._id ;
        next() ;
    } catch(err) {
        console.error(err) ;
        res.status(500).json({message: 'Token verification failed'}) ;
    }
 
}