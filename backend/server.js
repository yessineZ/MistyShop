import express from 'express' ; 
import env from 'dotenv';
import orderRoute from './routes/payment.routes.js' ; 
import couponsRoute from './routes/coupon.route.js'; 
import cartRoute from './routes/cart.routes.js';
import authRoute from './routes/auth.routes.js';
import analyticsRoute from './routes/analytics.routes.js' ; 
import  {ConnectToMongo}  from './database/ConnectToDb.js';
import productsRoute from './routes/products.routes.js' ; 
import cookieParser from 'cookie-parser';
import path from 'path';

const __dirname = path.resolve();

const app =  express() ;
app.use(cookieParser()) ; 
app.use(express.json({limit : '10mb' } )) ; 
app.get('/', (req, res) => {
    res.send('Hello, World!') ;
});



env.config({
    path: './.env'
});



app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`)  
    ConnectToMongo() ; 

});


app.use('/api/auth',authRoute) ;   
app.use('/api/products',productsRoute) ;   
app.use('/api/cart',cartRoute) ; 
app.use('/api/coupons',couponsRoute) ; 
app.use('/api/order',orderRoute) ; 
app.use('/api/analytics',analyticsRoute) ; 




app.use(express.static(path.join(__dirname, 'frontend/dist')));


app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'dist', 'index.html'));
});