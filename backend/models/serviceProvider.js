const mongoose = require("mongoose");

const serviceProviderSchema = new mongoose.Schema(
    {
        userId:{
            type:mongoose.Schema.type.ObjectId,
            ref:"User",
            required:true,
            unique:true,

        },
        categoryId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Category",
            required:true,
        },

        businessName:{
            type:String,
            required:true,
            trim:true,
        },

        description:{
                 
                    type:String,
                    default:"",

                 
        },
        experience:{
            type:Number,
            default:0,
        },

        price:{
            type:Number,
            default:0,

        },

        location:{
            type:{
                type:String,
                enum:["point"],

            },

            coordinates:{
                type:[Number],
                required:true,
            },

            address:{
                type:String,
                default:"",

            },
        },

        isAvailable:{
            type:Boolean,
            default:true,
        },

        isVerified:{
            type:Boolean,
            Default:false,

        },

        rating:{
            type:Number,
            default:0,
        },

        totalReviews:{
            type:Number,
            default:0,
        },
    },
{
    timestamps:true
}

    
);

serviceProviderSchema.index({
    location:"2dsphere",
});

module.exports = mongoose.model(
    "ServiceProvider",
    serviceProviderSchema
)