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
        title: "Success!",
        description: `File successfully pushed to ${repository}`,
      });
      
      // Invalidate recent files to refresh the list
      queryClient.invalidateQueries({ queryKey: ['/api/files/recent'] });
      
      // Store success data for status section
      window.dispatchEvent(new CustomEvent('push-success', { detail: data }));
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to convert and push to GitHub",
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
          {convertAndPushMutation.isPending ? "Processing..." : "Convert & Push to GitHub"}
        </Button>
        
        <div className="mt-4 text-center">
          <p className="text-xs text-muted-foreground">
            This will convert your text to HTML and commit it to your repository
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
