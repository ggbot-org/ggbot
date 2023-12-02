# Authentication

```mermaid
sequenceDiagram
    participant Client
    participant Enter
	participant Verify
    Client->>Enter: Email
    Enter->>Client: One time password
    Client->>Verify: One time password
    Verify->>Client: Authentication token
```
