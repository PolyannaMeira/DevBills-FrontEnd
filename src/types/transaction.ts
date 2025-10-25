import type { Category, CategorySummary } from "./category";


export const TRANSACTION_TYPE = {
  INCOME: "INCOME",
  EXPENSE: "EXPENSE",
} as const;

export type TransactionType = typeof TRANSACTION_TYPE[keyof typeof TRANSACTION_TYPE];




export interface Transaction{
    id: string;
    userId?: string;
    description: string;
    amount: number;
    date: string | Date; 
    type: TransactionType;
    categoryId: string;
    category?: Category;
    createdAt: string | Date; 
    updatedAt: string | Date; 
}

export interface CreateTransactionDTO{
    description: string;
    amount: number;
    date: string | Date;
    type: TransactionType;
    categoryId: string;
}



export interface TransactionFilter{
    month: number;
    year: number;
    categoryId?: string;
    type?: TransactionType
}

export interface TransactionSummary{
    totalExpenses: number;
    totalIncome: number;
    balance: number;
    expenseByCategory: CategorySummary[];
}

export interface MontlyItem{
    name: string;
    expenses: number;
    income: number;
}