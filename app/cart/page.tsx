import { auth } from "@clerk/nextjs/serverq";
import CartClient from "./CartClient";
import { redirect } from "next/navigation";

export default function Page() {
  const { userId } = auth();
  if (!userId) {
    redirect("/sign-in?redirect_url=/cart");
  }
  return <CartClient />;
}
