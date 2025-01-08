// Middleware to validate MongoDB ObjectId
const validateObjectId = (req, res, next) => {
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({ 
            message: "Invalid product ID format" 
        });
    }
    next();
};

// Middleware to validate search queries
const validateSearchQuery = (req, res, next) => {
    const queryParams = req.query;
    
    // Check if any query parameters are provided
    if (Object.keys(queryParams).length === 0) {
        return res.status(400).json({ 
            error: "At least one search parameter is required" 
        });
    }

    // Allowed search fields
    const allowedFields = ['name', 'category', 'price', 'description', 'keywords'];
    
    // Validate each query parameter
    for (const key in queryParams) {
        // Check if the field is allowed
        if (!allowedFields.includes(key)) {
            return res.status(400).json({ 
                error: `Invalid search field: ${key}. Allowed fields are: ${allowedFields.join(', ')}` 
            });
        }

        // Validate the value is not empty
        if (!queryParams[key] || queryParams[key].trim() === '') {
            return res.status(400).json({ 
                error: `Search value for ${key} cannot be empty` 
            });
        }

        // Special validation for price
        if (key === 'price') {
            const price = parseFloat(queryParams[key]);
            if (isNaN(price) || price < 0) {
                return res.status(400).json({ 
                    error: "Price must be a valid positive number" 
                });
            }
        }
    }

    next();
};

module.exports = {
    validateObjectId,
    validateSearchQuery
}; 