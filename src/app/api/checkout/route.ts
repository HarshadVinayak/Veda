import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';

// Use placeholders since keys weren't provided in .env template
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'secret_placeholder',
});

export async function POST(req: NextRequest) {
  try {
    const { amount, currency = 'INR', tier } = await req.json();

    const options = {
      amount: amount * 100, // in paise
      currency,
      receipt: `receipt_${Date.now()}`,
      notes: { tier },
    };

    const order = await razorpay.orders.create(options);

    return NextResponse.json({ order });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
