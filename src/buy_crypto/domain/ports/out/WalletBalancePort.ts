export interface CreditWalletBalanceInput {
    userId: string;
    token: string;
    amount: number;
    reference: string;
}

export interface WalletBalancePort {
    creditBalance(input: CreditWalletBalanceInput): Promise<void>;
}