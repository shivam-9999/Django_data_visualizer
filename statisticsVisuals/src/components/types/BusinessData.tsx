// types/BusinessData.ts
export interface BusinessData {
    id?: number;
    name?: string;
    revenue?: string | number;
    profit?: string | number;
    employees?: string | number;
    country?: string;
    total_revenue?: number;
    average_revenue?: number;
    total_employees?: number;
    company_count_per_country?: number;
    highest_revenue_per_country?: number;
    total_revenue_by_country?: number;
}
