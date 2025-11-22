import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Plataforma de Exámenes API v1.0';
  }
}

