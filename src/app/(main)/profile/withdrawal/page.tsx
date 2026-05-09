import { redirect } from "next/navigation";

export default function WithdrawalPage() {
  redirect("/profile/withdrawal/methods");
}
