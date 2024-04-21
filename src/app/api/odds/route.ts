import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const apiResponse = await axios.get("https://jsonplaceholder.typicode.com/users");
    return NextResponse.json(apiResponse.data);
  } catch (error: any) {
    return NextResponse.json({ message: error.message });
  }
}

export async function POST(req: NextApiRequest, res: NextApiResponse) {
  try {
    const response = await axios.post("https://5648-103-119-154-221.ngrok-free.app/search/match", JSON.parse(req.body));
    console.log("reqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq:", req);
    console.log("response:", response);
    return res.status(200).json(response.data);
  } catch (error: any) {
    console.log("reqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq:", error);
    return NextResponse.json({ message: error.message });
  }
}
