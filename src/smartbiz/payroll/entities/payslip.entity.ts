export class Payslip {
  id?: string;
  employee_id: string;
  month?: string;
  year?: number;
  base_pay?: number;
  transport_allowance?: number;
  housing_allowance?: number;
  commission?: number;
  gross_pay?: number;
  paye_usd?: number;
  aids_levy_usd?: number;
  nssa_levy_usd?: number;
  total_deductions_usd?: number;
  net_pay_usd?: number;
  created_at?: string;
  updated_at?: string;
}
