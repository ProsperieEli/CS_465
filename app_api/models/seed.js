//bring in the DB connection and the Trip schema

const mongoose = require('./db');
const Trip = require('./travlr');

// Seed the database with initial data
var fs = require('fs');
var trips = JSON.parse(fs.readFileSync('./data/trips.json', 'utf8'));

const seedDB = async () => {
    await Trip.deleteMany({});
    await Trip.insertMany(trips);
};

//close the MongoDB connection and exit
seedDB().then(async () => {
    console.log('Database seeded successfully');
    await mongoose.connection.close();
    process.exit(0);
});