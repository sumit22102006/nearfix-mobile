const jwt = require("jsonwebtoken");

const generateToken = (user) =>{
    return jwt.sign(
        {
            userid: user._id,
            roles:user.roles,
        },

        process.env.JWT_SECRET,


        {
            expiresIn:"7d"
        }
    );
};

module.exports = generateToken;