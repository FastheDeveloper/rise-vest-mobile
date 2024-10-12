import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import { InteractionManager } from 'react-native';
import axios from 'axios';

import { API_ROUTES } from '~core/constants/apiRoutes';
import { withModal } from '~core/services/modalService';
import { sortTransactionsByInsertedDate } from '~lib/utils/timeUtil';
import { TransactionModal } from '~lib/components/Modal/TransactionModal';
import { LoginModal } from '~lib/components/Modal/LoginModal';
import { useAuth } from './AuthProvider';
import { Modal } from '~lib/components/Modal/Modal';

const TransactionContext = createContext();

function TransactionProvider({ children, openModal, closeModal }) {
  const [transactionList, setTransactionList] = useState([]);
  const [filteredTransactionList, setFilteredTransactionList] = useState([]);
  const [loadingTransaction, setLoadingTransactions] = useState(false);
  const { authToken, logout } = useAuth();

  // Sort transactions by inserted date
  const sortedTransactions = useMemo(() => {
    return sortTransactionsByInsertedDate([...transactionList]);
  }, [transactionList]);

  // Handle verification and logout if needed
  const handleVerify = useCallback(() => {
    closeModal?.();
    InteractionManager.runAfterInteractions(() => {
      logout();
    });
  }, []);

  // Update filteredTransactionList whenever sortedTransactions changes
  useEffect(() => {
    // Update filteredTransactionList only when sortedTransactions changes
    setFilteredTransactionList(sortedTransactions);
  }, [sortedTransactions]);

  // Handle response for adding or updating transactions
  const handleSetResponse = async (res, newTransaction, closeFunction) => {
    const updatedAmount =
      newTransaction.amount < 0
        ? Math.abs(newTransaction.amount)
        : -Math.abs(newTransaction.amount);
    // Create the updated transaction object
    const updatedTransaction = {
      ...newTransaction,
      amount: updatedAmount,
    };

    if (res.data.jsonCode === 200) {
      setTransactionList((prevList) => [...prevList, updatedTransaction]);
      openModal?.(
        <TransactionModal
          text={'Your transaction has been added successfully'}
          closeFunc={closeFunction}
        />,
        {
          transparent: true,
          animationType: 'none',
        }
      );
      return true;
    } else if (res.data.jsonCode === 407) {
      openModal?.(
        <LoginModal
          text={'Please Login again'}
          isError
          auth={handleVerify}
          errorTitle={'Failed to Add Transaction'}
        />,
        {
          transparent: true,
          animationType: 'none',
        }
      );
    } else {
      const errorMessage = 'Please try again!';
      openModal?.(
        <TransactionModal
          text={errorMessage}
          isError
          closeFunc={closeFunction}
          errorTitle={'Failed to Add Transaction'}
        />,
        {
          transparent: true,
          animationType: 'none',
        }
      );

      return false;
    }
  };

  // Handle response for fetching transactions
  const handleGetResponse = async (res) => {
    if (res.data.jsonCode === 200) {
      setTransactionList(res.data?.transactionList);
      return true;
    } else if (res.data.jsonCode === 407) {
      openModal?.(
        <LoginModal
          text={'Please Login again'}
          isError
          auth={handleVerify}
          errorTitle={'Token expired'}
        />,
        {
          transparent: true,
          animationType: 'none',
        }
      );
    } else {
      const errorMessage = 'Something went wrong';
      openModal?.(
        <Modal text={errorMessage} isError errorTitle={'Failed to fetch transactions'} />,
        {
          transparent: true,
          animationType: 'none',
        }
      );

      return false;
    }
  };

  // Fetch all transactions from the server
  const fetchAllTransactions = async () => {
    try {
      setLoadingTransactions(true);
      const res = await axios.get(
        `${process.env.EXPO_PUBLIC_BASE_API_URL}${API_ROUTES.GET_ALL_TRANSACTIONS}?authToken=${authToken}&returnValueList=transactionList`
      );
      handleGetResponse(res);
    } catch (err) {
      openModal?.(
        <Modal text={'Something went wrong'} isError errorTitle={'Failed to fetch transactions'} />,
        {
          transparent: true,
          animationType: 'none',
        }
      );
    } finally {
      setLoadingTransactions(false);
    }
  };

  // Add a new transaction
  const addTransaction = async (newTransaction, closeFunction) => {
    try {
      const res = await axios.get(
        `${process.env.EXPO_PUBLIC_BASE_API_URL}${API_ROUTES.CREATE_NEW_TRANSACTION}?authToken=${authToken}&created=${newTransaction?.created}&amount=${newTransaction?.amount}&merchant=${newTransaction.merchant}`
      );
      handleSetResponse(res, newTransaction, closeFunction);
    } catch (err) {
      const errorMessage = 'Try again!';
      openModal?.(
        <TransactionModal
          text={errorMessage}
          isError
          closeFunc={closeFunction}
          errorTitle={'Failed to Add Transaction'}
        />,
        {
          transparent: true,
          animationType: 'none',
        }
      );
    }
  };

  return (
    // Provide transaction context to children components
    <TransactionContext.Provider
      value={{
        transactionList,
        setTransactionList,
        loadingTransaction,
        filteredTransactionList,
        addTransaction,
        fetchAllTransactions,
      }}>
      {children}
    </TransactionContext.Provider>
  );
}

export default withModal(TransactionProvider);
export const useTransactions = () => {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error('useAuth must be used within a TransactionProvider');
  }
  return context;
};
