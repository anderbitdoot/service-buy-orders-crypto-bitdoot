export interface CreateTransactionInput {
    userId:   string;
    amount:   number;
    currency: string;
    from:     string;
    to:       string;
    hash:     string;
    type:     string;
    refId:    string;
    status:   string;
    opCode:   string;
}

export interface TransactionRepositoryPort {
    createTransaction(input: CreateTransactionInput): Promise<void>;
}
