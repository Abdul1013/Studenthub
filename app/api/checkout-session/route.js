import Stripe from "stripe";
import { NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY )

const  formatAmountForStrip = (amount) =>{
    return Math.round(amount * 100);
}

export async function POST(req){
    const params ={
        submit_type: "subscription",
        payment_method_types: ["cards"],
        line_items: [
            {
                price_data : { currency: 'ngn',
                    product_data: {
                        name: "pro subscription " ,
                    },
                    unit_amount : formatAmountForStrip(10),
                    recurring: {
                        interval: "month",
                        interval_count: 1
                    }
                },  
                quantity: 1,
            },
        ],
        success_url: `$(req.headers.origin)/result?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `$(req.headers.origin)/result?session_id={CHECKOUT_SESSION_ID}`,
    }
    const checkoutSession = await stripe.checkout.sessions.create(params);
    return NextResponse.json(checkoutSession), {
        status: 200,
    }
}