import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';

export interface UnverifiedUserType {
	email: string;
	firstName: string;
	lastName: string;
	hashedPassword: string;
	createdAt: Date;
	affiliate?: string | null;
}

export type UnverifiedUserDocument = HydratedDocument<UnverifiedUser>;

@Schema()
export class UnverifiedUser extends Document implements UnverifiedUserType {
	@Prop({ required: true, unique: true, lowercase: true, trim: true })
	email!: string;

	@Prop({ required: true, trim: true })
	firstName!: string;

	@Prop({ required: true, trim: true })
	lastName!: string;

	@Prop({ required: true })
	hashedPassword!: string;

	@Prop({ type: Date, default: Date.now, expires: '24h' })
	createdAt!: Date;

	@Prop({ type: String, default: null })
	affiliate?: string | null;
}

export const UnverifiedUserSchema = SchemaFactory.createForClass(UnverifiedUser);
