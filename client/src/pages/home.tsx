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
  const [content, setContent] = useState("Welcome to my blog post!\n\nThis is a sample paragraph that demonstrates how the text-to-HTML conversion works. The tool will automatically format this content with proper HTML tags.\n\nHere's a list of features:\n- Automatic paragraph detection\n- Line break handling\n- Simple formatting preservation\n- GitHub integration\n\nVisit my website at https://example.com for more information.");
  const [fileName, setFileName] = useState("my-content");
  const [directory, setDirectory] = useState("docs/");
  const [repository, setRepository] = useState("username/my-blog");
  const [branch, setBranch] = useState("main");
  const [commitMessage, setCommitMessage] = useState("Add new content");

  return (
    <div className="min-h-screen py-8 px-4 bg-background text-foreground">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <Github className="text-3xl text-primary" size={32} />
            <h1 className="text-3xl font-bold text-foreground">Text to HTML Publisher</h1>
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Paste your text, convert it to HTML, and automatically push it to your GitHub repository
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
