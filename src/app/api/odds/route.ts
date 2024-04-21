import { axiosInstance, endpoints } from "@/utils/axios";
import axios from "axios";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const apiResponse = await axios.get("https://jsonplaceholder.typicode.com/users");
    return NextResponse.json(apiResponse.data);
  } catch (error: any) {
    return NextResponse.json({ message: error.message });
  }
}

export async function POST(request: Request) {
  try {
    const res = await axiosInstance.post(endpoints.match, request.body);
    return NextResponse.json(res.data);
  } catch (error: any) {
    return NextResponse.json({ message: error.message });
  }
}
