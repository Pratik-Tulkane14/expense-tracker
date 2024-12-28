import { useEffect, useState } from "react";
import ButtonUI from "./components/ButtonUi";
import Chart from "./components/Chart";
import Modal from "./components/Modal";
import AddBalanceModal from "./components/AddBalanceModal";
import Barchart from "./components/Barchart";
import ConfirmationModal from "./components/ConfirmationModal";
import ExpenseForm from "./utils/interface";
import useLocalStorage from "./hooks/useLocalStorage";
function App() {
  const expensesList = useLocalStorage("expensesList", []);
  const balance = useLocalStorage("balance", 5000);
  const expensesAmt = useLocalStorage("expenses", 0);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [modalName, setModalName] = useState<string>("Add Expenses");
  const [walletBalance, setWalletBalance] = useState<number>(balance ? parseInt(balance) : 5000);
  const [expenses, setExpenses] = useState<number>(expensesAmt ? parseInt(expensesAmt) : 0);
  const [transactions, setTransactions] = useState<[]>([]);
  const [formData, setFormData] = useState({});
  const [selectedData, setSelectedData] = useState({});
  const [isAddBalanceModalOpen, setIsAddBalanceModalOpen] =
    useState<boolean>(false);
  const handleEditModal = (item) => {
    setSelectedData(item)
    setIsDeleteModalOpen((prev) => !prev);
  }
  const handleDelete = () => {
    const expensesListString = localStorage.getItem("expensesList");
    const walletBalance = localStorage.getItem("balance");
    const expensesList: ExpenseForm[] = expensesListString ? JSON.parse(expensesListString) : [];
    const updatedData = expensesList.filter(item =>
      !(item.title === selectedData.title &&
        item.price === selectedData.price &&
        item.category === selectedData.category &&
        item.date === selectedData.date)
    );
    const expensesAmt = localStorage.getItem("expenses");
    const expensesAmtParsed = expensesAmt ? JSON.parse(expensesAmt) : 0;
    const walletAmtParsed = walletBalance ? JSON.parse(walletBalance) : 0;
    const finalExpenseAmtAfterDeletion = expensesAmtParsed - JSON.parse(selectedData.price);
    const finalWalletAmtAfterDeletion = JSON.parse(walletAmtParsed) + selectedData.price;
    localStorage.setItem("expensesList", JSON.stringify(updatedData));
    localStorage.setItem("balance", finalWalletAmtAfterDeletion);
    localStorage.setItem("expenses", finalExpenseAmtAfterDeletion.toString());
    setIsDeleteModalOpen((prev) => !prev)
  }
  const handleClick = () => {
    setModalName("Add Expenses");
    setIsModalOpen((prev) => !prev);
  };
  const handleEdit = (item) => {
    setFormData(item);
    setModalName("Edit Expenses");
    setIsModalOpen((prev) => !prev);
  };
  const handleAddBalance = () => {
    setIsAddBalanceModalOpen(true);
  };
  const formatDate = (inputDate: string) => {
    const date = new Date(inputDate);

    const options = { year: 'numeric', month: 'short', day: '2-digit' };
    const formattedDate = new Intl.DateTimeFormat('en-US', options).format(date).toUpperCase();
    return formattedDate

  }
  useEffect(() => {
    const expensesList = localStorage.getItem("expensesList");
    if (expensesList) {
      setTransactions(JSON.parse(expensesList))
    }
  }, []);
  useEffect(() => {
    if (balance === null) {
      localStorage.setItem("balance", "5000");
      localStorage.setItem("expenses", "0");
    } else if (expensesAmt) {
      setWalletBalance(parseInt(balance));
      setExpenses(parseInt(expensesAmt));
      console.log("in elese new");
    }

  }, [])
  useEffect(() => {
    const handleStorageChange = () => {
      const balance = localStorage.getItem("balance");
      const expensesAmt = localStorage.getItem("expenses");
      setWalletBalance(balance ? parseInt(balance) : 5000);
      setExpenses(expensesAmt ? parseInt(expensesAmt) : 0);
      console.log("effect called");

    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <>

      <div className="main">
        <h2 className="heading">Expense Tracker</h2>
        <div className="section">
          <div className="card-section">

            <div className="cards">
              <div className="">
                <h2 className="card-heading">
                  Wallet Balance:
                  <span className="wallet-amt">&#x20b9;{walletBalance}</span>
                </h2>
              </div>
              <div className="">
                <ButtonUI
                  name="Add Income"
                  handleClick={handleAddBalance}
                  btnType="primary"
                />
              </div>
            </div>
            <div className="cards">
              <div className="">
                <h2 className="card-heading">
                  Expenses:
                  <span className="expense-amt">&#x20b9;{expenses}</span>
                </h2>
              </div>
              <div className="">
                <ButtonUI
                  name="Add Expense"
                  handleClick={handleClick}
                  btnType="secondary"
                />
              </div>
            </div>
        </div>

        <div className="chart">
          <Chart />
        </div>
      </div>

      {isModalOpen && (
        <Modal modalName={modalName} isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} formData={formData} />
      )}
      {isAddBalanceModalOpen && (
        <AddBalanceModal
          isAddBalanceModalOpen={isAddBalanceModalOpen}
          setIsAddBalanceModalOpen={setIsAddBalanceModalOpen}
        />
      )}
      <div className="wrapper">
        <div className="left-section">
          <h2 className="heading">Recent Transactions</h2>
          <div className="table">
            <div className="table-details">
              {transactions.map((item, index) => {
                return (
                  <div className="details-wrapper" key={index}>
                    <div className="left-side">

                      <div className="item-img">
                        <img src={`/${item.category}.svg`} alt="icon" />
                      </div>
                      <div className="details">
                        <p className="title">{item.title}</p>
                        <p className="transaction-date">{formatDate(item.date)}</p>
                      </div>
                    </div>
                    <div className="right-side">
                      <div className="">
                        <p className="price">&#x20b9;{item.price}</p>
                      </div>
                      <div className="action-btns">
                        <div className="cancel-btn-wrapper" onClick={() => handleEditModal(item)}>
                          <img src="/cancel.svg" alt="delete" />
                        </div>
                        <div className="edit-btn-wrapper" onClick={() => handleEdit(item)}>
                          <img src="/edit.png" alt="edit" />
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}

            </div>
          </div>
        </div>
        <div className="right-section">
          <h2 className="heading">Top Expenses</h2>
          <div className="chart-section">
            <Barchart />
          </div>
        </div>
      </div>

    </div >
      <ConfirmationModal isDeleteModalOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen((prev) => !prev)} handleDelete={handleDelete} />
    </>
  );
}

export default App;
