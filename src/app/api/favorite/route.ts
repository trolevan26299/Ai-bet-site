import { axiosInstance, endpoints } from "@/utils/axios";
import { NextApiResponse } from "next";
import { NextResponse } from "next/server";

// ADD FAVORITE
export async function POST(req: Request, res: NextApiResponse) {
  const body = await req.json();
  try {
    const response = await axiosInstance.post(endpoints.favorite.add, body);
    return NextResponse.json(response.data);
  } catch (error: any) {
    return NextResponse.json({ message: error.message });
  }
}
// REMOVE FAVORITE
export async function PUT(req: Request, res: NextApiResponse) {
  const body = await req.json();
  try {
    const response = await axiosInstance.post(endpoints.favorite.delete, body);
    return NextResponse.json(response.data);
  } catch (error: any) {
    return NextResponse.json({ message: error.message });
  }
}
