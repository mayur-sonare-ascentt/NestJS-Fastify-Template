import { Module } from '@nestjs/common';
import { AuthController } from '@/modules/auth/auth.controller';
import { AuthService } from '@/modules/auth/auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import MongooseModels from '@/schemas';

@Module({
	imports: [MongooseModule.forFeature([...MongooseModels])],
	controllers: [AuthController],
	providers: [AuthService],
})
export class AuthModule {}
