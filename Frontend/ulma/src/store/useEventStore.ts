import {create} from 'zustand';

interface Transaction {
  id: string;
  name: string;
  amount: string;
  selected: boolean;
  transactionType: string;
}

interface EventStore {
  selectedTransactions: Transaction[];
  eventID: string | null;
  setSelectedTransactions: (transactions: Transaction[]) => void;
  setEventID: (eventID: string) => void;
}

const useEventStore = create<EventStore>(set => ({
  selectedTransactions: [],
  eventID: null,

  setSelectedTransactions: (transactions: Transaction[]) =>
    set(state => ({
      ...state,
      selectedTransactions: transactions,
    })),

  setEventID: (eventID: string) =>
    set(state => {
      console.log(eventID);
      return {
        ...state,
        eventID,
      };
    }),
}));

export default useEventStore;
