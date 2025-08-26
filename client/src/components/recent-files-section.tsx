import { History, ExternalLink, Copy } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";

export default function RecentFilesSection() {
  const { toast } = useToast();

  const { data: recentFiles = [], isLoading } = useQuery({
    queryKey: ['/api/files/recent'],
    queryFn: async ({ queryKey }) => {
      const response = await fetch(queryKey.join('/'));
      if (!response.ok) throw new Error('Failed to fetch recent files');
      return response.json();
    },
  });

  const copyFileName = (fileName: string) => {
    navigator.clipboard.writeText(fileName);
    toast({
      title: "Copied!",
      description: "File name copied to clipboard",
    });
  };

  return (
    <Card className="mt-8 shadow-sm" data-testid="recent-files-section">
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <History className="text-primary" size={20} />
          <h3 className="font-semibold">Recent Files</h3>
        </div>
        
        {isLoading ? (
          <div className="text-center py-8 text-muted-foreground">
            Loading recent files...
          </div>
        ) : recentFiles.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No files created yet. Create your first file above!
          </div>
        ) : (
          <div className="space-y-3">
            {recentFiles.map((file: any) => (
              <div 
                key={file.id}
                className="flex items-center justify-between p-3 bg-muted rounded-md hover:bg-accent transition-colors"
                data-testid={`file-item-${file.id}`}
              >
                <div className="flex items-center gap-3">
                  <div className="text-muted-foreground">📄</div>
                  <div>
                    <p className="font-medium text-sm" data-testid={`file-name-${file.id}`}>
                      {file.fileName}.html
                    </p>
                    <p className="text-xs text-muted-foreground" data-testid={`file-details-${file.id}`}>
                      {file.directory && `${file.directory} • `}
                      {file.createdAt ? formatDistanceToNow(new Date(file.createdAt), { addSuffix: true }) : 'Recently'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {file.githubUrl && (
                    <Button
                      variant="ghost"
                      size="sm"
                      asChild
                      data-testid={`link-external-${file.id}`}
                    >
                      <a 
                        href={file.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-muted-foreground hover:text-foreground"
                      >
                        <ExternalLink size={14} />
                      </a>
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyFileName(`${file.fileName}.html`)}
                    className="text-sm text-muted-foreground hover:text-foreground"
                    data-testid={`button-copy-${file.id}`}
                  >
                    <Copy size={14} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
