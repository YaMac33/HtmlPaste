import { useState, useEffect } from "react";
import { CheckCircle, AlertTriangle, Loader2, ExternalLink, Eye } from "lucide-react";

interface StatusData {
  success?: {
    file: any;
    fileUrl: string;
    commitUrl: string;
  };
  error?: {
    error: string;
  };
}

export default function StatusSection() {
  const [status, setStatus] = useState<'hidden' | 'loading' | 'success' | 'error'>('hidden');
  const [statusData, setStatusData] = useState<StatusData>({});

  useEffect(() => {
    const handlePushSuccess = (event: CustomEvent) => {
      setStatus('success');
      setStatusData({ success: event.detail });
    };

    const handlePushError = (event: CustomEvent) => {
      setStatus('error');
      setStatusData({ error: event.detail });
    };

    // Listen for push start to show loading
    const handlePushStart = () => {
      setStatus('loading');
      setStatusData({});
    };

    window.addEventListener('push-success', handlePushSuccess as EventListener);
    window.addEventListener('push-error', handlePushError as EventListener);
    
    // We'll trigger loading state from the action component
    return () => {
      window.removeEventListener('push-success', handlePushSuccess as EventListener);
      window.removeEventListener('push-error', handlePushError as EventListener);
    };
  }, []);

  if (status === 'hidden') return null;

  return (
    <div className="mt-8" data-testid="status-section">
      {status === 'success' && statusData.success && (
        <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg p-4" data-testid="status-success">
          <div className="flex items-start gap-3">
            <CheckCircle className="text-green-600 dark:text-green-400 mt-0.5" size={20} />
            <div className="flex-1">
              <h4 className="font-medium text-green-800 dark:text-green-200">正常に公開されました！</h4>
              <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                コンテンツがHTMLに変換され、{' '}
                <span className="font-mono" data-testid="text-success-repo">
                  {statusData.success.file.repository}
                </span>
                にプッシュされました
              </p>
              <div className="mt-3 flex items-center gap-4">
                {statusData.success.fileUrl && (
                  <a 
                    href={statusData.success.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-green-600 dark:text-green-400 hover:underline flex items-center gap-2"
                    data-testid="link-view-github"
                  >
                    <ExternalLink size={14} />
                    GitHubで表示
                  </a>
                )}
                {statusData.success.commitUrl && (
                  <a 
                    href={statusData.success.commitUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-green-600 dark:text-green-400 hover:underline flex items-center gap-2"
                    data-testid="link-view-commit"
                  >
                    <Eye size={14} />
                    コミットを表示
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {status === 'loading' && (
        <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4" data-testid="status-loading">
          <div className="flex items-start gap-3">
            <Loader2 className="text-blue-600 dark:text-blue-400 mt-0.5 animate-spin" size={20} />
            <div className="flex-1">
              <h4 className="font-medium text-blue-800 dark:text-blue-200">処理中...</h4>
              <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                テキストをHTMLに変換してGitHubにプッシュ中...
              </p>
            </div>
          </div>
        </div>
      )}

      {status === 'error' && statusData.error && (
        <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg p-4" data-testid="status-error">
          <div className="flex items-start gap-3">
            <AlertTriangle className="text-red-600 dark:text-red-400 mt-0.5" size={20} />
            <div className="flex-1">
              <h4 className="font-medium text-red-800 dark:text-red-200">エラーが発生しました</h4>
              <p className="text-sm text-red-700 dark:text-red-300 mt-1" data-testid="text-error-message">
                {statusData.error.error || "GitHubへのプッシュに失敗しました。設定を確認してもう一度試してください。"}
              </p>
              <button 
                onClick={() => setStatus('hidden')}
                className="mt-3 text-sm text-red-600 dark:text-red-400 hover:underline flex items-center gap-2"
                data-testid="button-dismiss-error"
              >
                閉じる
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
