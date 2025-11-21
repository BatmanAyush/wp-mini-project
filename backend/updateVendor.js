const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Product = require("./models/Product");

dotenv.config();


// ---------------------------------------------------------
// 1. PASTE YOUR ADMIN USER ID HERE
// ---------------------------------------------------------
const MY_ADMIN_ID = "691f292a15f1716152d609eb"; 
// ^ I copied this from the "auth" data you showed me earlier.
// Double check it matches your user ID if you recreated the user!

const updateAllProducts = async () => {
  try {
    console.log("1. Connecting to DB...");
    await mongoose.connect(process.env.MONGO_URL);
    console.log("   DB Connected!");

    console.log("2. Finding products...");
    const count = await Product.countDocuments({});
    console.log(`   Found ${count} products in the database.`);

    console.log(`3. Updating all products to Vendor ID: ${MY_ADMIN_ID}...`);
    
    // Using updateMany with $set to force the field existence
    const result = await Product.updateMany(
      {}, // Filter: Select ALL documents
      { 
        $set: { vendorId: MY_ADMIN_ID } 
      },
      { upsert: false } // Safety check
    );

    console.log("------------------------------------------------");
    console.log(`Matched Documents: ${result.matchedCount}`);
    console.log(`Modified Documents: ${result.modifiedCount}`);
    console.log("------------------------------------------------");

    if (result.modifiedCount > 0) {
        console.log("✅ SUCCESS! The Vendor ID has been added.");
    } else {
        console.log("⚠️  WARNING: No documents were changed. They might already have this ID.");
    }

    mongoose.connection.close();
  } catch (error) {
    console.error("❌ ERROR:", error);
    mongoose.connection.close();
  }
};

updateAllProducts();