import { User, UserSchema } from '@/schemas/user.schema';
import { ForgotPassMapping, ForgotPassMappingSchema } from '@/schemas/forgotPassMapping.schema';
import { UnverifiedUser, UnverifiedUserSchema } from '@/schemas/unverifiedUser.schema';
import { Affiliate, AffiliateSchema } from '@/schemas/affiliate.schema';
import { TempOrder, TempOrderSchema } from '@/schemas/tempOrder.schema';
import { Admin, AdminSchema } from '@/schemas/admin.schema';
import { ModelVisit, ModelVisitSchema } from '@/schemas/modelVisit.schema';
import { Visit, VisitSchema } from '@/schemas/visit.schema';

const MongooseModels = [
	{ name: User.name, schema: UserSchema },
	{ name: ForgotPassMapping.name, schema: ForgotPassMappingSchema },
	{ name: UnverifiedUser.name, schema: UnverifiedUserSchema },
	{ name: Affiliate.name, schema: AffiliateSchema },
	{ name: TempOrder.name, schema: TempOrderSchema },
	{ name: Admin.name, schema: AdminSchema },
	{ name: ModelVisit.name, schema: ModelVisitSchema },
	{ name: Visit.name, schema: VisitSchema },
];

export default MongooseModels;
