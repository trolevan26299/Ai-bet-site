import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    message: "======================================fsdfsdfsdfsdfsdf",
  });
}
export async function POST(request: Request) {
  const data = await request.json();
  return NextResponse.json({
    data,
  });
}
