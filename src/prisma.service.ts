import { Injectable, OnModuleInit, INestApplication } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }

  enableShutdownHooks(app: INestApplication) {
    // Assuming you're using process.on to handle shutdown events
    process.on('beforeExit', async () => {
      await app.close();
      await this.$disconnect();
    });
  }
}
