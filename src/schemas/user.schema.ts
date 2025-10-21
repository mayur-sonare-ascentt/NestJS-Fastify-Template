import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';

export interface UserType {
	firstName: string;
	lastName: string;
	email: string;
	password: string;
	plan: string;
	createdAt: Date;
	updatedAt: Date;
}

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User extends Document implements UserType {
	@Prop({ required: true, unique: true })
	firstName!: string;

	@Prop({ required: true, unique: true })
	lastName!: string;

	@Prop({ required: true, unique: true })
	email!: string;

	@Prop({ required: true })
	password!: string;

	@Prop({
		required: true,
		enum: ['free', 'premium', 'enterprise'],
		default: 'free',
	})
	plan!: string;

	createdAt!: Date;
	updatedAt!: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
