export interface SequenceRepositoryPort {
    getNextOpCode(): Promise<string>;
}
