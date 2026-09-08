const User = require("../models/User");
const Category = require("../models/Category");
const ServiceProvider = require("../models/serviceProvider");

// =====================================================
// BECOME PROFESSIONAL
// =====================================================

const becomeProfessional = async (req, res) => {
    try {
        const userId = req.user.userId;

        const {
            categoryId,
            businessName,
            description,
            experience,
            price,
            location,
        } = req.body;

        // -----------------------------
        // Validate required fields
        // -----------------------------

        if (
            !categoryId ||
            !businessName ||
            !location
        ) {
            return res.status(400).json({
                message:
                    "Category, business name and location are required",
            });
        }

        // -----------------------------
        // Validate location
        // -----------------------------

        if (
            typeof location.latitude !== "number" ||
            typeof location.longitude !== "number"
        ) {
            return res.status(400).json({
                message:
                    "Valid latitude and longitude are required",
            });
        }

        // -----------------------------
        // Check category
        // -----------------------------

        const category = await Category.findOne({
            _id: categoryId,
            isActive: true,
        });

        if (!category) {
            return res.status(404).json({
                message: "Invalid category",
            });
        }

        // -----------------------------
        // Check existing provider
        // -----------------------------

        const existingProvider =
            await ServiceProvider.findOne({
                userId,
            });

        if (existingProvider) {
            return res.status(400).json({
                message:
                    "You are already a professional",
            });
        }

        // -----------------------------
        // Create provider
        // -----------------------------

        const provider =
            await ServiceProvider.create({
                userId,

                categoryId,

                businessName,

                description:
                    description || "",

                price:
                    price || 0,

                experience:
                    experience || 0,

                location: {
                    type: "Point",

                    coordinates: [
                        location.longitude,
                        location.latitude,
                    ],

                    address:
                        location.address || "",
                },
            });

        // -----------------------------
        // Add provider role to user
        // -----------------------------

        await User.findByIdAndUpdate(
            userId,
            {
                $addToSet: {
                    roles: "provider",
                },
            },
            {
                new: true,
            }
        );

        // -----------------------------
        // Get populated provider
        // -----------------------------

        const populatedProvider =
            await ServiceProvider.findById(
                provider._id
            )
                .populate(
                    "categoryId",
                    "name slug icon"
                )
                .populate(
                    "userId",
                    "name email phone"
                );

        // -----------------------------
        // Response
        // -----------------------------

        return res.status(201).json({
            message:
                "You are now a NearFix professional",

            provider:
                populatedProvider,
        });

    } catch (error) {
        console.error(
            "Become professional error:",
            error
        );

        return res.status(500).json({
            message: "Server error",
            error: error.message,
        });
    }
};


// =====================================================
// GET MY PROVIDER PROFILE
// =====================================================

const getMyProviderProfile =
    async (req, res) => {
        try {

            const provider =
                await ServiceProvider.findOne({
                    userId: req.user.userId,
                })
                    .populate(
                        "categoryId",
                        "name slug icon"
                    )
                    .populate(
                        "userId",
                        "name email phone"
                    );

            if (!provider) {
                return res.status(404).json({
                    message:
                        "Professional profile not found",
                });
            }

            return res.json({
                provider,
            });

        } catch (error) {

            console.error(
                "Get provider profile error:",
                error
            );

            return res.status(500).json({
                message: "Server error",
            });
        }
    };


// =====================================================
// SEARCH SERVICE PROVIDERS
// =====================================================

const searchServiceProvider =
    async (req, res) => {

        try {

            const {
                category,
                latitude,
                longitude,
                radius = 10000,
            } = req.query;

            // -----------------------------
            // Validate category
            // -----------------------------

            if (!category) {
                return res.status(400).json({
                    message:
                        "Category is required",
                });
            }

            // -----------------------------
            // Find category
            // -----------------------------

            const categoryData =
                await Category.findOne({
                    slug:
                        category.toLowerCase(),
                    isActive: true,
                });

            if (!categoryData) {
                return res.status(404).json({
                    message:
                        "Category not found",
                });
            }

            // -----------------------------
            // Search providers
            // -----------------------------

            let providers;

            // If latitude and longitude
            // are provided
            if (
                latitude !== undefined &&
                longitude !== undefined
            ) {

                const lat =
                    Number(latitude);

                const lng =
                    Number(longitude);

                const maxDistance =
                    Number(radius);

                // Validate numbers

                if (
                    Number.isNaN(lat) ||
                    Number.isNaN(lng) ||
                    Number.isNaN(maxDistance)
                ) {
                    return res.status(400).json({
                        message:
                            "Invalid latitude, longitude or radius",
                    });
                }

                providers =
                    await ServiceProvider.find({

                        categoryId:
                            categoryData._id,

                        isAvailable: true,

                        location: {
                            $near: {
                                $geometry: {
                                    type: "Point",

                                    coordinates: [
                                        lng,
                                        lat,
                                    ],
                                },

                                $maxDistance:
                                    maxDistance,
                            },
                        },
                    })
                        .populate(
                            "categoryId",
                            "name slug icon"
                        )
                        .populate(
                            "userId",
                            "name phone"
                        );

            } else {

                // -----------------------------
                // Search without location
                // -----------------------------

                providers =
                    await ServiceProvider.find({

                        categoryId:
                            categoryData._id,

                        isAvailable: true,

                    })
                        .populate(
                            "categoryId",
                            "name slug icon"
                        )
                        .populate(
                            "userId",
                            "name phone"
                        );
            }

            // -----------------------------
            // Response
            // -----------------------------

            return res.json({

                count:
                    providers.length,

                category:
                    categoryData.name,

                providers,
            });

        } catch (error) {

            console.error(
                "Search service provider error:",
                error
            );

            return res.status(500).json({
                message: "Server error",
                error: error.message,
            });
        }
    };


// =====================================================
// EXPORT
// =====================================================

module.exports = {
    becomeProfessional,
    getMyProviderProfile,
    searchServiceProvider,
};