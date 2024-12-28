import React, { useEffect, useState } from "react";
import ButtonUI from "./ButtonUi";
import { enqueueSnackbar } from "notistack";
import ExpenseForm from "../utils/interface";
interface formName {
    modalName: string;
    isModalOpen: boolean;
    setIsModalOpen: (value: boolean | ((prev: boolean) => boolean)) => void;
    formData?: ExpenseForm;
}
const Modal = ({ modalName, setIsModalOpen, formData }: formName) => {
    const [title, setTitle] = useState<string>("");
    const [price, setPrice] = useState<string>("");
    const [category, setCategory] = useState<string>("");
    const [date, setDate] = useState<string>("");
    const [balance, setBalance] = useState(() => {
        const saved = localStorage.getItem('walletBalance');
        return saved ? Number(saved) : 5000;
    });
    const [expenses, setExpenses] = useState<ExpenseForm[]>(() => {
        const saved = localStorage.getItem('expenses');
        return saved ? JSON.parse(saved) : [];
    });
    const editExpense = (expense: ExpenseForm) => {
        const oldExpense = expenses.find(e => e.id === expense.id);
        if (!oldExpense) return;

        const balanceDiff = oldExpense.price - expense.price;
        if (balanceDiff < 0 && Math.abs(balanceDiff) > balance) {
            enqueueSnackbar('Insufficient balance!', { variant: 'error' });
            return;
        }

        setExpenses(prev =>
            prev.map(e => e.id === expense.id ? expense : e)
        );
        setBalance(prev => prev + balanceDiff);
        // setEditingExpense(null);
        setIsModalOpen(false);
        enqueueSnackbar('Expense updated successfully!', { variant: 'success' });
    };
    const handleClick = (e: React.FormEvent) => {
        e.preventDefault();

        const expensesListString = localStorage.getItem("expensesList");
        const expensesList: ExpenseForm[] = expensesListString
            ? JSON.parse(expensesListString)
            : [];

        const balanceString = localStorage.getItem("balance");
        const currentBalance = balanceString ? parseFloat(balanceString) : 0;

        const expensesString = localStorage.getItem("expenses");
        const currentExpenses = expensesString ? parseFloat(expensesString) : 0;

        const priceAsNumber = price ? parseFloat(price) : 0;
        const randomID = Math.random();
        const newExpense: ExpenseForm = {
            id: Math.ceil(randomID * 100),
            title,
            price: priceAsNumber,
            category,
            date,
        };

        if (currentBalance - priceAsNumber < 0) {
            enqueueSnackbar("Insufficient balance in wallet", { variant: "error" });
            return;
        }

        const newTotalExpenses = currentExpenses + priceAsNumber;
        
        if (modalName === "Add Expenses") {
            const newBalance = currentBalance - priceAsNumber;
            
            localStorage.setItem(
                "expensesList",
                JSON.stringify([...expensesList, newExpense])
            );
            localStorage.setItem("balance", newBalance.toString());
            localStorage.setItem("walletBalance", newTotalExpenses.toString());
            
            setIsModalOpen(false);
            enqueueSnackbar("Expense added successfully", { variant: "success" });
        } 
        else{
            editExpense(formData)
        }
        // else {
        //     const recordToUpdate = expensesList.filter((item)=>item.id ===formData.id)
        //     const selectedRecordPrice = recordToUpdate.price;
        //     const filteredExpensesList = expensesList.filter((item)=>item.id !==formData.id)
        //     let totalAmtSpend=0;
        //     filteredExpensesList.forEach((item)=>{
        //         totalAmtSpend +=item.price
        //     })
        //     if (selectedRecordPrice > priceAsNumber){
        //         console.log("yes in if");
                
        //         const latestBalance = currentBalance - selectedRecordPrice
        //         localStorage.setItem("balance", latestBalance.toString());
        //         localStorage.setItem("expenses", JSON.stringify(totalAmtSpend + priceAsNumber));

        //     }
        //     const updatedExpensesList = [...filteredExpensesList, newExpense];
        //     localStorage.setItem("expensesList", JSON.stringify(updatedExpensesList));
        //     setIsModalOpen(false);
        //     enqueueSnackbar("Expense updated successfully", { variant: "success" });
        // }
    };
    const handleCancel = () => {
        setIsModalOpen((prev) => !prev);
    };
    useEffect(() => {
        if (formData) {
            setTitle(formData.title);
            setPrice(formData.price);
            setCategory(formData.category);
            setDate(formData.date);
        }
    }, []);
    return (
        <div className="modal">
            <div className="modal-main">
                <p className="modal-title">{modalName}</p>
                <form onSubmit={handleClick}>
                    <div className="modal-wrapper">
                        <div className="">
                            <input
                                type="text"
                                className="input"
                                required
                                placeholder="Title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </div>
                        <div className="">
                            <input
                                type="text"
                                className="input"
                                required
                                placeholder="Price"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                            />
                        </div>
                        <div className="">
                            <select
                                name="category"
                                className="input"
                                id="category"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                            >
                                <option value="">Select Category</option>
                                <option value="entertainment">Entertainment</option>
                                <option value="food">Food</option>
                                <option value="travel">Travel</option>
                            </select>
                        </div>
                        <div className="">
                            <input
                                type="date"
                                className="input"
                                required
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                            />
                        </div>
                        <div className="">
                            <ButtonUI
                                name={`${formData ? "Update" : "Add"} Expense`}
                                btnType="primary"
                                type="submit"
                            />
                        </div>
                        <div className="">
                            <ButtonUI
                                name="Cancel"
                                handleClick={handleCancel}
                                btnType="secondary"
                            />
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Modal;
