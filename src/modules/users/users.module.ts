import { Module } from '@nestjs/common';
import { UsersController } from '@/modules/users/users.controller';
import { UsersService } from '@/modules/users/users.service';
import { MongooseModule } from '@nestjs/mongoose';
import MongooseModels from '@/schemas';

@Module({
	imports: [MongooseModule.forFeature([...MongooseModels])],
	controllers: [UsersController],
	providers: [UsersService],
})
export class UsersModule {}
