// import Stripe from "stripe";
import { NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2022-11-15',
  });

const formatAmountForStripe = (amount) => {
  return Math.round(amount * 100);
};

export async function POST(req) {
  try {
    const origin = req.headers.origin || process.env.NEXT_PUBLIC_SITE_URL;

   // const { planId } = await req.json();
    
    // Here you should define the plan details based on the planId
    //const priceId = getPriceIdForPlan(planId); // Define this function according to your pricing setup

    const params = {
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "ngn",
            product_data: {
              name: "pro subscription",
            },
            unit_amount: formatAmountForStripe(500),
            recurring: {
              interval: "month",
              interval_count: 1,
            },
          },
          quantity: 1,
        },
      ],
    //   success_url: `${req.headers.origin}/result?session_id={CHECKOUT_SESSION_ID}`,
    //   cancel_url: `${req.headers.origin}/result?session_id={CHECKOUT_SESSION_ID}`,
    mode: 'subscription',
    success_url: `${origin}/result?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/result?session_id={CHECKOUT_SESSION_ID}`,
    };

    const checkoutSession = await stripe.checkout.sessions.create(params);

    return NextResponse.json(checkoutSession, {
      status: 200,
    });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return NextResponse.json(
      { error: error.message },
      {
        status: 500,
      }
    );
  }

}

// function getPriceIdForPlan(planId) {
//     // Return the correct price ID based on planId
//     switch (planId) {
//       case 1:
//         return 'price_1ABCD1234'; // Replace with actual price ID
//       case 2:
//         return 'price_1ABCD5678'; // Replace with actual price ID
//       case 3:
//         return 'price_1ABCD91011'; // Replace with actual price ID
//       default:
//         throw new Error('Invalid plan ID');
//     }
//   }
