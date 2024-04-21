import axios from "axios";
import { NextApiRequest } from "next";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const apiResponse = await axios.get("https://jsonplaceholder.typicode.com/users");
    return NextResponse.json(apiResponse.data);
  } catch (error: any) {
    return NextResponse.json({ message: error.message });
  }
}

export async function POST(req: NextApiRequest) {
  console.log("reqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq:", req);
  try {
    const res = await axios.post("https://5648-103-119-154-221.ngrok-free.app/search/match", req.body);
    return NextResponse.json(res.data);
  } catch (error: any) {
    return NextResponse.json({ message: error.message });
  }
}
