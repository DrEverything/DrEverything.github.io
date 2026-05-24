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
  scheduledAt?: string;
  results?: Record<string, string>;
  updatedAt: string;
}

interface BusinessPlanBaseEntry {
  id: string;
  category: string;
  vendor?: string;
  amount: number;
  cost_for_each: number;
  currency: string;
  projectCode?: string;
  notes?: string;
}

export interface CapexEntry extends BusinessPlanBaseEntry {

}

export interface OpexEntry extends BusinessPlanBaseEntry {

}
