export interface UserProfile {
  name: string;
  role: "patient" | "operator";
}

interface LabTestValue {
  number: number;
  date: number; // I am thinking of using the same time format as Linux is using because it's probably easier to short, store and handle instead of using the Data type. I may or may not be wrong on this.
}

export interface LabTest {
  id: string;
  name: string;
  description: string;
  price: number;
  past_values: LabTestValue[];
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
  userId?: string;
  name: string;
  price: number;
  amount: number;
  createdAt?: number;
}

export interface CapexEntry extends BusinessPlanBaseEntry {

}

export interface OpexEntry extends BusinessPlanBaseEntry {

}

interface CostOfThingThatPeopleBuy {
  name: string;
  cost: number;
}

export interface ThingThatPeopleBuy {
  name: string;
  price: number;
  costs: CostOfThingThatPeopleBuy[];
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
