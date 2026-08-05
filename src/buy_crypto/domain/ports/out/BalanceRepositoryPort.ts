export interface BalanceItem {
    currency:     string;
    currencyName: string;
    amountTotal:  number;
}

export interface BalanceDocument {
    _id:          string;
    userId:       string;
    balanceItems: BalanceItem[];
}

export interface BalanceRepositoryPort {
    findByUserId(userId: string): Promise<BalanceDocument | null>;
    updateBalance(id: string, balance: BalanceDocument): Promise<void>;
}