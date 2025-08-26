import { Edit } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

interface TextInputSectionProps {
  content: string;
  setContent: (content: string) => void;
}

export default function TextInputSection({ content, setContent }: TextInputSectionProps) {
  const characterCount = content.length;
  const lineCount = content.split('\n').length;

  return (
    <Card className="shadow-sm" data-testid="text-input-section">
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Edit className="text-primary" size={20} />
          <h2 className="text-xl font-semibold">テキスト入力</h2>
        </div>
        
        <div className="space-y-4">
          <Textarea
            data-testid="input-text-content"
            placeholder="テキストコンテンツをここに貼り付けまたは入力してください..."
            className="h-64 resize-none"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span data-testid="text-character-count">{characterCount} 文字</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span data-testid="text-line-count">{lineCount} 行</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
