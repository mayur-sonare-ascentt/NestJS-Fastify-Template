import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';

export interface VisitType {
	visitTime: Date;
	page: string;
	userId?: string;
	ipAddress?: string;
}

export type VisitDocument = HydratedDocument<Visit>;

@Schema()
export class Visit extends Document implements VisitType {
	@Prop({ required: true, default: Date.now })
	visitTime!: Date;

	@Prop({ required: true })
	page!: string;

	@Prop()
	userId?: string;

	@Prop()
	referrer?: string;

	@Prop()
	ipAddress?: string;
}

export const VisitSchema = SchemaFactory.createForClass(Visit);
