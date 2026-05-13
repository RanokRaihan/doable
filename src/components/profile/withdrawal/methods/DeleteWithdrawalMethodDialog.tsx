"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

import deleteWithdrawalMethodAction from "@/actions/withdrawal/deleteWithdrawalMethodAction";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface DeleteWithdrawalMethodDialogProps {
  methodId: string;
  accountName: string;
  accountNumber: string;
  children: React.ReactNode;
}

export function DeleteWithdrawalMethodDialog({
  methodId,
  accountName,
  accountNumber,
  children,
}: DeleteWithdrawalMethodDialogProps) {
  const router = useRouter();

  const maskedAccountNumber =
    accountNumber.length > 4
      ? `••••${accountNumber.slice(-4)}`
      : accountNumber;

  const handleDelete = async () => {
    const result = await deleteWithdrawalMethodAction(methodId);

    if (result.success) {
      toast.success("Withdrawal method deleted");
      router.push("/profile/withdrawal/methods");
    } else {
      const message =
        "message" in result ? result.message : "Failed to delete method";
      if (message.toLowerCase().includes("pending")) {
        toast.error(
          "Cannot delete: Cancel all pending withdrawal requests using this method first.",
        );
      } else {
        toast.error(message);
      }
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Withdrawal Method?</AlertDialogTitle>
          <AlertDialogDescription>
            You are about to delete{" "}
            <span className="font-semibold text-slate-800">{accountName}</span>{" "}
            ({maskedAccountNumber}). This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Delete Method
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
