export interface UserProfile {
  name: string;
  role: "patient" | "operator";
}

export interface LabTest {
  id: string;
  name: string;
  description: string;
  price: number;
}

export type FulfillmentMethod = 'home_kit' | 'home_visit' | 'partner_clinic';

export interface Order {
  id: string;
  testId: string;
  testName: string;
  status: 'pending_collection' | 'processing' | 'completed';
  fulfillmentMethod: FulfillmentMethod;
  scheduledAt: string;
  results?: Record<string, string>;
  updatedAt: string;
}

export interface BusinessPlanBaseEntry {
  id: string;
  category: string;
  vendor: string;
  amount: number;
  cost_for_each: number;
  projectCode: string;
  notes: string;
}

export interface CapexEntry extends BusinessPlanBaseEntry {

}

export interface OpexEntry extends BusinessPlanBaseEntry {

}

export interface ThingThatPeopleBuy {
  name: string;
  price: number;
  projected_sales_per_month: number;
}

export interface CustomerAcquisitionCost {
  name: string;
  price: number;
}

interface Loan {
  name: string;
  initial_size: number;
  remaining_size: number;
  interest_rate: number;
}

interface Investment {
  name: string;
  size: string;
}

export interface CompanyBankAccount {
  initial_money: number;
  loans: Loan[];
  investments: Investment[];
}
