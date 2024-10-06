// db.js
const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const uri = 'mongodb://root:root@localhost:27017';
        await mongoose.connect(uri);
        console.log('MongoDB connected successfully!');
    } catch (err) {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    }
};

module.exports = connectDB;
