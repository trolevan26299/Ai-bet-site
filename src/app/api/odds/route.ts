import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";

export async function GET() {
  const apiResponse = await fetch("https://jsonplaceholder.typicode.com/users");
  const parsedData = await apiResponse.json();
  return NextResponse.json(parsedData);
}

export async function POST(request: Request) {
  const data = await request.json();
  const apiResponse = await fetch("https://jsonplaceholder.typicode.com/posts", data);
  return NextResponse.json(apiResponse);
}

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   if (req.method === "POST") {
//     try {
//       const data = req.body;
//       const apiResponse = await axios.post("https://jsonplaceholder.typicode.com/posts", data);
//       return res.status(200).json(apiResponse.data);
//     } catch (error) {
//       console.error("Error:", error);
//       return res.status(500).json({ message: "Internal server error" });
//     }
//   } else {
//     return res.status(405).json({ message: "Method not allowed" });
//   }
// }
