import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { convertTextSchema, insertGithubConfigSchema } from "@shared/schema";
import { Octokit } from "@octokit/rest";
import OpenAI from "openai";

export async function registerRoutes(app: Express): Promise<Server> {
  // Convert text to HTML and push to GitHub
  app.post("/api/convert-and-push", async (req, res) => {
    try {
      const validatedData = convertTextSchema.parse(req.body);
      
      // Get GitHub token from environment
      const githubToken = process.env.GITHUB_TOKEN || process.env.GITHUB_ACCESS_TOKEN;
      if (!githubToken) {
        return res.status(400).json({ 
          message: "GitHub token not configured. Please set GITHUB_TOKEN environment variable." 
        });
      }

      // Convert text to HTML using ChatGPT
      const htmlContent = await convertTextToHtmlWithChatGPT(validatedData.content);
      
      // Initialize Octokit
      const octokit = new Octokit({
        auth: githubToken,
      });

      // Parse repository (owner/repo format)
      const [owner, repo] = validatedData.repository.split('/');
      if (!owner || !repo) {
        return res.status(400).json({ 
          message: "Repository must be in format 'owner/repo'" 
        });
      }

      // Create file path
      const filePath = validatedData.directory 
        ? `${validatedData.directory.replace(/\/$/, '')}/${validatedData.fileName}.html`
        : `${validatedData.fileName}.html`;

      // Check if file exists to get SHA for update
      let sha: string | undefined;
      try {
        const { data: existingFile } = await octokit.rest.repos.getContent({
          owner,
          repo,
          path: filePath,
          ref: validatedData.branch,
        });
        
        if ('sha' in existingFile) {
          sha = existingFile.sha;
        }
      } catch (error: any) {
        // File doesn't exist, that's fine for new files
        if (error.status !== 404) {
          throw error;
        }
      }

      // Create or update file on GitHub
      const { data: commitData } = await octokit.rest.repos.createOrUpdateFileContents({
        owner,
        repo,
        path: filePath,
        message: validatedData.commitMessage,
        content: Buffer.from(htmlContent).toString('base64'),
        branch: validatedData.branch,
        ...(sha && { sha }),
      });

      // Save file record
      const file = await storage.createFile({
        fileName: validatedData.fileName,
        directory: validatedData.directory || "",
        content: validatedData.content,
        htmlContent,
        repository: validatedData.repository,
        branch: validatedData.branch,
        commitMessage: validatedData.commitMessage,
      });

      // Update file with GitHub URL
      const githubUrl = `https://github.com/${owner}/${repo}/blob/${validatedData.branch}/${filePath}`;
      
      res.json({
        success: true,
        file: {
          ...file,
          githubUrl
        },
        commitUrl: commitData.commit.html_url,
        fileUrl: githubUrl
      });
    } catch (error: any) {
      console.error('Error converting and pushing to GitHub:', error);
      
      let message = "Failed to convert and push to GitHub";
      if (error.status === 401) {
        message = "GitHub authentication failed. Please check your access token.";
      } else if (error.status === 404) {
        message = "Repository not found. Please check the repository name and your access permissions.";
      } else if (error.status === 403) {
        message = "Permission denied. Please check your GitHub access token permissions.";
      } else if (error.message) {
        message = error.message;
      }
      
      res.status(error.status || 500).json({ message });
    }
  });

  // Get recent files
  app.get("/api/files/recent", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const files = await storage.getRecentFiles(limit);
      res.json(files);
    } catch (error: any) {
      console.error('Error fetching recent files:', error);
      res.status(500).json({ message: "Failed to fetch recent files" });
    }
  });

  // Preview HTML conversion
  app.post("/api/preview", async (req, res) => {
    try {
      const { content } = req.body;
      if (!content) {
        return res.status(400).json({ message: "Content is required" });
      }
      
      const htmlContent = await convertTextToHtmlWithChatGPT(content);
      res.json({ htmlContent });
    } catch (error: any) {
      console.error('Error previewing HTML:', error);
      res.status(500).json({ message: "Failed to preview HTML" });
    }
  });

  // Test GitHub connection
  app.post("/api/github/test", async (req, res) => {
    try {
      const { repository } = req.body;
      
      const githubToken = process.env.GITHUB_TOKEN || process.env.GITHUB_ACCESS_TOKEN;
      if (!githubToken) {
        return res.status(400).json({ 
          message: "GitHub token not configured" 
        });
      }

      const octokit = new Octokit({
        auth: githubToken,
      });

      const [owner, repo] = repository.split('/');
      if (!owner || !repo) {
        return res.status(400).json({ 
          message: "Repository must be in format 'owner/repo'" 
        });
      }

      // Test access by getting repository info
      await octokit.rest.repos.get({
        owner,
        repo,
      });

      res.json({ success: true, message: "GitHub connection successful" });
    } catch (error: any) {
      console.error('Error testing GitHub connection:', error);
      
      let message = "GitHub connection failed";
      if (error.status === 401) {
        message = "GitHub authentication failed";
      } else if (error.status === 404) {
        message = "Repository not found";
      } else if (error.status === 403) {
        message = "Permission denied";
      }
      
      res.status(error.status || 500).json({ message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

async function convertTextToHtmlWithChatGPT(text: string): Promise<string> {
  const openaiApiKey = process.env.OPENAI_API_KEY;
  
  if (!openaiApiKey) {
    // Fallback to basic conversion if OpenAI API key is not available
    return convertTextToHtmlBasic(text);
  }

  try {
    const openai = new OpenAI({ apiKey: openaiApiKey });
    
    const response = await openai.chat.completions.create({
      model: "gpt-4", // the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: "You are an expert HTML generator. Convert the given text into well-structured, semantic HTML. Use appropriate tags like h1-h6 for headings, p for paragraphs, ul/ol/li for lists, strong/em for emphasis, blockquote for quotes, and a for links. Detect the structure and meaning of the text to create proper HTML markup. Return only the HTML body content without doctype, html, head, or body tags. Use clean, semantic HTML5."
        },
        {
          role: "user",
          content: `Convert this text to HTML:\n\n${text}`
        }
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    const htmlContent = result.html || result.content || "";
    
    // Wrap in complete HTML document
    return `<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ChatGPT生成コンテンツ</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', sans-serif; line-height: 1.6; margin: 2rem; color: #333; max-width: 800px; margin: 2rem auto; }
        h1, h2, h3, h4, h5, h6 { color: #2563eb; margin-top: 2rem; margin-bottom: 1rem; }
        h1 { font-size: 2rem; border-bottom: 2px solid #2563eb; padding-bottom: 0.5rem; }
        h2 { font-size: 1.5rem; }
        h3 { font-size: 1.25rem; }
        p { margin-bottom: 1rem; }
        ul, ol { margin-bottom: 1rem; padding-left: 2rem; }
        li { margin-bottom: 0.5rem; }
        blockquote { margin: 1rem 0; padding: 1rem; background: #f8f9fa; border-left: 4px solid #2563eb; font-style: italic; }
        strong { color: #1f2937; }
        em { color: #4b5563; }
        a { color: #2563eb; text-decoration: underline; }
        a:hover { color: #1d4ed8; }
        code { background: #f1f5f9; padding: 0.2rem 0.4rem; border-radius: 4px; font-family: monospace; }
        pre { background: #f8f9fa; padding: 1rem; border-radius: 8px; overflow-x: auto; }
    </style>
</head>
<body>
${htmlContent}
</body>
</html>`;
  } catch (error) {
    console.error('Error with ChatGPT HTML conversion:', error);
    // Fallback to basic conversion on error
    return convertTextToHtmlBasic(text);
  }
}

function convertTextToHtmlBasic(text: string): string {
  // Basic text to HTML conversion (fallback)
  let html = text
    // Convert URLs to links
    .replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" class="text-primary underline">$1</a>')
    // Convert line breaks to paragraphs
    .split('\n\n')
    .map(paragraph => {
      if (!paragraph.trim()) return '';
      
      // Check if it's a list
      if (paragraph.includes('\n- ') || paragraph.startsWith('- ')) {
        const listItems = paragraph
          .split('\n')
          .filter(line => line.trim().startsWith('- '))
          .map(line => `<li>${line.substring(2).trim()}</li>`)
          .join('\n');
        return `<ul>\n${listItems}\n</ul>`;
      }
      
      // Regular paragraph
      return `<p>${paragraph.replace(/\n/g, '<br>')}</p>`;
    })
    .filter(p => p)
    .join('\n\n');

  // Wrap in basic HTML structure
  return `<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>生成されたコンテンツ</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Hiragino Sans', 'Yu Gothic UI', sans-serif; line-height: 1.6; margin: 2rem; color: #333; }
        p { margin-bottom: 1rem; }
        ul { margin-bottom: 1rem; padding-left: 2rem; }
        li { margin-bottom: 0.5rem; }
        a { color: #2563eb; text-decoration: underline; }
        a:hover { color: #1d4ed8; }
    </style>
</head>
<body>
${html}
</body>
</html>`;
}
