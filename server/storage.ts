import { type File, type InsertFile, type GithubConfig, type InsertGithubConfig } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getFile(id: string): Promise<File | undefined>;
  createFile(file: InsertFile): Promise<File>;
  getRecentFiles(limit?: number): Promise<File[]>;
  getGithubConfig(repository: string): Promise<GithubConfig | undefined>;
  saveGithubConfig(config: InsertGithubConfig): Promise<GithubConfig>;
}

export class MemStorage implements IStorage {
  private files: Map<string, File>;
  private githubConfigs: Map<string, GithubConfig>;

  constructor() {
    this.files = new Map();
    this.githubConfigs = new Map();
  }

  async getFile(id: string): Promise<File | undefined> {
    return this.files.get(id);
  }

  async createFile(insertFile: InsertFile): Promise<File> {
    const id = randomUUID();
    const file: File = { 
      ...insertFile, 
      id,
      createdAt: new Date(),
      githubUrl: null
    };
    this.files.set(id, file);
    return file;
  }

  async getRecentFiles(limit: number = 10): Promise<File[]> {
    const files = Array.from(this.files.values())
      .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0))
      .slice(0, limit);
    return files;
  }

  async getGithubConfig(repository: string): Promise<GithubConfig | undefined> {
    return this.githubConfigs.get(repository);
  }

  async saveGithubConfig(insertConfig: InsertGithubConfig): Promise<GithubConfig> {
    const id = randomUUID();
    const config: GithubConfig = {
      ...insertConfig,
      id,
      createdAt: new Date()
    };
    this.githubConfigs.set(insertConfig.repository, config);
    return config;
  }
}

export const storage = new MemStorage();
