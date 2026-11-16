import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Product from '../models/Product.js';
import Category from '../models/Category.js';
import connectDB from '../config/db.js';

dotenv.config();

const seedData = async () => {
  try {
    await connectDB();

    console.log('🌱 Starting VELVI NATURALS database seeding...');

    // 1. Create or update Default Admin
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@velvinaturals.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@12345';

    let adminUser = await User.findOne({ email: adminEmail });
    if (!adminUser) {
      adminUser = await User.create({
        name: 'Velvi Administrator',
        email: adminEmail,
        password: adminPassword,
        phone: '+919451155771',
        role: 'admin',
      });
      console.log(`👑 Admin created: ${adminEmail} (password: ${adminPassword})`);
    } else {
      adminUser.role = 'admin';
      await adminUser.save();
      console.log(`👑 Admin user exists: ${adminEmail}`);
    }

    // 2. Create Category
    let category = await Category.findOne({ name: 'Liquid Sweeteners' });
    if (!category) {
      category = await Category.create({
        name: 'Liquid Sweeteners',
        description: 'Natural organic plant-based liquid sweeteners in convenient dropper bottles.',
        image: '/images/stevia-drop.jpg',
      });
      console.log('📁 Category created: Liquid Sweeteners');
    }

    // 3. Create Flagship Product: Stevia Drop (10 ml)
    const existingProduct = await Product.findOne({ name: 'Stevia Drop Liquid Sweetener (10 ml)' });
    if (!existingProduct) {
      await Product.create({
        name: 'Stevia Drop Liquid Sweetener (10 ml)',
        description:
          'VELVI NATURALS Stevia Drop is a premium 10 ml liquid sweetener in a dropper bottle for everyday drinks and foods. Convenient, portable, and crafted for everyday sweetening moments.',
        price: 249,
        discountPrice: 199,
        category: category._id,
        categoryName: 'Liquid Sweeteners',
        stock: 150,
        SKU: 'STV-10ML',
        packSize: '10 ml',
        images: ['/images/stevia-drop.jpg', '/images/stevia-drop.webp'],
        ingredients: 'Stevia leaf extract, Purified water, Permitted preservatives as per guidelines',
        howToUse: 'Open the dropper bottle, add 1-2 drops to your tea, coffee, juice, or dessert, and stir well.',
        benefits: [
          'Convenient liquid drop format in a compact bottle',
          'Easy to use dropper for precise portion control',
          'Compact and travel-friendly 10 ml packaging',
          'Everyday sweetening companion for hot and cold beverages',
        ],
        featured: true,
        isActive: true,
      });
      console.log('🌿 Flagship product created: Stevia Drop Liquid Sweetener (10 ml)');
    } else {
      console.log('🌿 Stevia Drop product already exists');
    }

    console.log('✅ Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

seedData();
