// src/scripts/migrate.ts
import mongoose from 'mongoose';
import Expense from '../models/Expense';
import EMI from '../models/EMI';
import Loan from '../models/Loan';
import dotenv from 'dotenv';

dotenv.config();

async function up() {
  try {
    await mongoose.connect(process.env.MONGODB_URI! || "mongodb+srv://shreyasnandanwar0400:Aprilzer0@datastorage1.bqyyy6u.mongodb.net/DataStorage1?retryWrites=true&w=majority");
    console.log('Connected to MongoDB');

    // Add currency field to expenses
    console.log('Adding currency field to expenses...');
    await Expense.updateMany(
      { currency: { $exists: false } },
      { $set: { currency: 'INR' } }
    );

    // Add active field to EMIs
    console.log('Adding active field to EMIs...');
    await EMI.updateMany(
      { active: { $exists: false } },
      { $set: { active: true } }
    );

    // Add status field to loans
    console.log('Adding status field to loans...');
    await Loan.updateMany(
      { status: { $exists: false } },
      { $set: { status: 'active' } }
    );

    console.log('Migration completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

up();