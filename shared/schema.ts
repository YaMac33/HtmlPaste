import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const files = pgTable("files", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  fileName: text("file_name").notNull(),
  directory: text("directory").default(""),
  content: text("content").notNull(),
  htmlContent: text("html_content").notNull(),
  repository: text("repository").notNull(),
  branch: text("branch").notNull().default("main"),
  commitMessage: text("commit_message").notNull(),
  githubUrl: text("github_url"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const githubConfigs = pgTable("github_configs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  repository: text("repository").notNull(),
  branch: text("branch").notNull().default("main"),
  accessToken: text("access_token").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertFileSchema = createInsertSchema(files).pick({
  fileName: true,
  directory: true,
  content: true,
  htmlContent: true,
  repository: true,
  branch: true,
  commitMessage: true,
});

export const insertGithubConfigSchema = createInsertSchema(githubConfigs).pick({
  repository: true,
  branch: true,
  accessToken: true,
});

export const convertTextSchema = z.object({
  content: z.string().min(1, "Content is required"),
  fileName: z.string().min(1, "File name is required"),
  directory: z.string().optional(),
  repository: z.string().min(1, "Repository is required"),
  branch: z.string().min(1, "Branch is required"),
  commitMessage: z.string().min(1, "Commit message is required"),
});

export type InsertFile = z.infer<typeof insertFileSchema>;
export type File = typeof files.$inferSelect;
export type InsertGithubConfig = z.infer<typeof insertGithubConfigSchema>;
export type GithubConfig = typeof githubConfigs.$inferSelect;
export type ConvertTextRequest = z.infer<typeof convertTextSchema>;
