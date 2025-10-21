import { Body, Controller, Post, Res } from '@nestjs/common';
import { UsersService } from '@/modules/users/users.service';
import { type FastifyReply } from 'fastify';
import { DodoCreateBodyUsersDto, DodoCreateResponseUsersDto } from '@/modules/users/dto/dodoCreateUsers.dto';
import { GetEmailUserBodyUsersDto, GetEmailUserResponseUsersDto } from '@/modules/users/dto/getEmailUserUsers.dto';
import { GetUserBodyUsersDto, GetUserResponseUsersDto } from '@/modules/users/dto/getUserUsers.dto';
import { VerifyJWTBodyUsersDto, VerifyJWTResponseUsersDto } from '@/modules/users/dto/verifyJWT.dto';
import { VerifyPlanBodyUsersDto, VerifyPlanResponseUsersDto } from '@/modules/users/dto/verifyPlanUsers.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@Post('dodo/create')
	dodoCreate(@Body() body: DodoCreateBodyUsersDto): Promise<DodoCreateResponseUsersDto> {
		return this.usersService.dodoCreate(body);
	}

	@Post('get-email')
	getEmailUser(@Body() body: GetEmailUserBodyUsersDto): Promise<GetEmailUserResponseUsersDto> {
		return this.usersService.getEmailUser(body);
	}

	@Post('get-user')
	getUser(@Body() body: GetUserBodyUsersDto): Promise<GetUserResponseUsersDto> {
		return this.usersService.getUser(body);
	}

	@Post('logout')
	logout(@Res() res: FastifyReply): Promise<void> {
		return this.usersService.logout(res);
	}

	@Post('verify-jwt')
	async verifyJWT(@Body() body: VerifyJWTBodyUsersDto): Promise<VerifyJWTResponseUsersDto> {
		return this.usersService.verifyJWT(body);
	}

	@Post('verify-plan')
	verifyPlan(@Body() body: VerifyPlanBodyUsersDto): Promise<VerifyPlanResponseUsersDto> {
		return this.usersService.verifyPlan(body);
	}
}
