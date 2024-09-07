import Stripe from "stripe";
import env from 'dotenv' ; 

env.config() ;


export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY) ; 