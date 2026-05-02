import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";

export function SafetyCard() {
  return (
    <Card className="bg-amber-50 border-amber-200">
      <CardContent className="p-4">
        <div className="flex gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-amber-800 mb-1">
              Safety Reminder
            </h4>
            <p className="text-sm text-amber-700">
              Never share personal financial information. All payments are
              processed securely through our platform.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
