export type AccountStrategyKey = AccountKey & StrategyKey;

export const isAccountStrategyKey = (
  value: unknown
): value is AccountStrategyKey => {
  if (typeof value !== "object" || value === null) return false;
  const { accountId, ...strategyKey } = value as Partial<AccountStrategyKey>;
  return isAccountKey({ accountId }) && isStrategyKey(strategyKey);
};

export type RenameAccountStrategy = Operation<
  AccountStrategyKey & Pick<Strategy, "name">,
  UpdateTime
>;

export type DeleteAccountStrategy = Operation<AccountStrategyKey, DeletionTime>;
