import axios from 'axios';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type } = body;

    if (!type || !['daily', 'monthly'].includes(type)) {
      return NextResponse.json(
        { error: 'Invalid type. Must be "daily" or "monthly"' },
        { status: 400 }
      );
    }

    const apiKey = process.env.EMAAR_API_KEY;
    const apiBase = process.env.EMAAR_API_BASE || 'https://apidev.emaar.com';

    if (!apiKey) {
      console.warn('EMAAR_API_KEY not set, returning mock response');
      return NextResponse.json({
        success: true,
        message: `${type} sales data pushed successfully (mock)`,
        data: generateMockSalesData(type)
      });
    }

    // Generate mock sales data for testing
    const salesData = generateMockSalesData(type);

    // Send to Emaar API
    const response = await axios.post(`${apiBase}/etenantsales/${type}sales`, salesData, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      timeout: 10000
    });

    console.log(`${type} sales push response:`, response.data);

    return NextResponse.json({
      success: true,
      message: `${type} sales data pushed successfully`,
      emaarResponse: response.data
    });

  } catch (error: any) {
    console.error('Emaar sales push failed:', error.response?.data || error.message);
    return NextResponse.json(
      {
        error: 'Failed to push sales data',
        details: error.response?.data || error.message
      },
      { status: 500 }
    );
  }
}

function generateMockSalesData(type: 'daily' | 'monthly') {
  const now = new Date();
  const sales = [];

  if (type === 'daily') {
    // Generate 5-10 random sales for the last 24 hours
    const numSales = Math.floor(Math.random() * 6) + 5;
    for (let i = 0; i < numSales; i++) {
      const saleTime = new Date(now.getTime() - Math.random() * 24 * 60 * 60 * 1000);
      sales.push({
        id: `sale_${i + 1}`,
        date: saleTime.toISOString(),
        amount: Math.floor(Math.random() * 5000000) + 1000000, // 1M to 6M AED
        project: ['Emaar Beachfront', 'Dubai Hills Estate', 'Dubai Creek Harbour'][Math.floor(Math.random() * 3)],
        unit: `${Math.floor(Math.random() * 3) + 1}BR Apartment`,
        buyer: `Buyer ${i + 1}`,
        agent: `Agent ${i + 1}`
      });
    }
  } else {
    // Monthly: aggregate data
    sales.push({
      period: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`,
      totalSales: Math.floor(Math.random() * 50000000) + 10000000, // 10M to 60M AED
      totalUnits: Math.floor(Math.random() * 50) + 20,
      projects: ['Emaar Beachfront', 'Dubai Hills Estate', 'Dubai Creek Harbour'],
      breakdown: {
        'Emaar Beachfront': Math.floor(Math.random() * 20000000) + 5000000,
        'Dubai Hills Estate': Math.floor(Math.random() * 20000000) + 5000000,
        'Dubai Creek Harbour': Math.floor(Math.random() * 20000000) + 5000000
      }
    });
  }

  return sales;
}
