import User  from "../models/user.model.js";
import bcryptjs from 'bcryptjs';
import { generateToken, setCookies , storeRefreshToken } from "../lib/utils/generateToken.js";
import { redis } from "../lib/utils/redis.js";
export const signUp =  async (req,res) => {
    try {
    const { name , password , email , gender  } = req.body  ; 

    if(!name || !password || !email || !gender) {
        return res.send({message : 'Please fill all the fields'}) ;
    }
    //misty going to check if there is exsit user already
    const existingUser = await User.findOne({ name }) ;
    if(existingUser) {
        return res.send({ message : 'User already exists'})  ; 
    }
    //misty going to check email format
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
     
    if(!email.match(emailRegex)) {
        res.json({error : 'please enter a valid email address'}) ; 
        return ; 
    }

    if(password.length < 6 ) {
        console.log('Please enter a valid password > 6') ; 
       return  res.json({error : 'password must be at least 6 characters long'}) ; 
        
    }

    //misty going the hash the password 

    const HashedPassword = await bcryptjs.hashSync(password,10) ; 

    
    const user = new User({ name  , password : HashedPassword , email , gender }) ;
    if(user) {
        const  { accessToken, refreshToken } =  generateToken(user._id) ; 
        console.log(accessToken, refreshToken) ;

        await storeRefreshToken(user._id, refreshToken) ;

        setCookies(res,refreshToken,accessToken) ;     
        await user.save() ; 
        res.send({message : 'User created successfully' ,  user : user}) ; 
    }
    else {
        res.status(500).send('There is error while creating the user') ;

    }
    
    }catch(err) {
        console.log(err.message) ; 
    }

    
}


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
    const isMatch = await bcryptjs.compare(password,user.password) ;
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
        const id = jwt.verify(refreshToken,process.env.REFRESH_TOKEN_SECRET) ; 
        await redis.del(`refresh_token:${id}`) ; 
        res.clearCookie('accessToken') ; 
        res.clearCookie('refreshToken') ;
        res.json({message : 'Logged Out Successfully'}) ;
    }catch(err) {
        console.log(err.message) ; 
    }
}


