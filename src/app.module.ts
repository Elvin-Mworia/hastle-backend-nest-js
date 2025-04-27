import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { EmployersModule } from './employers/employers.module';
import { AuthModule } from './auth/auth.module';
import { APP_FILTER, APP_GUARD, APP_PIPE } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { WorkersModule } from './workers/workers.module';

/**
 * Main application module that configures:
 * - Environment variable loading through ConfigModule
 * - Database connection through MongooseModule
 * - Authentication and authorization through AuthModule
 * - Global pipes for validation
 * - Global exception handling
 */
@Module({
  imports: [
    // Load environment variables from .env file
    ConfigModule.forRoot({
      isGlobal: true, // Make environment variables available across all modules
      cache: true, // Cache environment variables for performance
    }),
    
    // Configure MongoDB connection
    MongooseModule.forRoot(`${process.env.MONGODB_URI}`, {
      dbName: `${process.env.DB_NAME}`,
      // Add connection options as needed
      connectionFactory: (connection) => {
        // Log database connection status
        connection.on('connected', () => {
          console.log('MongoDB connected successfully');
        });
        connection.on('error', (error) => {
          console.error('MongoDB connection error:', error);
        });
        return connection;
      },
    }),
    
    // Feature modules - ordered by dependency requirements
    UsersModule,
    AuthModule,     // Depends on UsersModule
    EmployersModule, // Might depend on UsersModule
    WorkersModule,  // Might depend on UsersModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // Global validation pipe for all routes
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true, // Strip properties not in DTO
        forbidNonWhitelisted: true, // Throw error if non-whitelisted properties are provided
        transform: true, // Transform payloads to DTO instances
        transformOptions: {
          enableImplicitConversion: true, // Enable type conversion
        },
      }),
    },
    // Uncomment to enable global authentication
    // {
    //   provide: APP_GUARD,
    //   useClass: JwtAuthGuard,
    // },
  ],
})
export class AppModule {}
