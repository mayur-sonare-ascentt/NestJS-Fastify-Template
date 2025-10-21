import { Body, Controller, Get, Post } from '@nestjs/common';
import { AdminService } from '@/modules/admin/admin.service';
import { SigninAdminDto } from '@/modules/admin/dto/signinAdmin.dto';
import { Last3MonthsResponseAdminDto } from '@/modules/admin/dto/last3MonthsAdmin.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Admin')
@Controller('admin')
export class AdminController {
	constructor(private readonly adminService: AdminService) {}

	@Post('signin')
	async signin(@Body() body: SigninAdminDto) {
		return this.adminService.signin(body);
	}

	@Get('last-3-months')
	async statsLast3Month(): Promise<Last3MonthsResponseAdminDto> {
		return this.adminService.getStatsLast3Month();
	}
}
