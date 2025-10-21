import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';

export interface AdminType {
	email: string;
	password: string;
	createdAt: Date;
	updatedAt: Date;
}

export type AdminDocument = HydratedDocument<Admin>;

@Schema({ timestamps: true })
export class Admin extends Document implements AdminType {
	@Prop({ required: true, unique: true })
	email!: string;

	@Prop({ required: true })
	password!: string;

	createdAt!: Date;
	updatedAt!: Date;
}

export const AdminSchema = SchemaFactory.createForClass(Admin);
