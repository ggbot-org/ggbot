# Entity-relationship model

## Strategy execution

```mermaid
erDiagram
	StrategyScheduling {
		Frequency frequency
		object input
		object memory
	}
	Account ||--o{ AccountStrategy: has
	AccountStrategy ||--o{ StrategyScheduling: contains
	AccountStrategy ||--|| Strategy: "is related to"
	Strategy ||--|| StrategyFlow: "has"
	StrategyScheduling ||--o| StrategyInput: "contains"
	StrategyScheduling ||--o| StrategyMemory: "contains"
	Executor ||--o{ StrategyFlow: "executes by given scheduling"
```
