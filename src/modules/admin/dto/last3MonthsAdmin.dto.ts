export class Last3MonthsResponseAdminDto {
	startDate!: string;
	endDate!: string;
	chartData!: { date: string; visits: number }[];
	trending!: number;
	up!: boolean;
}
