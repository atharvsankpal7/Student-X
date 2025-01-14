import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle } from "lucide-react";

interface RequestCardProps {
  title: string;
  description: string;
  status: "pending" | "approved" | "rejected";
  requestDate: string;
  onApprove?: () => void;
  onReject?: () => void;
}

export function RequestCard({
  title,
  description,
  status,
  requestDate,
  onApprove,
  onReject,
}: RequestCardProps) {
  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800",
    approved: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Request Date</p>
            <p className="text-sm text-muted-foreground">
              {new Date(requestDate).toLocaleDateString()}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className={`px-2 py-1 text-sm rounded ${statusColors[status]}`}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
            {status === "pending" && onApprove && onReject && (
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={onApprove}>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Approve
                </Button>
                <Button variant="outline" size="sm" onClick={onReject}>
                  <XCircle className="w-4 h-4 mr-2" />
                  Reject
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}