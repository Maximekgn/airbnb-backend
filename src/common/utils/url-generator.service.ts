// url-generator.service.ts
import { Injectable } from '@nestjs/common';

@Injectable()
export class UrlGeneratorService {
  constructor() {}

  generateUrl(imagePath: string | null): string | null {
    if (!imagePath) {
      return null;
    }
    const baseUrl = process.env.BACKEND_URL || 'http://localhost:3000';
    return `${baseUrl}/${imagePath}`;
  }
}
