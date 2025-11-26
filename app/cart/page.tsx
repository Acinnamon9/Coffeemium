import { auth } from "@clerk/nextjs/server";
import CartClient from "./CartClient";
import { redirect } from "next/navigation";

export default async function Page() {
  const { userId } = await auth();
  if (!userId) {
redirect("/login?redirect_url=/cart");
  }
  return <CartClient />;
}
