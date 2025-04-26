import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { EmployersModule } from './employers/employers.module';
import { JobsModule } from './jobs/jobs.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(`${process.env.MONGODB_URI}`, {
      dbName: `${process.env.DB_NAME}`,
    }),
    UsersModule,
    EmployersModule,
    JobsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
