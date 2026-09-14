const Category = require("../models/Category");

const getCategories = async(req , res) =>{
    try{

        const categories = await Category.find({
            isActive:true,

        }).sort({
            name:1,
        });

        res.json({
            count: categories.length,
            categories,
        });
    }catch (error){
        console.log(error);

        res.status(500).json({
            message:"Server error"
        });
    }
}

module.exports = {
    getCategories,
}