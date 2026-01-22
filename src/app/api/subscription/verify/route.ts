import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import prisma from '@/lib/db';

export async function POST(request: NextRequest) {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        } = await request.json();

        const body = razorpay_order_id + '|' + razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
            .update(body.toString())
            .digest('hex');

        if (expectedSignature === razorpay_signature) {
            // Update payment status
            const payment = await prisma.payment.update({
                where: { razorpayOrderId: razorpay_order_id },
                data: {
                    status: 'SUCCESS',
                    razorpayPaymentId: razorpay_payment_id,
                    razorpaySignature: razorpay_signature,
                },
            });

            // Fetch order to get the plan from notes (secure source)
            const RazorpayVal = require('razorpay');
            const instance = new RazorpayVal({
                key_id: process.env.RAZORPAY_KEY_ID!,
                key_secret: process.env.RAZORPAY_KEY_SECRET!,
            });
            const order = await instance.orders.fetch(razorpay_order_id);
            const plan = order.notes?.plan || 'STARTER';

            // Create/Update subscription
            await prisma.subscription.create({
                data: {
                    userId: payment.userId,
                    plan: plan as string,
                    status: 'ACTIVE',
                    razorpaySubId: razorpay_order_id,
                    // Set expiration? Currently one-time payment logic in code but labeled subscription.
                    // Let's set 30 days for now as it says "/month"
                    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                },
            });

            return NextResponse.json({ success: true });
        } else {
            return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
        }
    } catch (error) {
        console.error('Error verifying payment:', error);
        return NextResponse.json({ error: 'Error verifying payment' }, { status: 500 });
    }
}
