import { Injectable, Logger } from '@nestjs/common';
import { AuthSeeder } from '../auth/seeders/auth.seeder';

@Injectable()
export class SeederService {
  private readonly logger = new Logger(SeederService.name);

  constructor(private readonly authSeeder: AuthSeeder) {}

  async seed() {
    try {
      this.logger.log('Starting database seeding...');

      await this.authSeeder.seed();

      this.logger.log('Database seeding completed successfully!');
    } catch (error) {
      this.logger.error('Database seeding failed:', error);
      throw error;
    }
  }
}
