export interface StorageService {
  save(buffer: Buffer, filename: string): Promise<void>;
  delete(filename: string): Promise<void>;
  getPublicUrl(filename: string): string;
}

export const STORAGE_SERVICE = 'STORAGE_SERVICE';