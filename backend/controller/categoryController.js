const Category = require("../models/Category");

const getCategories = async(req , res) =>{
    try{

        const categoies = await Category.find({
            isActive:true,

        }).sort({
            name:1,
        });

        res.json({
            count:categoies.length,
            categoies,
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