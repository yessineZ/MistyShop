import User from "../models/user.model.js";

export const checkAdmin = async (req,res,next) => {
    try {
        const Id = req.userId ; 
        const user = await User.findById(Id) ;
        console.log('admin check') ; 
        if(!user || user.role !== 'admin') {
            return res.json({message : 'Unauthorized'}) ;
        }
        next() ;
    }catch(err) {
        console.log(err.message) ;
        return res.status(500).json({message: 'Internal server error'}) ;
    }

} 