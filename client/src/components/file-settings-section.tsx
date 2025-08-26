import { FileSignature } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface FileSettingsSectionProps {
  fileName: string;
  setFileName: (fileName: string) => void;
  directory: string;
  setDirectory: (directory: string) => void;
}

export default function FileSettingsSection({ 
  fileName, 
  setFileName, 
  directory, 
  setDirectory 
}: FileSettingsSectionProps) {
  const fullFileName = `${fileName || 'untitled'}.html`;
  
  return (
    <Card className="shadow-sm" data-testid="file-settings-section">
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <FileSignature className="text-primary" size={20} />
          <h3 className="font-semibold">ファイル設定</h3>
        </div>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="fileName" className="block text-sm font-medium mb-2">
              ファイル名
            </Label>
            <Input
              id="fileName"
              data-testid="input-file-name"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground mt-1">
              作成されるファイル: <span className="font-mono" data-testid="text-full-filename">{fullFileName}</span>
            </p>
          </div>
          
          <div>
            <Label htmlFor="directory" className="block text-sm font-medium mb-2">
              ディレクトリパス
            </Label>
            <Input
              id="directory"
              data-testid="input-directory"
              value={directory}
              onChange={(e) => setDirectory(e.target.value)}
              placeholder="docs/ (オプション)"
              className="w-full"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
