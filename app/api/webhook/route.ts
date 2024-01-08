import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";

const corsHeaders = {
  "Access-Control-Allow-Origin": "http://localhost:3001",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
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

  const { id, isPaid, name, email } = body;
  try {
    const Order = await prismadb.order.update({
      where: {
        id,
      },
      data: {
        isPaid,
        name,
        email,
      },
    });

    return NextResponse.json(Order, {
      headers: corsHeaders,
    });
  } catch (error) {
    return new NextResponse("Something went wrong",{status: 500});
  }
}
