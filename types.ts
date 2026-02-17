
export type Denomination = 10000 | 20000 | 30000 | 50000;

export interface LuckyMoneySession {
  id: string;
  amount: Denomination;
  timestamp: number;
}

export interface BagState {
  id: number;
  isOpened: boolean;
  content?: LuckyMoneySession;
}
