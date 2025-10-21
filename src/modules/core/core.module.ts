import { Module, Global } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CoreController } from '@/modules/core/core.controller';
import { CoreService } from '@/modules/core/core.service';
import { DodoPaymentsService } from '@/modules/core/services/dodoPayments.service';
import { EmailService } from '@/modules/core/services/email.service';
import { UtilsService } from '@/modules/core/services/utils.service';
import { ENVService } from '@/modules/core/services/env.service';

@Global() // Make this module global
@Module({
	imports: [ConfigModule],
	controllers: [CoreController],
	providers: [CoreService, EmailService, DodoPaymentsService, UtilsService, ENVService], // add Dodo service here
	exports: [EmailService, DodoPaymentsService, UtilsService, ENVService], // export so it can be injected anywhere
})
export class CoreModule {}
