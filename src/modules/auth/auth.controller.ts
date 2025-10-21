import { Body, Controller, Get, Post, Query, Res } from '@nestjs/common';
import { type FastifyReply } from 'fastify';
import { AuthService } from '@/modules/auth/auth.service';
import { SignupBodyAuthDto, SignupResponseAuthDto } from '@/modules/auth/dto/signupAuth.dto';
import { SigninBodyAuthDto, SigninResponseAuthDto } from '@/modules/auth/dto/signinAuth.dto';
import { ForgotPassBodyAuthDto, ForgotPassResponseAuthDto } from '@/modules/auth/dto/forgotPassAuth.dto';
import { ForgotPassResetBodyAuthDto, ForgotPassResetResponseAuthDto } from '@/modules/auth/dto/forgotPassResetAuth.dto';
import {
	ForgotPassVerifyBodyAuthDto,
	ForgotPassVerifyResponseAuthDto,
} from '@/modules/auth/dto/forgotPassVerifyAuth.dto';
import { VerifyQueryAuthDto, VerifyResponseAuthDto } from '@/modules/auth/dto/verifyAuth.dto';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post('signup')
	@ApiBody({ type: SignupBodyAuthDto })
	@ApiResponse({
		status: 201,
		description: 'User created successfully',
		type: SignupResponseAuthDto,
	})
	@ApiResponse({ status: 400, description: 'Bad Request' })
	@ApiResponse({ status: 500, description: 'Internal Server Error' })
	signup(@Body() body: SignupBodyAuthDto): Promise<SignupResponseAuthDto> {
		return this.authService.signup(body);
	}

	@Post('signin')
	signin(@Body() body: SigninBodyAuthDto): Promise<SigninResponseAuthDto> {
		return this.authService.signin(body);
	}

	@Post('forgot-pass')
	forgotPass(@Body() body: ForgotPassBodyAuthDto): Promise<ForgotPassResponseAuthDto> {
		return this.authService.forgotPass(body);
	}

	@Post('forgot-pass-reset')
	forgotPassReset(@Body() body: ForgotPassResetBodyAuthDto): Promise<ForgotPassResetResponseAuthDto> {
		return this.authService.forgotPassReset(body);
	}

	@Post('forgot-pass-verify')
	forgotPassVerify(@Body() body: ForgotPassVerifyBodyAuthDto): Promise<ForgotPassVerifyResponseAuthDto> {
		return this.authService.forgotPassVerify(body);
	}

	@Get('verify')
	async verify(@Query() query: VerifyQueryAuthDto, @Res() reply: FastifyReply): Promise<VerifyResponseAuthDto> {
		return this.authService.verify(query, reply);
	}
}
