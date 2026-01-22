import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/db';

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(request: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { plan, amount } = await request.json();

        const order = await razorpay.orders.create({
            amount: amount * 100, // amount in paisa
            currency: 'INR',
            receipt: `receipt_${Date.now()}`,
            notes: {
                plan: plan
            }
        });

        // Save initial payment record
        await prisma.payment.create({
            data: {
                userId,
                amount: amount,
                currency: 'INR',
                status: 'PENDING',
                razorpayOrderId: order.id,
            },
        });

        return NextResponse.json(order);
    } catch (error) {
        console.error('Error creating order:', error);
        return NextResponse.json({ error: 'Error creating order' }, { status: 500 });
    }
}
