import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EmployersService } from './employers.service';
import { EmployersController } from './employers.controller';
import { Employer, EmployerSchema } from './schemas/employer.schema';
import { Job, JobSchema } from '../jobs/schemas/job.schema';
import { Worker, WorkerSchema } from '../workers/schemas/worker.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Employer.name, schema: EmployerSchema },
      { name: Job.name, schema: JobSchema },
      { name: Worker.name, schema: WorkerSchema },
    ]),
  ],
  controllers: [EmployersController],
  providers: [EmployersService],
  exports: [EmployersService],
})
export class EmployersModule {}
