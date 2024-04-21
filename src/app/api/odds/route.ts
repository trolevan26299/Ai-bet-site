import { axiosInstance, endpoints } from "@/utils/axios";
import axios from "axios";
import { NextApiResponse } from "next";
import { NextResponse } from "next/server";

export async function POST(req: Request, res: NextApiResponse) {
  const body = await req.json();
  try {
    const response = await axiosInstance.post(endpoints.match, body);
    return NextResponse.json(response.data);
  } catch (error: any) {
    return NextResponse.json({ message: error.message });
  }
}
