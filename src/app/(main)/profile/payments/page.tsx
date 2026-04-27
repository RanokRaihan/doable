import { redirect } from "next/navigation";

export default function PaymentsPage() {
  redirect("/profile/payments/payment-made");
}
