import {
	BadRequestException,
	ConflictException,
	Injectable,
	InternalServerErrorException,
	UnauthorizedException,
} from '@nestjs/common';
import { type FastifyReply } from 'fastify';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { SignJWT } from 'jose';
import { User, UserDocument } from '@/schemas/user.schema';
import { ForgotPassMapping, ForgotPassMappingDocument } from '@/schemas/forgotPassMapping.schema';
import { ForgotPassBodyAuthDto, ForgotPassResponseAuthDto } from '@/modules/auth/dto/forgotPassAuth.dto';
import { EmailService } from '@/modules/core/services/email.service';
import { ForgotPassResetBodyAuthDto, ForgotPassResetResponseAuthDto } from '@/modules/auth/dto/forgotPassResetAuth.dto';
import {
	ForgotPassVerifyBodyAuthDto,
	ForgotPassVerifyResponseAuthDto,
} from '@/modules/auth/dto/forgotPassVerifyAuth.dto';
import { SigninBodyAuthDto, SigninResponseAuthDto } from '@/modules/auth/dto/signinAuth.dto';
import { UnverifiedUser, UnverifiedUserDocument } from '@/schemas/unverifiedUser.schema';
import { SignupBodyAuthDto, SignupResponseAuthDto } from '@/modules/auth/dto/signupAuth.dto';
import { Affiliate, AffiliateDocument } from '@/schemas/affiliate.schema';
import { ENVService } from '@/modules/core/services/env.service';
import { VerifyQueryAuthDto, VerifyResponseAuthDto } from '@/modules/auth/dto/verifyAuth.dto';

@Injectable()
export class AuthService {
	constructor(
		@InjectModel(User.name) private userModel: Model<UserDocument>,
		@InjectModel(ForgotPassMapping.name)
		private forgotPassMappingModel: Model<ForgotPassMappingDocument>,
		@InjectModel(UnverifiedUser.name)
		private unverifiedUserModel: Model<UnverifiedUserDocument>,
		@InjectModel(Affiliate.name) private affiliateModel: Model<AffiliateDocument>,
		private readonly emailService: EmailService,
		private readonly envService: ENVService,
	) {}

	async forgotPass(dto: ForgotPassBodyAuthDto): Promise<ForgotPassResponseAuthDto> {
		try {
			const { email } = dto;

			if (!email) {
				throw new BadRequestException('Email is required');
			}

			// Check if user exists
			const user = await this.userModel.findOne({ email });
			if (!user) {
				throw new UnauthorizedException('Invalid email');
			}

			// Generate 6-digit verification code
			const code = Math.floor(100000 + Math.random() * 900000);

			// Update or create forgot password record
			const userForgot = await this.forgotPassMappingModel.findOne({ email });
			if (userForgot) {
				userForgot.code = code;
				await userForgot.save();
			} else {
				const forgotUser = new ForgotPassMapping({ email: user.email, code });
				await forgotUser.save();
			}

			// Prepare email
			const mailOptions = {
				from: this.envService.variables.email.user,
				to: user.email,
				subject: 'Verify Your Account',
				html: `
        <div style="font-family: Arial, sans-serif; padding: 40px 0; background-color: #f4f4f4;">
          <div style="max-width: 480px; margin: auto; background: white; padding: 40px 30px; border-radius: 20px;">
              <div style="text-align: center; margin-bottom: 30px;">
                <img src="https://www.firstoxstudio.com/images/firstox-logo.png" alt="Logo" width="120" height="36" />
              </div>
              <h2 style="font-size: 24px; font-weight: bold; color: #000; margin-bottom: 10px;">Reset Your Password</h2>
              <p style="font-size: 16px; color: #333; margin-bottom: 20px;">
                  We received a request to reset your password. Use the verification code below to proceed.
              </p>
              <div style="font-size: 28px; font-weight: bold; color: #000; background-color: #f0f0f0; padding: 12px 24px; border-radius: 8px; text-align: center; margin-bottom: 30px;">
                  ${code}
              </div>
              <p style="font-size: 14px; color: #666; margin-bottom: 20px;">
                  If you did not request a password reset, you can safely ignore this email.
              </p>
              <p style="font-size: 14px; color: #666;">
                  Thanks <span style="font-size: 16px;">🤗</span>,<br>
                  FirstOx Studio team
              </p>
          </div>
        </div>
      `,
			};

			await this.emailService.sendMail(mailOptions);

			return { message: 'Verification code sent' };
		} catch (error) {
			console.error('Error during forgotPass:', error);
			throw new InternalServerErrorException('Internal Server Error');
		}
	}

	async forgotPassReset(dto: ForgotPassResetBodyAuthDto): Promise<ForgotPassResetResponseAuthDto> {
		const { email, password } = dto;

		if (!email || !password) {
			throw new BadRequestException('Email and password are required');
		}

		// Find the user
		const user = await this.userModel.findOne({ email });
		if (!user) {
			throw new UnauthorizedException('Invalid email');
		}

		try {
			// Hash the new password
			const hashedPassword = await bcrypt.hash(password, 10);
			user.password = hashedPassword;

			// Save user
			await user.save();

			return { message: 'Password successfully updated' };
		} catch (error) {
			console.error('Error during password reset:', error);
			throw new InternalServerErrorException('Internal Server Error');
		}
	}

	async forgotPassVerify(dto: ForgotPassVerifyBodyAuthDto): Promise<ForgotPassVerifyResponseAuthDto> {
		const { email, code } = dto;

		if (!email || !code) {
			throw new BadRequestException('Email and code are required');
		}

		const user = await this.userModel.findOne({ email });
		if (!user) {
			throw new UnauthorizedException('Invalid email');
		}

		const userForgot = await this.forgotPassMappingModel.findOne({ email });
		if (!userForgot) {
			throw new InternalServerErrorException('Verification record not found');
		}

		if (userForgot.code === parseInt(code)) {
			await userForgot.deleteOne();
			return { message: 'Verification successful' };
		}

		throw new BadRequestException('Verification code does not match');
	}

	async signin(dto: SigninBodyAuthDto): Promise<SigninResponseAuthDto> {
		const { email, password } = dto;

		if (!email || !password) {
			throw new BadRequestException('Email and password are required');
		}

		const user = await this.userModel.findOne({ email });
		if (!user) {
			throw new UnauthorizedException('Invalid email or password');
		}

		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) {
			throw new UnauthorizedException('Invalid email or password');
		}

		try {
			const jwtSecret = new TextEncoder().encode(this.envService.variables.jwt.secret);
			const token = await new SignJWT({
				userId: user._id as string,
				email: user.email,
			})
				.setProtectedHeader({ alg: 'HS256' })
				.setExpirationTime(`${this.envService.variables.jwt.expiresIn}s`)
				.sign(jwtSecret);

			return { message: 'Login successful', token };
		} catch (err) {
			console.error('JWT generation error:', err);
			throw new InternalServerErrorException('Failed to generate token');
		}
	}

	async signup(dto: SignupBodyAuthDto): Promise<SignupResponseAuthDto> {
		const { email, password, firstName, lastName, affiliate } = dto;

		if (!email || !password || !firstName || !lastName) {
			throw new BadRequestException('Email, password, first name, and last name are required');
		}

		// Check if user already exists
		const existingUser = await this.unverifiedUserModel.findOne({ email });
		if (existingUser) {
			throw new ConflictException('Email is already registered');
		}

		// Remove any previous unverified user with the same email
		await this.unverifiedUserModel.findOneAndDelete({ email });

		// Hash password
		const hashedPassword = await bcrypt.hash(password, 10);

		// Save user in MongoDB
		const user = new this.unverifiedUserModel({
			email,
			hashedPassword,
			firstName,
			lastName,
			affiliate: affiliate || null,
		});

		// Send verification email
		const verifyUrl = `${this.envService.variables.frontend.appUrl}/api/auth/verify?email=${email}&token=${user._id as string}`;
		const mailOptions = {
			from: this.envService.variables.email.user,
			to: email,
			subject: 'Verify Your Account',
			html: `
        <div style="font-family: Arial, sans-serif; padding: 40px 0; background-color: #f4f4f4;">
          <div style="max-width: 480px; margin: auto; background: white; padding: 40px 30px; border-radius: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <img src="https://www.firstoxstudio.com/images/firstox-logo.png" alt="Logo" width="120" height="36" />
            </div>
            <h2 style="font-size: 24px; font-weight: bold; color: #000; margin-bottom: 10px;">Verify Your Account</h2>
            <p style="font-size: 16px; color: #333; margin-bottom: 30px;">
              Thank you for signing up! Please verify your account by clicking the button below.
            </p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${verifyUrl}"
                style="padding: 14px 28px; font-size: 16px; color: white; background-color: #000; text-decoration: none; border-radius: 8px; display: inline-block;">
                Verify My Account
              </a>
            </div>
            <p style="font-size: 14px; color: #666; margin-bottom: 30px;">
              If you did not request this, you can ignore this email.
            </p>
            <p style="font-size: 14px; color: #666;">
              Thanks <span style="font-size: 16px;">🤗</span>,<br>
              LinkPlease team
            </p>
            <p style="font-size: 12px; text-align: center; color: #999; margin-top: 40px;">
              &copy; ${new Date().getFullYear()} Your Company Name. All rights reserved.
            </p>
          </div>
        </div>
      `,
		};

		await this.emailService.sendMail(mailOptions);
		await user.save();

		return { message: 'User registered. Check your email to verify.' };
	}

	async verify(query: VerifyQueryAuthDto, reply: FastifyReply): Promise<VerifyResponseAuthDto> {
		const { email, token } = query;

		try {
			// Validate query parameters
			if (!email || !token) {
				throw new BadRequestException('Invalid or missing parameters');
			}

			// Find the unverified user
			const unverifiedUser = await this.unverifiedUserModel.findOne({
				_id: token,
				email,
			});
			if (!unverifiedUser) {
				throw new BadRequestException('Invalid or expired token');
			}

			// Create a verified user
			await this.userModel.create({
				email: unverifiedUser.email,
				password: unverifiedUser.hashedPassword,
				firstName: unverifiedUser.firstName,
				lastName: unverifiedUser.lastName,
			});

			// Delete from unverified collection
			await this.unverifiedUserModel.deleteOne({ _id: token });

			// Handle affiliate logic
			if (unverifiedUser.affiliate) {
				const affiliate = await this.affiliateModel.findOne({
					username: unverifiedUser.affiliate,
				});
				if (affiliate) {
					affiliate.signup_refers += 1;
					await affiliate.save();
				}
			}

			// Redirect to success page
			reply.redirect('/success');
			return { success: true, message: 'User verified and redirected' };
		} catch (error) {
			console.error('Verification Error:', error);
			if (error instanceof BadRequestException) throw error;
			throw new InternalServerErrorException('Internal Server Error');
		}
	}
}
