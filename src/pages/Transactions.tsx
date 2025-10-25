import { Link } from "react-router-dom";
import { AlertCircle, ArrowDown, ArrowUp, Plus, Search, Trash2 } from "lucide-react";
import MonthYearSelect from "../components/MonthYearSelector";
import { useEffect, useMemo, useState } from "react";
import Input from "../components/Input";
import Card from "../components/Card";
 import { TRANSACTION_TYPE, type Transaction } from "../types/transaction";
import { getTransactions, deleteTransaction } from "../services/transactionService";
import Button from "../components/Button";
import { formatCurrency, formatDate } from "../utils/formatters";
import { toast } from "react-toastify";

const Transactions = () => {
  const currentDate = new Date();
  const [year, setYear] = useState<number>(currentDate.getFullYear());
  const [month, setMonth] = useState<number>(currentDate.getMonth() + 1);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [deletingId, setDeletingId] = useState<string>("");
  const [searchText, setSearchText] = useState<string>("");

  const fetchTransactions = async (): Promise<void> => {
    try {
      setLoading(true);
      setError("");
      const data = await getTransactions({ month, year });
      setTransactions(data);
    } catch {
      setError("Erro ao carregar transações.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string): Promise<void> => {
    try {
      setDeletingId(id);
      await deleteTransaction(id);
      toast.success("Transação excluída com sucesso.");
      setTransactions((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      console.error(err);
      toast.error("Erro ao excluir transação.");
    } finally {
      setDeletingId("");
    }
  };

  const confirmDelete = (id: string): void => {
    if (window.confirm("Tem certeza que deseja excluir esta transação?")) {
      handleDelete(id);
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchText(event.target.value);
  };

  // Lista exibida é derivada de transactions + searchText
  const filteredTransactions = useMemo(() => {
    const q = searchText.trim().toLowerCase();
    if (!q) return transactions;
    return transactions.filter((t) => t.description?.toLowerCase().includes(q));
  }, [transactions, searchText]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: queremos refazer fetch quando mês/ano mudar
  useEffect(() => {
    fetchTransactions();
  }, [month, year]);

  return (
    <div className="container-app py-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-2xl font-bold mb-4 md:mb-0">Transações</h1>
        <Link
          to="/transactions/nova"
          className="bg-primary-500 text-[#051626] font-semibold px-4 py-2.5 rounded-xl flex items-center justify-center hover:bg-primary-600 transition-all"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nova Transação
        </Link>
      </div>

      <Card className="mb-5">
        <MonthYearSelect
          month={month}
          year={year}
          onMonthChange={setMonth}
          onYearChange={setYear}
        />
      </Card>

      <Card className="mb-5">
        <Input
          placeholder="Buscar Transações"
          icon={<Search className="w-4 h-4" />}
          fullWidth
          onChange={handleSearchChange}
          value={searchText}
        />
      </Card>

      <Card className="overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-10">
            <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : error ? (
          <div className="p-8 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <p>{error}</p>
            <Button onClick={fetchTransactions} className="mx-auto mt-6">
              Tentar Novamente
            </Button>
          </div>
        ) : filteredTransactions.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">
              Nenhuma transação encontrada para o período selecionado{searchText ? " (após filtro)" : ""}.
            </p>
            <Link
              to="/transactions/nova"
              className="w-fit mx-auto mt-6 bg-primary-500 text-[#051626] font-semibold px-4 py-2.5 rounded-xl flex items-center justify-center hover:bg-primary-600 transition-all"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nova Transação
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="divide-y divide-gray-700 min-h-full w-full">
              <thead>
                <tr>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-400 uppercase ">
                    Descrição
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-400 uppercase ">
                    Data
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-400 uppercase ">
                    Categoria
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-400 uppercase ">
                    Valor
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-400 uppercase ">
                    {""}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredTransactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-700 ">
                    <td className="px-6 py-4 text-sm text-gray-400 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {transaction.type === TRANSACTION_TYPE.INCOME ? (
                          <ArrowUp className="w-4 h-4 text-primary-500" />
                        ) : (
                          <ArrowDown className="w-4 h-4 text-red-500" />
                        )}
                        <span className="text-sm font-medium text-gray-50">
                          {transaction.description}
                        </span>
                      </div>
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap">
                      {formatDate(transaction.date)}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div
                          className="w-2 h-2 rounded-full mr-2"
                          style={{
                            backgroundColor: transaction.category?.color ?? "#9CA3AF",
                          }}
                        />
                        <span className="text-sm">
                          {transaction.category?.name ?? "—"}
                        </span>
                      </div>
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap">
                      <span
                        className={
                          transaction.type === TRANSACTION_TYPE.INCOME
                            ? "text-primary-500"
                            : "text-red-500"
                        }
                      >
                        {formatCurrency(transaction.amount)}
                      </span>
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => confirmDelete(transaction.id)}
                        disabled={deletingId === transaction.id}
                        className="text-red-500 hover:text-red-500 rounded-full"
                      >
                        {deletingId === transaction.id ? (
                          <span className="inline-block w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Transactions;
