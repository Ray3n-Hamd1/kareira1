const mongoose = require('mongoose');
require('dotenv').config();

// MongoDB connection string
const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/kariera';

async function checkConnection() {
  try {
    console.log('Attempting to connect to MongoDB...');
    console.log(`Connection string: ${uri}`);
    
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    console.log('✅ Successfully connected to MongoDB!');
    console.log(`Database name: ${mongoose.connection.name}`);
    
    // Check if we can query the database
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Available collections:');
    
    if (collections.length === 0) {
      console.log('  No collections found. This appears to be a new database.');
    } else {
      collections.forEach(collection => {
        console.log(`  - ${collection.name}`);
      });
    }
    
  } catch (error) {
    console.error('❌ MongoDB connection error:');
    console.error(error);
    console.log('\nPossible solutions:');
    console.log('1. Make sure MongoDB is running on your machine');
    console.log('2. Check if the connection string is correct');
    console.log('3. Verify network connectivity to MongoDB server');
  } finally {
    // Close the connection
    await mongoose.connection.close();
    console.log('Connection closed');
  }
}

checkConnection();
