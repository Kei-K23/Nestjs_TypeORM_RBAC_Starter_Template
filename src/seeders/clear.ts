import { NestFactory } from '@nestjs/core';
import { SeederModule } from './seeder.module';
import { ClearService } from './clear.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(SeederModule);
  const clearService = app.get(ClearService);

  try {
    // Use clearAll() for safe deletion or truncateAll() for faster clearing
    const method =
      process.argv[2] === '--truncate' ? 'truncateAll' : 'clearAll';

    console.log(`Using ${method} method...`);
    await clearService[method]();

    console.log('✅ Database cleared successfully!');
  } catch (error) {
    console.error('❌ Failed to clear database:', error);
    process.exit(1);
  } finally {
    await app.close();
  }
}

bootstrap();
