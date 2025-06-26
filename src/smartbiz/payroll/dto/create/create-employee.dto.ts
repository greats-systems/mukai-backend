export class CreateEmployeeDto {
  id?: string;
  created_at?: string;
  first_name?: string;
  surname?: string;
  birth_date?: string;
  works_number?: string;
  ssr_number?: string;
  nssa_number?: string;
  medical_aid_number?: string;
  period?: number;
  department?: string;
  start_date?: Date;
  end_date?: Date;
  bank?: string;
  branch?: string;
  account_number?: string;
  pobs_insurable_earnings?: number;
  pobs_contribution?: number;
  basic_apwcs?: number;
  actual_insurable_earnings?: number;
  updated_at?: Date;
}
