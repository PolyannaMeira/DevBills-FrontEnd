import { useEffect, useId, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TransactionType, type CreateTransactionDTO } from "../types/transaction";
import { getCategories } from "../services/categoryService";
import type { Category } from "../types/category";
import Card from "../components/Card";
import Input from "../components/Input";
import TransactionTypeSelector from "../components/TransactionTypeSelector";
import { Calendar, DollarSign, Save, Tag, AlertCircle } from "lucide-react";
import Select from "../components/Select";
import Button from "../components/Button";
import { createTransaction } from "../services/transactionService";
import { toast } from "react-toastify";

interface FormData {
    description: string;
    amount: number;
    date: string;
    type: TransactionType;
    categoryId: string;
}

const initialFormData: FormData = {
    description: "",
    amount: 0,
    date: "",
    type: TransactionType.EXPENSE,
    categoryId: ""
};



const TransactionsForm = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [formData, setFormData] = useState<FormData>(initialFormData);
    const [errors, setErrors] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const formId = useId()
    const navigate = useNavigate();

    const validateForm = (): boolean => {
        if (!formData.description || !formData.date || !formData.categoryId) {
            setErrors("Por favor, preencha todos os campos.");
            return false;
        }
        // normalize and validate numeric value
        const normalized = formData.amount.replace(",", ".").trim();
        const amountNumber = Number(normalized);
        if (!isFinite(amountNumber) || amountNumber <= 0) {
            setErrors("O valor deve ser maior que zero.");
            return false;
        }
        return true;
    };

    useEffect(() => {
        const fetchCategories = async (): Promise<void> => {
            try {
                const response = await getCategories();
                setCategories(response);
            } catch (e) {
                setErrors("Não foi possível carregar as categorias.");
                toast.error("Não foi possível carregar as categorias.");
            }
        };
        fetchCategories();
    }, []);



    const handleSubmit = async (event: React.FormEvent): Promise<void> => {
        event.preventDefault();
        setLoading
        setErrors(null);

        // normaliza amount
        const normalized = formData.amount.replace(",", ".").trim();
        const amountNumber = Number(normalized);

        if (!formData.description || !formData.date || !formData.categoryId) {
            setErrors("Por favor, preencha todos os campos.");
            return;
        }
        if (!isFinite(amountNumber) || amountNumber <= 0) {
            setErrors("O valor deve ser maior que zero.");
            return;
        }

        try {
            const transactionData: CreateTransactionDTO = {
                description: formData.description,
                amount: amountNumber,
                date: `${formData.date}T12:00:00.000Z`,
                type: formData.type,
                categoryId: formData.categoryId
            };

            await createTransaction(transactionData);
            toast.success("Transação criada com sucesso.");
            navigate("/transactions");
        } catch {
            toast.error("Erro ao criar transação.");
        } finally {
            setLoading(false);
        }
    };


    const handleCancel = () => {
        navigate("/transactions");
    }

    const handleChange = (
        event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ): void => {
        const { name, value } = event.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };



    const handleTransactionType = (itemType: TransactionType): void => {
        setFormData((prev) => ({ ...prev, type: itemType }));
    }



    const filteredCategories = categories.filter((category) => category.type === formData.type);



    return (
        <div className="container-app py-8">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-2xl font-bold mb-6">Nova transação</h1>
                <Card>

                    {errors && (
                        <div className="flex items-center bg-red-400 border border-red-700 rounded-xl p-4 mb-6 gap-2">
                            <AlertCircle className="w-5 h-5 text-red-700" />
                            <p className="text-red-700">{errors}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="mb-4 flex gap-2 flex-col">
                            <label htmlFor={formId} >Tipo de Transação</label>
                            <TransactionTypeSelector
                                id={formId}
                                value={formData.type}
                                onChange={handleTransactionType}
                            />
                        </div>
                        <Input
                            label="Descrição"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="EX: Supermercado, Salario, etc..."


                        />
                        <Input
                            label="Valor"
                            name="amount"
                            type="text"
                            inputMode="decimal"
                            pattern="[0-9]*[.,]?[0-9]*"
                            value={formData.amount}
                            onChange={handleChange}
                            placeholder="R$ 0,00"
                            icon={<DollarSign className="w-4 h-4" />}
                            required
                        />

                        <Input
                            label="Data"
                            name="date"
                            type="date"
                            value={formData.date}
                            onChange={handleChange}
                            icon={<Calendar className="w-4 h-4" />}


                        />
                        <Select
                            label="Categoria"
                            name="categoryId"
                            value={formData.categoryId}
                            onChange={handleChange}
                            icon={<Tag className="w-4 h-4" />}

                            options={[
                                { value: "", label: "Selecione uma categoria" },
                                ...filteredCategories.map((category) => ({ value: category.id, label: category.name })),

                            ]}
                        />
                        <div className="flex justify-end space-x-3 mt-2">
                            <Button variant="outline" onClick={handleCancel} type="button" disabled={loading}>Cancelar</Button>
                            <Button type="submit" variant={formData.type === TransactionType.EXPENSE ? "danger" : "success"} disabled={loading}>
                                {loading ? <div className="flex items-center justify-center py-10">
                                    <div className="w-4 h-4 border-4 border-gray-500 border-t-transparent rounded-full animate-spin" />
                                </div> : <Save className="w-4 h-4 mr-2" />}

                                Salvar
                            </Button>
                        </div>

                    </form>
                </Card>
            </div>
        </div>
    );
}

export default TransactionsForm;