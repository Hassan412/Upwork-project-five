import Stripe from "stripe";
import { NextResponse } from "next/server";
import limitDecimalPlaces from "@/actions/limit-number-decimal";
import { stripe } from "@/lib/stripe";
import prismadb from "@/lib/prismadb";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, x-api-key",
};

export async function OPTIONS() {
  return NextResponse.json(
    {},
    {
      headers: corsHeaders,
    }
  );
}

export async function POST(req: Request) {
  const body = await req.json();
  const { OrderTotal, API_KEY, OrderId } = body;

  if (!API_KEY) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [
    {
      price_data: {
        currency: "USD",
        product_data: {
          name: "Spotify services",
        },
        unit_amount_decimal: `${limitDecimalPlaces(OrderTotal * 100, 2)}`,
      },
      quantity: 1,
    },
  ];
  const order = await prismadb.order.create({
    data: {
      isPaid: false,
      createOrderId: OrderId,
    },
  });
  const session = await stripe.checkout.sessions.create({
    line_items,
    mode: "payment",
    billing_address_collection: "required",
    phone_number_collection: {
      enabled: true,
    },
    success_url: `${process.env.FRONTEND_URL}?success=1`,
    cancel_url: `${process.env.FRONTEND_URL}?canceled=1`,
    metadata: {
      orderId: order.id,
    },
  });
 
  return NextResponse.json(
    { url: session.url },
    {
      headers: corsHeaders,
    }
  );
}

const API_KEY = process.env.NEXT_PUBLIC_API_KEY;
export async function GET(req: Request) {
  try {
    const userApikey = req.headers.get("x-api-key");

    const Orders = await prismadb.order.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(Orders);
  } catch (error) {
    console.log("Checkout Get", error);
    return new NextResponse("Something went wrong", { status: 500 });
  }
}
