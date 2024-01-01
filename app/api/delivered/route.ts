import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

const corsHeaders = {
  "Access-Control-Allow-Origin": "https://services-dashboard.vercel.app",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, x-api-key",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { isDelivered, deliveredOriderId } = body;
    const order = await prismadb.order.findFirst({
      where: {
        id: deliveredOriderId,
      },
    });

    if (!order?.isDelivered) {
      const UpdatedOrder = await prismadb.order.update({
        where: {
          id: deliveredOriderId,
        },
        data: {
          isDelivered,
        },
      });
      return NextResponse.json(UpdatedOrder, {
        headers: corsHeaders,
      });
    }

    return NextResponse.json(!order.isDelivered, {
        headers: corsHeaders,
      })
  } catch (error:any) {
    return new NextResponse("DELIVERED", error);
  }
}
