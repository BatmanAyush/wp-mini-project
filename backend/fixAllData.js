const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("./models/User");
const Product = require("./models/Product");

dotenv.config();

// YOUR ID (ansh)
const MY_ID = "691f292a15f1716152d609eb";

const fixEverything = async () => {
  try {
    console.log("1. Connecting to DB...");
    await mongoose.connect(process.env.MONGO_URL);
    console.log("   DB Connected!");

    // --- TASK 1: MAKE ME ADMIN ---
    console.log(`2. Making user ${MY_ID} an Admin...`);
    const userUpdate = await User.findByIdAndUpdate(
      MY_ID,
      { $set: { isAdmin: true } }, // Force it to be TRUE
      { new: true }
    );
    console.log("   User Update Status:", userUpdate ? "✅ Success" : "❌ User Not Found");

    // --- TASK 2: ASSIGN PRODUCTS TO ME ---
    console.log(`3. Assigning all products to Vendor ID: ${MY_ID}...`);
    const productUpdate = await Product.updateMany(
      {}, // Filter: All products
      { $set: { vendorId: MY_ID } }
    );
    console.log(`   Products Updated: ${productUpdate.modifiedCount}`);

    console.log("------------------------------------------------");
    console.log("🎉 EVERYTHING IS FIXED!");
    console.log("You can now use the Admin Dashboard and Vendor features.");
    console.log("------------------------------------------------");

    mongoose.connection.close();
  } catch (error) {
    console.error("❌ ERROR:", error);
    mongoose.connection.close();
  }
};

fixEverything();