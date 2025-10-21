import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class SignupBodyAuthDto {
	@ApiProperty({ example: 'john@example.com', description: 'Email of the user' })
	@IsEmail()
	@IsNotEmpty()
	email!: string;

	@ApiProperty({ example: 'password123', description: 'Password of the user' })
	@IsString()
	@IsNotEmpty()
	password!: string;

	@ApiProperty({ example: 'John', description: 'First name of the user' })
	@IsString()
	@IsNotEmpty()
	firstName!: string;

	@ApiProperty({ example: 'Doe', description: 'Last name of the user' })
	@IsString()
	@IsNotEmpty()
	lastName!: string;

	@ApiProperty({
		example: 'affiliateCode123',
		description: 'Affiliate code (optional)',
		required: false,
	})
	@IsString()
	@IsOptional()
	affiliate?: string;
}

export class SignupResponseAuthDto {
	@ApiProperty({ example: 'User created successfully' })
	message!: string;
}
