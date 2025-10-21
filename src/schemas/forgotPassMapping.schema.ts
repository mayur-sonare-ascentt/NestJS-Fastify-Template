import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';

export interface ForgotPassMappingType {
	email: string;
	code: number;
}

export type ForgotPassMappingDocument = HydratedDocument<ForgotPassMapping>;

@Schema()
export class ForgotPassMapping extends Document implements ForgotPassMappingType {
	@Prop({ required: true, unique: true })
	email!: string;

	@Prop({ required: true })
	code!: number;
}

export const ForgotPassMappingSchema = SchemaFactory.createForClass(ForgotPassMapping);
