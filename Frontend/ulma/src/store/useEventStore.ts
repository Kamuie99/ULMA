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
  newEventInfo: {
    date: string | null;
    time: string | null;
    name: string | null;
    guestId: string | null;
  };
  setSelectedTransactions: (transactions: Transaction[]) => void;
  setEventInfo: (
    eventID: string,
    category: string,
    name: string,
    eventTime: string,
  ) => void;
  setNewEventInfo: (
    date: string | null,
    time: string | null,
    name: string | null,
    guestId: string | null,
  ) => void;
}

const useEventStore = create<EventStore>(set => ({
  selectedTransactions: [],
  eventID: null,
  category: null,
  name: null,
  eventTime: null,
  newEventInfo: {
    date: null,
    time: null,
    name: null,
    guestId: null,
  },

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

  setNewEventInfo: (date, time, name, guestId) =>
    set(state => ({
      ...state,
      newEventInfo: {date, time, name, guestId},
    })),
}));

export default useEventStore;
