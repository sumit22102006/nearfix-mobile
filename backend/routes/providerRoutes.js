const express = require("express");

const{
    becomeProfessional,
    getMyProviderProfile,
    searchServiceProvider,
} = require("../controller/providerController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();
  
//  ===================  SEARCH PROVIDERS ===============================

router.get(
    "/search",
    searchServiceProvider
);

// =====================  BECOME PROFESSIONAL ===========================
 
router.post(
    "/become",
    authMiddleware,
    becomeProfessional
);


// MY PROVIDER PROFILE

router.get(
    "/me",
    authMiddleware,
    getMyProviderProfile
);

module.exports = router

