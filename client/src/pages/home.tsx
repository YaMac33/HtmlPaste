import { useState } from "react";
import { Github } from "lucide-react";
import TextInputSection from "@/components/text-input-section";
import PreviewSection from "@/components/preview-section";
import FileSettingsSection from "@/components/file-settings-section";
import GithubSettingsSection from "@/components/github-settings-section";
import ActionSection from "@/components/action-section";
import StatusSection from "@/components/status-section";
import RecentFilesSection from "@/components/recent-files-section";

export default function Home() {
  const [content, setContent] = useState("私のブログ投稿へようこそ！\n\nこれは、テキストからHTMLへの変換がどのように機能するかを示すサンプル段落です。このツールは、適切なHTMLタグでこのコンテンツを自動的にフォーマットします。\n\n機能のリスト：\n- 段落の自動検出\n- 改行の処理\n- シンプルなフォーマットの保持\n- GitHub統合\n\n詳細については、https://example.com の私のウェブサイトをご覧ください。");
  const [fileName, setFileName] = useState("私のコンテンツ");
  const [directory, setDirectory] = useState("docs/");
  const [repository, setRepository] = useState("username/my-blog");
  const [branch, setBranch] = useState("main");
  const [commitMessage, setCommitMessage] = useState("新しいコンテンツを追加");

  return (
    <div className="min-h-screen py-8 px-4 bg-background text-foreground">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <Github className="text-3xl text-primary" size={32} />
            <h1 className="text-3xl font-bold text-foreground">ChatGPT HTML変換・発行ツール</h1>
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            テキストを貼り付けて、ChatGPTが高品質なHTMLに変換し、GitHubリポジトリに自動的にプッシュします
          </p>
        </header>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-6">
            <TextInputSection 
              content={content}
              setContent={setContent}
            />
            <PreviewSection content={content} />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <FileSettingsSection
              fileName={fileName}
              setFileName={setFileName}
              directory={directory}
              setDirectory={setDirectory}
            />
            <GithubSettingsSection
              repository={repository}
              setRepository={setRepository}
              branch={branch}
              setBranch={setBranch}
              commitMessage={commitMessage}
              setCommitMessage={setCommitMessage}
            />
            <ActionSection
              content={content}
              fileName={fileName}
              directory={directory}
              repository={repository}
              branch={branch}
              commitMessage={commitMessage}
            />
          </div>
        </div>

        <StatusSection />
        <RecentFilesSection />
      </div>
    </div>
  );
}
