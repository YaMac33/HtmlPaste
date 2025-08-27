import { Rocket } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface ActionSectionProps {
  content: string;
  fileName: string;
  directory: string;
  repository: string;
  branch: string;
  commitMessage: string;
}

export default function ActionSection({
  content,
  fileName,
  directory,
  repository,
  branch,
  commitMessage
}: ActionSectionProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const convertAndPushMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', '/api/convert-and-push', {
        content,
        fileName,
        directory,
        repository,
        branch,
        commitMessage
      });
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "成功！",
        description: `ファイルが${repository}に正常にプッシュされました`,
      });
      
      // Invalidate recent files to refresh the list
      queryClient.invalidateQueries({ queryKey: ['/api/files/recent'] });
      
      // Store success data for status section
      window.dispatchEvent(new CustomEvent('push-success', { detail: data }));
    },
    onError: (error: any) => {
      toast({
        title: "エラー",
        description: error.message || "変換とGitHubへのプッシュに失敗しました",
        variant: "destructive",
      });
      
      // Store error data for status section
      window.dispatchEvent(new CustomEvent('push-error', { detail: { error: error.message } }));
    },
  });

  const isValid = content.trim() && fileName.trim() && repository.trim() && commitMessage.trim();

  return (
    <Card className="shadow-sm" data-testid="action-section">
      <CardContent className="p-6">
        <Button
          onClick={() => convertAndPushMutation.mutate()}
          disabled={convertAndPushMutation.isPending || !isValid}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-4 px-6 text-lg"
          data-testid="button-convert-push"
        >
          <Rocket size={20} className="mr-3" />
          {convertAndPushMutation.isPending ? "ChatGPT変換中..." : "ChatGPTで変換してGitHubにプッシュ"}
        </Button>
        
        <div className="mt-4 text-center">
          <p className="text-xs text-muted-foreground">
            ChatGPTがテキストを高品質なHTMLに変換し、リポジトリにコミットします
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
