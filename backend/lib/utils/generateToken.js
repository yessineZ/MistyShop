import jwt from 'jsonwebtoken'  ;
import { redis } from './redis.js';


export const generateToken = (id) => {
    const accessToken = jwt.sign({ id }, process.env.ACCESS_TOKEN_SECRET , {
        expiresIn: '15m',

    });

    const refreshToken = jwt.sign({ id},process.env.REFRESH_TOKEN_SECRET , {
        expiresIn: '7d',
    });

    return { accessToken, refreshToken } ;

}

export const storeRefreshToken = async (userId, refreshToken) => {
    try {
        await redis.set(`refresh_token:${userId}`, refreshToken, 'EX', 60 * 60 * 24 * 7);
    } catch (error) {
        console.error('Error storing refresh token in Redis:', error.message);
    }
};

export const setCookies =  (res,refreshToken,accessToken) => {
    res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge : 60 * 15 * 1000 
    });

    
    res.cookie('refreshToken',refreshToken , {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge : 60 * 60 * 24 * 7 * 1000 
    });

    




}

