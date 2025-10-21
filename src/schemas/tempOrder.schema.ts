import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';

export interface TempOrderType {
	email: string;
	code: string;
	paymentId: string;
	affiliate?: string | null;
}

export type TempOrderDocument = HydratedDocument<TempOrder>;

@Schema({ timestamps: true })
export class TempOrder extends Document implements TempOrderType {
	@Prop({ required: true, unique: true })
	email!: string;

	@Prop({ required: true, unique: true })
	code!: string;

	@Prop({ required: true, unique: true })
	paymentId!: string;

	@Prop({ type: String, default: null })
	affiliate?: string | null;

	createdAt!: Date;
	updatedAt!: Date;
}

export const TempOrderSchema = SchemaFactory.createForClass(TempOrder);
