import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export default function middleware(request: NextRequest) {
  const response = NextResponse.next();

  response.headers.set("x-href", request.nextUrl.href);

  const visitorIdCookie = request.cookies.get("coveo_visitorId");

  if (!visitorIdCookie) {
    const visitorId = uuidv4();
    const expirationDate = new Date();
    expirationDate.setFullYear(expirationDate.getFullYear() + 1);

    response.cookies.set({
      name: "coveo_visitorId",
      value: visitorId,
      expires: expirationDate,
      path: "/",
      httpOnly: false,
      sameSite: "lax",
    });
  }

  return response;
}
