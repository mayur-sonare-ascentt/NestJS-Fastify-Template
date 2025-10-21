import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import MongooseModels from '@/schemas';
import { AffiliateController } from '@/modules/affiliate/affiliate.controller';
import { AffiliateService } from '@/modules/affiliate/affiliate.service';

@Module({
	imports: [MongooseModule.forFeature([...MongooseModels])],
	controllers: [AffiliateController],
	providers: [AffiliateService],
})
export class AffiliateModule {}
