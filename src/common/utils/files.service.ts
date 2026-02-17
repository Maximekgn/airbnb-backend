// url-generator.service.ts
import { Injectable } from '@nestjs/common';
import fs from 'fs';
import { join } from 'path';

@Injectable()
export class FileService {
  constructor() {}

  deleteFile(path: string | null) {
    if (!path || path.startsWith('http')) return;
    const absolutePath = join(process.cwd(), path);
    if (fs.existsSync(absolutePath)) {
      try {
        fs.unlinkSync(absolutePath);
      } catch (err) {
        console.error(`Erreur lors de la suppression du fichier ${absolutePath}:`, err);
      }
    }
  }
}