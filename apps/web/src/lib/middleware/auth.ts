import { NextRequest, NextResponse } from 'next/server';



export const AuthMiddleware = async (req: NextRequest) => {
  // const session = await auth();
  // console.log(session); 

  return NextResponse.next(); 
}