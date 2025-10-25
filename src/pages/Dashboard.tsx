import { useEffect, useState } from "react";
import MonthYearSelector from "../components/MonthYearSelector";
import { getTransactionSummary } from "../services/transactionService";
import { getTransactionMontly } from "../services/transactionService";
import { ArrowUp, Calendar, TrendingUp, Wallet } from "lucide-react";
import type { MontlyItem, TransactionSummary } from "../types/transaction";
import Card from "../components/Card";
import { formatCurrency } from "../utils/formatters";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Legend,
  Bar,
  type PieLabelRenderProps,
  
} from "recharts";

const initialSummary: TransactionSummary = {
  totalExpenses: 0,
  totalIncome: 0,
  balance: 0,
  expenseByCategory: [],
};


const Dashboard = () => {
  const currenteDate = new Date();
  const [year, setYear] = useState<number>(currenteDate.getFullYear());
  const [month, setMonth] = useState<number>(currenteDate.getMonth() + 1);
  const [summary, setSummary] = useState<TransactionSummary>(initialSummary);
  const [monthlyItemsData, setMonthlyItemsData] = useState<MontlyItem[]>([]);

  useEffect(() => {
    async function loadTransactionSummary() {
      const response = await getTransactionSummary(month, year);

      setSummary({
        ...initialSummary,
        ...response,
        expenseByCategory: response?.expenseByCategory ?? [],
      });
    }

    loadTransactionSummary();
  }, [month, year]);

  useEffect(() => {
    async function loadTransactionMontly() {
      const response = await getTransactionMontly(month, year);

      console.log(response.history);
      setMonthlyItemsData(response.history);
    }

    loadTransactionMontly();
  }, [month, year]);

  const renderPieChatLabel = ({ name, percent }: PieLabelRenderProps): string => {
  const pct = Math.round(Number(percent ?? 0) * 1000) / 10; // 0.1% de precisão
  return `${name ?? ""}: ${pct}%`;
};


  const formatToolTipValue = (value: number | string): string => {
    return formatCurrency(typeof value === "number" ? value : 0);
  };

  return (
    <div className="container-app py-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-2xl font-bold mb-4 md:mb-0">Dashboard</h1>
        <MonthYearSelector
          month={month}
          year={year}
          onMonthChange={setMonth}
          onYearChange={setYear}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card
          icon={<Wallet size={20} className="text-primary-500" />}
          title="Saldo"
          hover
          glowEffect={summary.balance > 0}
        >
          <p
            className={`text-2xl font-semibold mt-2
                ${summary.balance > 0 ? "text-primary-500" : "text-red-600"}`}
          >
            {formatCurrency(summary.balance)}
          </p>
        </Card>

        <Card icon={<ArrowUp size={20} className="text-primary-500" />} title="Receitas" hover>
          <p className="text-2xl font-semibold mt-2">{formatCurrency(summary.totalIncome)}</p>
        </Card>

        <Card icon={<Wallet size={20} className="text-red-600" />} title="Despesas" hover>
          <p className="text-2xl font-semibold mt-2 text-red-600">
            {formatCurrency(summary.totalExpenses)}
          </p>
        </Card>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6 mt-3">
        <Card
          icon={<TrendingUp size={20} className="text-primary-500" />}
          title="Despesas por categoria"
          hover
          className="min-h-80"
        >
          {summary.expenseByCategory.length > 0 ? (
            <div className="h-72 mt-4">
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={summary.expenseByCategory}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="amount"
                    nameKey="categoryName"
                    isAnimationActive={false}
                    label={renderPieChatLabel}
                  >
                    {summary.expenseByCategory.map((entry) => (
                      <Cell key={entry.categoryId} fill={entry.categoryColor} />
                    ))}
                  </Pie>
                  <Tooltip formatter={formatToolTipValue} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-500">
              <p> Nenhuma despesa registrada nesse periodo</p>
            </div>
          )}
        </Card>
        <Card
          icon={<Calendar size={20} className="text-primary-500" />}
          title="Histórico mensal"
          hover
          className="min-h-80 p-2.5"
        >
          <div className="h-72 mt-4">
            {monthlyItemsData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyItemsData} margin={{left:40}}>
                  <CartesianGrid strokeDasharray="2 2" stroke="rgba(255,255,255,0.1)" />
                  <XAxis
                    dataKey="name"
                    stroke="#94a3b8"
                    tick={{ style: { textTransform: "capitalize", fontSize: 12 } }}
                  />
                  <YAxis 
                    stroke="#94a3b8"
                    tickFormatter={formatCurrency}
                    tick={{ style: { fontSize: 12  } }}
                    />
                  <Tooltip 
                  formatter={formatCurrency}
                  contentStyle={{
                    backgroundColor: '#1a1a1a',
                    borderColor: '#2a2a2a'
                  }}
                  labelStyle={{color:"#f8f8f8"}}                 
                   />
                  <Legend />
                  <Bar
                    dataKey="expenses"
                    name="Despesas"
                    fill="#ff6384"
                    
                  />
                  <Bar
                    dataKey="income"
                    name="Receitas"
                    fill="#37e359"
                    
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-500">
                <p> Nenhum histórico registrado nesse periodo</p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
