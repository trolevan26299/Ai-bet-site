import { axiosInstance, endpoints } from "@/utils/axios";
import { NextApiResponse } from "next";
import { NextResponse } from "next/server";

export async function POST(req: Request, res: NextApiResponse) {
  const body = await req.json();
  try {
    const response = await axiosInstance.post(endpoints.game, body);
    // return NextResponse.json(response.data);
    return NextResponse.json(response);
  } catch (error: any) {
    return NextResponse.json({ message: error.message });
  }
}
