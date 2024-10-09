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
  category: string | null;
  name: string | null;
  eventTime: string | null;
  setSelectedTransactions: (transactions: Transaction[]) => void;
  setEventInfo: (
    eventID: string,
    category: string,
    name: string,
    eventTime: string,
  ) => void;
}

const useEventStore = create<EventStore>(set => ({
  selectedTransactions: [],
  eventID: null,
  category: null,
  name: null,
  eventTime: null,

  setSelectedTransactions: (transactions: Transaction[]) =>
    set(state => ({
      ...state,
      selectedTransactions: transactions,
    })),

  setEventInfo: (
    eventID: string,
    category: string,
    name: string,
    eventTime: string,
  ) =>
    set(state => ({
      ...state,
      eventID,
      category,
      name,
      eventTime,
    })),
}));

export default useEventStore;
