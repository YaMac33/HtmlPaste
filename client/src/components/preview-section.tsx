import { useState } from "react";
import { Eye, Code } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface PreviewSectionProps {
  content: string;
}

export default function PreviewSection({ content }: PreviewSectionProps) {
  const [showRawHTML, setShowRawHTML] = useState(false);

  const { data: previewData, isLoading } = useQuery({
    queryKey: ['/api/preview'],
    queryFn: async () => {
      if (!content.trim()) return { htmlContent: "" };
      const response = await apiRequest('POST', '/api/preview', { content });
      return response.json();
    },
    enabled: !!content.trim(),
  });

  const htmlContent = previewData?.htmlContent || "";

  return (
    <Card className="shadow-sm" data-testid="preview-section">
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Eye className="text-primary" size={20} />
          <h2 className="text-xl font-semibold">HTMLプレビュー</h2>
        </div>
        
        <div className="space-y-4">
          <div className="bg-muted rounded-md p-4 border min-h-[200px]">
            {isLoading ? (
              <div className="flex items-center justify-center h-32">
                <div className="text-muted-foreground">プレビューを読み込み中...</div>
              </div>
            ) : showRawHTML ? (
              <pre className="text-sm whitespace-pre-wrap font-mono" data-testid="preview-raw-html">
                {htmlContent}
              </pre>
            ) : (
              <div 
                className="prose prose-sm max-w-none" 
                data-testid="preview-rendered-html"
                dangerouslySetInnerHTML={{ 
                  __html: htmlContent.replace(/<style>.*?<\/style>/gs, '').replace(/<!DOCTYPE.*?<body>/gs, '').replace(/<\/body>.*?<\/html>/gs, '')
                }}
              />
            )}
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowRawHTML(!showRawHTML)}
            className="text-sm text-muted-foreground hover:text-foreground"
            data-testid="button-toggle-raw-html"
          >
            <Code size={16} className="mr-2" />
            {showRawHTML ? "レンダリング表示" : "HTML表示"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
