import mongoose from 'mongoose';
import { Transaction } from './models/Transaction';
import dotenv from 'dotenv';

dotenv.config();

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI!);
    console.log("Connected for seeding...");

    const dummyData = [
      { vehicleNumber: "KA-01-AB-1234", plazaName: "KIAL Airport Toll", amount: 110, type: "deduct" },
      { vehicleNumber: "KA-01-AB-1234", plazaName: "Electronic City Phase 1", amount: 50, type: "deduct" },
      { vehicleNumber: "KA-53-JN-9999", plazaName: "NICE Road", amount: 45, type: "deduct" },
      { vehicleNumber: "KA-03-MG-5678", plazaName: "Wallet Recharge", amount: 1000, type: "credit" }
    ];

    await Transaction.insertMany(dummyData);
    console.log("✅ Database Seeded Successfully!");
    process.exit();
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
};

seed();