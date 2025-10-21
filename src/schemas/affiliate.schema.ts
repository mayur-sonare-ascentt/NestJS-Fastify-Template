import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';

export interface AffiliateType {
	username: string;
	password: string;
	total_refers: number;
	signup_refers: number;
	success_refers: number;
	refs: string[];
	createdAt: Date;
	updatedAt: Date;
}

export type AffiliateDocument = HydratedDocument<Affiliate>;

@Schema({ timestamps: true })
export class Affiliate extends Document implements AffiliateType {
	@Prop({ required: true, unique: true })
	username!: string;

	@Prop({ required: true })
	password!: string;

	@Prop({ default: 0 })
	total_refers!: number;

	@Prop({ default: 0 })
	signup_refers!: number;

	@Prop({ default: 0 })
	success_refers!: number;

	@Prop({ type: [String], default: [] })
	refs!: string[];

	createdAt!: Date;
	updatedAt!: Date;
}

export const AffiliateSchema = SchemaFactory.createForClass(Affiliate);
