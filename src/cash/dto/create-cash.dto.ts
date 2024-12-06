export class CreateCashDto {
  main: number;
  secondary: number;
  pending: number;
  income: number;
  outflows: number;
  todayPending: number;
  pastPaid: number;
  branchId: string;
  status?: boolean;
}
