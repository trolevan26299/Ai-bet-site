import { axiosInstance, endpoints } from "@/utils/axios";
import { NextApiResponse } from "next";
import { NextResponse } from "next/server";

export async function POST(req: Request, res: NextApiResponse) {
  const url = new URL(req.url);
  const requestId = url.searchParams.get("id");
  try {
    const response = await axiosInstance.get(`${endpoints.league.matchInLeague}/${requestId}`);
    return NextResponse.json(response.data);
  } catch (error: any) {
    return NextResponse.json({ message: error.message });
  }
}
