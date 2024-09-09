import User  from "../models/user.model.js";
import jwt from 'jsonwebtoken' ; 
import { generateToken, setCookies , storeRefreshToken } from "../lib/utils/generateToken.js";
import { redis } from "../lib/utils/redis.js";
import bcrypt from 'bcryptjs' ; 

export const signUp = async (req, res) => {
    try {
        const { name, password, email, gender } = req.body;

        if (!name || !password || !email || !gender) {
            return res.status(400).json({ message: 'Please fill all the fields' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email.match(emailRegex)) {
            return res.status(400).json({ message: 'Please enter a valid email address' });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters long' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({ name, password: hashedPassword, email, gender });
        await user.save();

        const { accessToken, refreshToken } = generateToken(user._id);
        await storeRefreshToken(user._id, refreshToken);
        setCookies(res, refreshToken, accessToken);

        res.status(201).json({ message: 'User created successfully', user });
    } catch (err) {
        console.error(err.message); 
        res.status(500).json({ message: 'Internal server error' });
    }
};


export const signIn = async (req,res) => {
    try {
        console.log(req.body) ; 
        const {email , password} = req.body ; 
    if(!email || !password) {
        return res.json({message : 'Please Email and Password'}) ; 
    }
    const user = await User.findOne({email}) ; 
    if(!user) {
        return res.json({message : 'User Not Found'}) ; 
    }
    const isMatch = await bcrypt.compare(password,user.password) ;
    if(!isMatch) {
        return res.json({message : 'Incorrect Email or Password'}) ; 
    }
    const  { refreshToken , accessToken } =  generateToken(user._id) ;
    setCookies(res,refreshToken,accessToken) ;
    await storeRefreshToken(user._id,refreshToken)  ;
    return res.json({message : 'logged In Success', user : {
        ...user._doc ,
        password : undefined  
    }  }) ;

}catch(err) {
    console.log(err.message) ;  
    return res.json({ message : err.message}) ; 

} 
}

export const getMe = async (req,res) => {
    try {
        const UserId = req.userId ;
        const user = await User.findById(UserId).select('-password') ;
        if(!user) {
            return res.json({message : 'User Not Found'}) ; 
        }
        res.json({ user }) ; 


    }catch(err) {
        console.log(err.message) ; 
    }
}

export const LoggedOut = async (req,res) => {
    try {
        const refreshToken = req.cookies.refreshToken ;
        if(!refreshToken) {
            return res.json({message : 'No refresh token provided'}) ;
        }
        const decoded = jwt.verify(refreshToken,process.env.REFRESH_TOKEN_SECRET) ; 
        await redis.del(`refresh_token:${decoded}`) ; 
        res.clearCookie('accessToken') ; 
        res.clearCookie('refreshToken') ;
        res.json({message : 'Logged Out Successfully'}) ;
    }catch(err) {
        console.log(err.message) ; 
    }
}

export const refreshToken = async (req,res) => {
    try {
        const refreshToken = req.cookies.refreshToken ;
        if(!refreshToken) {
            return res.json({message : 'No refresh token provided'}) ;
        }

        const decoded = await jwt.verify(refreshToken,process.env.REFRESH_TOKEN_SECRET) ; 
        const user = await User.findById(decoded.id) ;
        if(!user) {
            return res.json({message : 'User Not Found'}) ; 
        }

        const refreshFromRedis = await redis.get(`refresh_token:${decoded.id}`) ;
        console.log(refreshFromRedis) ;
        if(refreshFromRedis!== refreshToken) {
            return res.json({message : 'Invalid refresh token'}) ; 
        }
        const accessToken = jwt.sign({id : user._id},process.env.ACCESS_TOKEN_SECRET) ;
        
        res.cookie('accessToken',accessToken,{
            httpOnly : true,
            secure : process.env.NODE_ENV === 'production',
            sameSite : 'lax',
            expires : new Date(Date.now() + 1000 * 60 * 15) // 15 min
        });
    return res.json({message : 'Access token refreshed'}); 
        
    }catch(err) {
        console.log(err.message) ; 
    }
 
}


