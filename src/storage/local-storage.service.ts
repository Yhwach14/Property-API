import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs/promises';
import * as path from 'path';
import { StorageService } from './storage.service';

@Injectable()
export class LocalStorageService implements StorageService {
  private readonly uploadDir: string;
  private readonly publicBaseUrl: string;

  constructor(private readonly config: ConfigService) {
    this.uploadDir = this.config.get<string>('UPLOAD_DIR')!;
    this.publicBaseUrl = this.config.get<string>('PUBLIC_BASE_URL')!;
  }

  async save(buffer: Buffer, filename: string): Promise<void> {
    await fs.mkdir(this.uploadDir, { recursive: true });
    await fs.writeFile(path.join(this.uploadDir, filename), buffer);
  }

  async delete(filename: string): Promise<void> {
    try {
      await fs.unlink(path.join(this.uploadDir, filename));
    } catch (err: any) {
      if (err.code !== 'ENOENT') throw err; // already gone — fine
    }
  }

  getPublicUrl(filename: string): string {
    return `${this.publicBaseUrl}/uploads/${filename}`;
  }
}