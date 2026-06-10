import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User, { UserRole } from './models/User.js';

dotenv.config();

const resetAdmin = async () => {
  try {
    const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/melodia';
    await mongoose.connect(uri);
    console.log('MongoDB Connected.');

    const username = 'Hemant12';
    const defaultPassword = 'password123';
    const email = 'hemant12@example.com';

    let user = await User.findOne({ username });

    if (!user) {
      console.log(`User ${username} not found. Creating new admin user...`);
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(defaultPassword, salt);
      user = new User({
        username,
        email,
        passwordHash,
        role: UserRole.ADMIN
      });
      await user.save();
      console.log(`Created new admin: Username: ${username}, Password: ${defaultPassword}`);
    } else {
      console.log(`Found existing user ${username}. Resetting password and elevating to ADMIN...`);
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(defaultPassword, salt);
      user.passwordHash = passwordHash;
      user.role = UserRole.ADMIN;
      await user.save();
      console.log(`Updated existing user: Username: ${username}, Password: ${defaultPassword}`);
    }

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

resetAdmin();
