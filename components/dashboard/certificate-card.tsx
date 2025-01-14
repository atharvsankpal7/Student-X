import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface CertificateCardProps {
  title: string;
  description: string;
  fileName: string;
  issueDate: string;
  onDownload: () => void;
}

export function CertificateCard({
  title,
  description,
  fileName,
  issueDate,
  onDownload,
}: CertificateCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">{fileName}</p>
            <p className="text-sm text-muted-foreground">
              Issued: {new Date(issueDate).toLocaleDateString()}
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={onDownload}>
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}