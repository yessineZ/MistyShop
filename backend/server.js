import express from 'express' ; 
import env from 'dotenv'
import authRoute from './routes/auth.routes.js';
import  {ConnectToMongo}  from './database/ConnectToDb.js';
import cookieParser from 'cookie-parser';
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



