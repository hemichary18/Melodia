import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User, { UserRole } from './models/User.js';

dotenv.config();

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/melodia';
    await mongoose.connect(uri);
    console.log('MongoDB Connected to:', uri);
  } catch (error: any) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const createAdmin = async () => {
  try {
    await connectDB();
    
    // Check if admin already exists
    const existingAdmin = await User.findOne({ username: 'Hemant12' });
    if (existingAdmin) {
      console.log('Admin user already exists!');
      process.exit();
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('12345678', salt);

    await User.create({
      username: 'Hemant12',
      email: 'admin@melodia.app', // placeholder email
      passwordHash,
      role: UserRole.ADMIN,
      authProvider: 'local'
    });

    console.log('Admin user Hemant12 created successfully!');
    process.exit();
  } catch (error) {
    console.error('Error creating admin:', error);
    process.exit(1);
  }
};

createAdmin();
