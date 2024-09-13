import { redis } from "../lib/utils/redis.js";
import Product from "../models/product.model.js";
import cloudinary from "../lib/utils/cloudinary.js";

export const getAllProducts  = async (req,res) => {
    try {
        const products = await Product.find()  ;

        if(products) {
            return res.json({products: products}) ; 

        }else {
            return res.status(404).json({message : 'No products found'}) ;
        }
    }catch(err) {
        console.error(err) ;
        res.status(500).json({message : 'Failed to get products'}) ;
    }
}


export const getSuggestedProducts = async (req,res) => {
    try { 
        
        //misty getting featured products from redis
        console.log("suggested products") ; 
        let featuredProducts = await redis.get("featured_products") ; 
        
        
        if(featuredProducts) {
            featuredProducts = JSON.parse(featuredProducts) ;
            return res.json({products: featuredProducts}) ;
        }
        

        //if we dont have featured products in redis , we get them from mongodb
        
        featuredProducts = await Product.find({isFeatured: true}).lean()  ;
        if(!featuredProducts) {
            return res.status(404).json({message : 'No featured products found'}) ;
        }

        await redis.set('featured_products', JSON.stringify(featuredProducts) ) ; 
        

        return res.json({featuredProducts}) ;

    }catch(err) {
        console.log(err.message) ; 
        res.status(500).json({message : 'Failed to get suggested products'}) ;

        
    }
}


export const createProduct = async (req,res) => {
    try {
        const { name , description , price , image , category } = req.body ; 
         let cloudinaryResponse = null ; 
         if(image) {
             cloudinaryResponse = await cloudinary.uploader.upload(image, {
                 folder: 'products'
             }) ;
         }
         const product = new Product({
             name,
             description,
             price,
             image: cloudinaryResponse? cloudinaryResponse.url : null,
             category
         });
         await product.save() ;
         return res.status(201).json({message : 'Product Created', product}) ;

    }catch(err) {
        console.error(err) ;
        res.status({message : 'Failed to create product'}) ;
    }
}


export const deleteProduct = async (req,res) => {
    try {
        const { id } = req.params ; 
        const product = await Product.findById(id) ; 
        try {
            if(product.image) {
                const publicId = product.image.split('/').pop().split('.')[0] ; 
                await cloudinary.uploader.destroy(`products/${publicId}`) ;
            }

            }catch(err) {
                console.error(err) ;
                res.status(500).json({message : 'Failed to delete product image'}) ;
            }

        await Product.deleteOne({_id : product._id}) ;
        return res.status(200).json({message : 'Product deleted'}) ;

        
    }catch(err) {
        console.log(err) ; 
        res.status(500).json({message : 'Product not found'}) ;
    }
}


export const getRecommendedProduct = async (req,res) => {
    try {
        const products = await Product.aggregate([
            {
                $sample : { size : 3}
            },
            {
                $project : {
                    _id: 1,
                    name: 1,
                    price: 1,
                    image: 1,
                    category: 1
                }
            }  
        ]);
        return res.json({products}) ;

    }catch(err) {
        console.log(err.message) ; 
        res.status(500).json({message : 'Failed to get recommended products'}) ;
    }
}


export const getProductsByCategory = async (req, res) => {
    try {
        const { category } = req.params ; 
        const products = await Product.find({category}).lean()  ;
        if(!products) {
            return res.status(404).json({message : 'No products found in this category'}) ;
        }
        return res.json({products}) ;
    }catch(err) {
        console.log(err) ; 
        res.status(500).json({message : 'Failed to get products by category'}) ;
    }
}



export const toogleFeaturedProduct = async (req,res) => {
    console.log("in toogle featured product") ; 
    try {
        const { id } = req.params ; 
        const product = await Product.findById(id) ; 
        if(!product) {
            return res.status(404).json({message : 'Product not found'}) ;
        }
        
        product.isFeatured =!product.isFeatured ;
        Promise.all([await product.save(),await updateFeaturedProductFromRedis() ]) ;

        if(!product) {
            return res.status(404).json({message : 'Product not found'}) ;
        }
        return res.json({message : 'Featured product toggled successfully',product}) ;
    }catch(err) {
        console.log(err.message) ; 
        res.status(500).json({message : 'Failed to toggle featured product'}) ;
    }

}


async function updateFeaturedProductFromRedis() {
    try {
        const featuredProducts = await Product.find({isFeatured: true}).lean()  ;
        await redis.set('featured_products', JSON.stringify(featuredProducts) ) ;
    }catch(err) {
        console.log(err.message)  ;
    }

}
