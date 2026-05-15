import dns from 'node:dns';
import express, { Request, Response } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { Transaction } from './models/Transaction';

dotenv.config();

// Force MongoDB SRV resolution through Google DNS to bypass local ISP blocks
dns.setServers(['8.8.8.8', '8.8.4.4']);

const mongoUri = process.env.MONGO_URI;

if (mongoUri) {
  mongoose.connect(mongoUri).catch((error: unknown) => {
    console.error('MongoDB connection error:', error);
  });
} else {
  console.warn('MONGO_URI is not set');
}

const app = express();

// Professional CORS setup
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Professional security config (allows preview if needed)
app.use(helmet({
  crossOriginResourcePolicy: false,
  contentSecurityPolicy: false,
}));

app.use(express.json());

// Advanced Admin Route: Get Vehicle Statistics
app.get('/api/admin/vehicle-stats', async (req: Request, res: Response) => {
  try {
    const stats = await Transaction.aggregate([
      {
        $group: {
          _id: '$vehicleNumber',
          totalTollsPassed: {
            $sum: { $cond: [{ $eq: ['$type', 'deduct'] }, 1, 0] }
          },
          totalSpent: {
            $sum: { $cond: [{ $eq: ['$type', 'deduct'] }, '$amount', 0] }
          },
          lastSeen: { $max: '$timestamp' }
        }
      },
      { $sort: { totalTollsPassed: -1 } }
    ]);
    res.json(stats);
  } catch (error) {
    console.error('Aggregation Error:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

app.get('/api/admin/system-summary', async (req: Request, res: Response) => {
  try {
    const stats = await Transaction.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: { $cond: [{ $eq: ['$type', 'deduct'] }, '$amount', 0] } },
          totalVehicles: { $addToSet: '$vehicleNumber' },
          totalTransactions: { $sum: 1 },
        }
      }
    ]);

    const result = stats[0] || { totalRevenue: 0, totalVehicles: [], totalTransactions: 0 };
    res.json({
      revenue: result.totalRevenue,
      activeFleet: result.totalVehicles.length,
      count: result.totalTransactions
    });
  } catch (error) {
    console.error('Summary Error:', error);
    res.status(500).send(error);
  }
});

// Add this route for the 7-Day PDF Report
app.get('/api/admin/recent-transactions', async (req: Request, res: Response) => {
  try {
    // Calculate the date exactly 7 days ago
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // Fetch all transactions from the last 7 days, sorted newest to oldest
    const transactions = await Transaction.find({
      timestamp: { $gte: sevenDaysAgo }
    }).sort({ timestamp: -1 });

    res.json(transactions);
  } catch (error) {
    console.error('Report Generation Error:', error);
    res.status(500).json({ message: 'Failed to fetch audit data' });
  }
});

app.get('/', (req: Request, res: Response) => {
  res.send('Bangalore Toll System API is Running');
});

// Route to get all transactions
app.get('/api/transactions', async (req: Request, res: Response) => {
  try {
    const transactions = await Transaction.find().sort({ timestamp: -1 });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching data' });
  }
});

app.get('/api/transactions/:vehicleNumber', async (req: Request, res: Response) => {
  try {
    const vehicleNumber = (req.params.vehicleNumber as string)?.toUpperCase();

    if (!vehicleNumber) {
      return res.status(400).json({ message: 'Vehicle number is required' });
    }

    const transactions = await Transaction.find({ vehicleNumber }).sort({ timestamp: -1 });
    res.json(transactions);
  } catch (error) {
    console.error('Vehicle History Error:', error);
    res.status(500).json({ message: 'Error fetching vehicle history' });
  }
});

// The Production-Grade POST Route
app.post('/api/transactions', async (req: Request, res: Response): Promise<any> => {
  try {
    const { vehicleNumber, plazaName, amount, type } = req.body;

    // 1. Data Integrity Check
    if (!vehicleNumber || !plazaName || amount === undefined) {
      return res.status(400).json({ message: 'Incomplete transaction data' });
    }

    // 2. Persist to MongoDB Atlas
    const newTransaction = new Transaction({
      vehicleNumber: vehicleNumber.toUpperCase(),
      plazaName,
      amount,
      type: type || 'deduct',
      timestamp: new Date()
    });

    const savedTransaction = await newTransaction.save();

    // 3. Return success with the saved document
    res.status(201).json(savedTransaction);
    console.log(`[CLOUD SYNC] Transaction logged for ${vehicleNumber}: ₹${amount}`);
  } catch (error) {
    console.error('Critical Transaction Failure:', error);
    res.status(500).json({ message: 'Internal Server Error during persistence' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));