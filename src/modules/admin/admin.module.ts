import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import MongooseModels from '@/schemas';
import { AdminController } from '@/modules/admin/admin.controller';
import { AdminService } from '@/modules/admin/admin.service';

@Module({
	imports: [MongooseModule.forFeature([...MongooseModels])],
	controllers: [AdminController],
	providers: [AdminService],
})
export class AdminModule {}
