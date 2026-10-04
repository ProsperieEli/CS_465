const mongoose = require('mongoose');
const Trip = require('../models/travlr'); // Register model
const Model = mongoose.model('trips');

// GET: /trips - lists all trips
// Fetches every record from the database collection


const tripsList = async (req, res) => {
    try {
        const trips = await Model.find({}).exec();
        
        if (!trips || trips.length === 0) {
            return res
                .status(404)
                .json({ message: "No trips found in the database" });
        }
        
        return res
            .status(200)
            .json(trips);
            
    } catch (err) {
        return res
            .status(500)
            .json({ message: "Error retrieving trips list", error: err.message });
    }
};

// GET: /trips/:tripCode - lists a single trip
// Filters by the specific route parameter code
const tripsFindByCode = async (req, res) => {
    try {
        const q = await Model
            .find({ 'code' : req.params.tripCode }) // Return single record
            .exec();

        // Check if the query returned an empty array or null
        if (!q || q.length === 0) { 
            return res
                .status(404)
                .json({ message: `Trip with code '${req.params.tripCode}' not found` });
        } else { 
            return res
                .status(200)
                .json(q);
        }
    } catch (err) {
        return res
            .status(500)
            .json({ message: "Error executing trip search", error: err.message });
    }
};

// Exporting both functions so they can be mapped to your routes
module.exports = {
    tripsList,
    tripsFindByCode
};

