const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Product = require("./models/Product");

dotenv.config();

const products = [
  // --- SUNGLASSES ---
  {
    title: "Vintage Polarized Sunglasses",
    desc: "Classic style with modern protection.",
    price: 45.00,
    stars: 5,
    firstImg: "1671795213121sunglasses1PNG.png",
    secondImg: "1671795213121sunglasses2PNG.png"
  },
  {
    title: "Aviator Gold",
    desc: "Stylish gold rimmed aviators.",
    price: 60.00,
    stars: 4,
    firstImg: "1671812610573sunglasses1PNG.png",
    secondImg: "1671812610573sunglasses2PNG.png"
  },
  {
    title: "Retro Black Shades",
    desc: "Timeless black design.",
    price: 35.50,
    stars: 5,
    firstImg: "1671812959741sunglasses1PNG.png",
    secondImg: "1671812959741sunglasses2PNG.png"
  },
  {
    title: "Summer Vibes Eyewear",
    desc: "Perfect for the beach.",
    price: 25.00,
    stars: 3,
    firstImg: "1671813117206sunglasses1PNG.png",
    secondImg: "1671813117206sunglasses2PNG.png"
  },
  {
    title: "Modern Square Frames",
    desc: "Bold look for bold people.",
    price: 55.00,
    stars: 4,
    firstImg: "1671813129683sunglasses1PNG.png",
    secondImg: "1671813129683sunglasses2PNG.png"
  },
  {
    title: "Designer Sunnies",
    desc: "Luxury eyewear.",
    price: 120.00,
    stars: 5,
    firstImg: "1671813231158sunglasses1PNG.png",
    secondImg: "1671813231158sunglasses2PNG.png"
  },
  {
    title: "Sport Performance Glasses",
    desc: "For active lifestyles.",
    price: 80.00,
    stars: 5,
    firstImg: "1671816385699sunglasses1PNG.png",
    secondImg: "1671816385699sunglasses2PNG.png"
  },

  // --- T-SHIRTS ---
  {
    title: "Essential White Tee",
    desc: "100% Organic Cotton.",
    price: 20.00,
    stars: 4,
    firstImg: "1671795723033tshirt1.png",
    secondImg: "1671795723033tshirt2.png"
  },
  {
    title: "Graphic Streetwear Tee",
    desc: "Limited edition print.",
    price: 35.00,
    stars: 5,
    firstImg: "1671795895201tshirt1.png",
    secondImg: "1671795895201tshirt2.png"
  },
  {
    title: "Casual Grey Shirt",
    desc: "Soft blend fabric.",
    price: 18.00,
    stars: 4,
    firstImg: "1671796096274tshirt1.png",
    secondImg: "1671796096274tshirt2.png"
  },
  {
    title: "Urban Fit Tee",
    desc: "Modern cut for city life.",
    price: 28.00,
    stars: 5,
    firstImg: "1672345567830tshirt1.png",
    secondImg: "1672345567830tshirt2.png"
  },

  // --- ELECTRONICS ---
  {
    title: "Pro Smartphone X",
    desc: "Latest flagship model.",
    price: 999.00,
    stars: 5,
    firstImg: "1671816416290phoneimg1.png",
    secondImg: "1671816416290phoneimg2.png"
  },
  {
    title: "Wireless Noise Cancelling Headphones",
    desc: "Immersive sound experience.",
    price: 249.00,
    stars: 5,
    firstImg: "1671816477176headphonesimg1.png",
    secondImg: "1671816477176headphonesimg2.png"
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Connected to DB...");
    
    // Clear old data to avoid duplicates
    await Product.deleteMany({});
    console.log("Cleared existing products...");

    // Insert new data
    await Product.insertMany(products);
    console.log("Added 13 new products from your images!");
    
    mongoose.connection.close();
    console.log("Connection closed.");
  } catch (error) {
    console.log("Error:", error);
  }
};

seedDB();