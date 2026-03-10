export interface OrderItem {
  id?: string;
  itemName: string;
  itemPrice: number;
}

export interface SharedExpense {
  id?: string;
  expenseName: string;
  expenseAmount: number;
}

export interface Participant {
  id?: string;
  name: string;
  items: OrderItem[];
  totalAmount: number;
}

export interface Bill {
  id?: string;
  eventName: string;
  participants: Participant[];
  sharedExpenses: SharedExpense[];
  sharedExpensePerPerson: number;
  totalAmount: number;
}
