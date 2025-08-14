import { NextResponse } from 'next/server';
import mongoose from 'mongoose';

export async function GET() {
  try {
    // Check database connection
    const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
    
    return NextResponse.json({
      success: true,
      data: {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        database: dbStatus,
        version: process.env.npm_package_version || '1.0.0'
      }
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Health check failed'
    }, { status: 500 });
  }
}