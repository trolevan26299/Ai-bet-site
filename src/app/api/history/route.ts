import { axiosInstance, endpoints } from "@/utils/axios";
import { NextApiResponse } from "next";
import { NextResponse } from "next/server";

export async function POST(req: Request, res: NextApiResponse) {
  const body = await req.json();
  try {
    const url_full = process.env.HOST_API_P88 + body.url;
    console.log("endpoints.history", endpoints.history);
    const response = await axiosInstance.post(endpoints.history, { ...body, url: url_full });
    console.log("body:", body);
    console.log("endpoints.history:", endpoints.history);
    console.log("data:", response.data);
    return NextResponse.json(response.data);
  } catch (error: any) {
    console.log("error:", error);
    return NextResponse.json({ message: error.message });
  }
}
