import { ChevronDown } from "lucide-react";
import { type SelectHTMLAttributes, useId } from "react";


interface SelectOption {
    value: string;
    label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    error?: string;
    icon?: React.ReactNode;
    fullWidth?: boolean;
    options: SelectOption[];
}



const Select = ({ label, error, icon, fullWidth = true, options, className = "", id, ...rest }: SelectProps) => {
    const selectID = useId();

    return (
        <div className={`${fullWidth ? "w-full" : ""}mb-4 `}>
            <label htmlFor={selectID} className="block text-sm font-medium text-gray-50 mb-2">{label}</label>
            <div className="relative">
                {icon &&
                    <div className="absolute inset-y-0 top-6 left-0 pl-2 flex items-center text-gray-400">
                        {icon}
                    </div>
                }
            </div>
            <select id={selectID} {...rest} className={`block w-full bg-gray-800 py-3 pl-10 pr-4 rounded-xl text-gray-50 text-sm ${error ? "border-red-500" : "border-gray-700"}
    ${error ? "focus:border-red-500" : "focus:border-primary-500"} outline-none `}>
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
    );
}

export default Select;