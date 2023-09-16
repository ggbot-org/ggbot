# Authentication

```mermaid
sequenceDiagram
    participant Client
    participant Enter
	participant Verify
    Client->>Enter: Email
    Enter->>Client: OTP
    Client->>Verify: OTP
    Verify->>Client: JWT
```
