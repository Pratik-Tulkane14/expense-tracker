import React, { useState } from 'react'
import ButtonUI from './ButtonUi'
import { enqueueSnackbar } from 'notistack';
interface formName {
    isAddBalanceModalOpen: boolean,
    setIsAddBalanceModalOpen: (value: boolean | ((prev: boolean) => boolean)) => void;
}
const AddBalanceModal = ({ isAddBalanceModalOpen, setIsAddBalanceModalOpen }: formName) => {
    const [incomeAmt, setIncomeAmt] = useState<string>('');
    const handleClick = (e: React.FormEvent) => {
        e.preventDefault();
        const walletBalance = localStorage.getItem("balance");
        if (walletBalance !== null) {
            localStorage.setItem("balance", JSON.stringify(parseInt(walletBalance) + parseInt(incomeAmt)))
            setIsAddBalanceModalOpen(!isAddBalanceModalOpen);
            enqueueSnackbar('Money added successfully', { variant: 'success' });
            
        } else {
            localStorage.setItem("balance", JSON.stringify(incomeAmt))
            setIsAddBalanceModalOpen(!isAddBalanceModalOpen);
            enqueueSnackbar('Money added successfully', { variant: 'success'  });
        }
    }
    const handleCancel = () => {
        setIsAddBalanceModalOpen((prev) => !prev);
    }
    return (
        <div className="add-balance-modal">
            <div className="modal-main">
                <p className="modal-title">Add Balance</p>
                <form onSubmit={handleClick}>
                    <div className="add-balance-modal-wrapper">
                        <div className="">
                            <input type="text" className="input" required placeholder="Income Amount" value={incomeAmt} onChange={(e) => setIncomeAmt(e.target.value)} />
                        </div>
                        <div className="">
                            <ButtonUI name="Add Balance"
                                btnType="primary" type="submit" />
                        </div>
                        <div className="">
                            <ButtonUI name="Cancel"

                                handleClick={handleCancel}
                                btnType="secondary" />
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default AddBalanceModal