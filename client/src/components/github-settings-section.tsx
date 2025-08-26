import { useState } from "react";
import { Github, Settings } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface GithubSettingsSectionProps {
  repository: string;
  setRepository: (repository: string) => void;
  branch: string;
  setBranch: (branch: string) => void;
  commitMessage: string;
  setCommitMessage: (commitMessage: string) => void;
}

export default function GithubSettingsSection({
  repository,
  setRepository,
  branch,
  setBranch,
  commitMessage,
  setCommitMessage
}: GithubSettingsSectionProps) {
  const [connectionStatus, setConnectionStatus] = useState<'unknown' | 'connected' | 'error'>('unknown');
  const { toast } = useToast();

  const testConnectionMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', '/api/github/test', { repository });
      return response.json();
    },
    onSuccess: () => {
      setConnectionStatus('connected');
      toast({
        title: "接続成功",
        description: "GitHubリポジトリにアクセスできます。",
      });
    },
    onError: (error: any) => {
      setConnectionStatus('error');
      toast({
        title: "接続失敗",
        description: error.message || "GitHubリポジトリに接続できませんでした。",
        variant: "destructive",
      });
    },
  });

  return (
    <Card className="shadow-sm" data-testid="github-settings-section">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Github className="text-primary" size={20} />
            <h3 className="font-semibold">GitHub設定</h3>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${
              connectionStatus === 'connected' ? 'bg-green-500' : 
              connectionStatus === 'error' ? 'bg-red-500' : 'bg-gray-400'
            }`} />
            <span className="text-xs text-muted-foreground" data-testid="text-connection-status">
              {connectionStatus === 'connected' ? '接続済み' : 
               connectionStatus === 'error' ? 'エラー' : '不明'}
            </span>
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="repository" className="block text-sm font-medium mb-2">
              リポジトリ
            </Label>
            <Input
              id="repository"
              data-testid="input-repository"
              value={repository}
              onChange={(e) => {
                setRepository(e.target.value);
                setConnectionStatus('unknown');
              }}
              placeholder="ユーザー名/リポジトリ名"
              className="w-full"
            />
          </div>
          
          <div>
            <Label htmlFor="branch" className="block text-sm font-medium mb-2">
              ブランチ
            </Label>
            <Select value={branch} onValueChange={setBranch}>
              <SelectTrigger data-testid="select-branch">
                <SelectValue placeholder="ブランチを選択" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="main">main</SelectItem>
                <SelectItem value="gh-pages">gh-pages</SelectItem>
                <SelectItem value="develop">develop</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="commitMessage" className="block text-sm font-medium mb-2">
              コミットメッセージ
            </Label>
            <Input
              id="commitMessage"
              data-testid="input-commit-message"
              value={commitMessage}
              onChange={(e) => setCommitMessage(e.target.value)}
              className="w-full"
            />
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => testConnectionMutation.mutate()}
            disabled={testConnectionMutation.isPending || !repository}
            className="w-full text-sm text-muted-foreground hover:text-foreground"
            data-testid="button-test-connection"
          >
            <Settings size={16} className="mr-2" />
            {testConnectionMutation.isPending ? "テスト中..." : "接続テスト"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
