import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";

const corsHeaders = {
  "Access-Control-Allow-Origin": "http://localhost:3001",
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
  const { API_KEY, OrderId, ServiceName } = body;

  if (!API_KEY) {
    return new NextResponse("Unauthorized", { status: 401 });
  }
  const order = await prismadb.order.create({
    data: {
      isPaid: false,
      spotifyOrderId: OrderId,
      OrderType: ServiceName
    },
  });


  return NextResponse.json(
    {
      order
    },
    {
      headers: corsHeaders,
    },
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
