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
          <h2 className="text-xl font-semibold">Input Text</h2>
        </div>
        
        <div className="space-y-4">
          <Textarea
            data-testid="input-text-content"
            placeholder="Paste or type your text content here..."
            className="h-64 resize-none"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span data-testid="text-character-count">{characterCount} characters</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span data-testid="text-line-count">{lineCount} lines</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
