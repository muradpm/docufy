import { FileTextIcon } from "@radix-ui/react-icons";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import type { Document } from "@prisma/client";
import Link from "next/link";

interface RecentDocumentsProps {
  documents: Document[];
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return format(date, "PP");
}

export function RecentDocuments({ documents }: RecentDocumentsProps) {
  // Sort documents by lastAccessed in descending order
  const sortedDocuments = [...documents].sort(
    (a, b) =>
      new Date(b.lastAccessed).getTime() - new Date(a.lastAccessed).getTime()
  );
  const recentDocuments = sortedDocuments.slice(0, 5);

  return (
    <div className="space-y-8">
      {recentDocuments.map((document) => (
        <div key={document.id} className="flex items-center">
          <div className="flex items-center justify-center h-9 w-9">
            <FileTextIcon className="mr-2" />
          </div>
          <div className="space-y-1">
            <Link
              href={`/editor/${document.id}`}
              className="text-sm font-medium leading-none cursor-pointer hover:underline"
            >
              {document.title.length > 100
                ? document.title.substring(0, 100) + "..."
                : document.title}
            </Link>
            <div className="flex items-center gap-2">
              <div className="text-sm text-muted-foreground">
                {formatDate(document.lastAccessed.toString())}
              </div>
              {document.status && (
                <Badge variant="secondary">{document.status}</Badge>
              )}
              {document.priority && (
                <Badge variant="secondary">{document.priority}</Badge>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
