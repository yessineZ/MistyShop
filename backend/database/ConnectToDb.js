import mongoose from "mongoose"
import env from 'dotenv' ; 


env.config() ; 

export const ConnectToMongo = () => {
    try {
        mongoose.connect(process.env.MONGODB).then(() => {
            console.log("Connected to MongoDB") ;
        });
        console.log(process.env.MONGODB) ; 

    }catch(err) {
        console.error("Failed to connect to MongoDB", err) ;

    }finally {
        mongoose.connection.on("disconnected", () => {
            console.log("MongoDB connection disconnected") ;
        }) ;

    }
}