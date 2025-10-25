import { TRANSACTION_TYPE } from "./transaction";

export interface Category{
    id: string;
    name: string;
    color: string; 
    type: typeof TRANSACTION_TYPE[keyof typeof TRANSACTION_TYPE];
    
}

export interface CategorySummary{
    categoryId: string;
    categoryName: string;
    categoryColor: string;
    amount: number;
    percentage: number;
    [key: string]: string | number;
}