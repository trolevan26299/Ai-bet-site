import { axiosInstance, endpoints } from "@/utils/axios";
import { NextApiResponse } from "next";
import { NextResponse } from "next/server";

// SETTING NUMBER LINE
export async function POST(req: Request, res: NextApiResponse) {
  const body = await req.json();
  try {
    const response = await axiosInstance.post(endpoints.setting.ROOT, body);
    return NextResponse.json(response.data);
  } catch (error: any) {
    return NextResponse.json({ message: error.message });
  }
}
