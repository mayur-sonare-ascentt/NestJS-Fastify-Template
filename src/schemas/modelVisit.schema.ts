import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';

export interface ModelVisitType {
	visitTime: Date;
	objectModel: string;
	userId?: string;
	ipAddress?: string;
}

export type ModelVisitDocument = HydratedDocument<ModelVisit>;

@Schema()
export class ModelVisit extends Document implements ModelVisitType {
	@Prop({ required: true, default: Date.now })
	visitTime!: Date;

	@Prop({ required: true })
	objectModel!: string;

	@Prop()
	userId?: string;

	@Prop()
	ipAddress?: string;
}

export const ModelVisitSchema = SchemaFactory.createForClass(ModelVisit);
