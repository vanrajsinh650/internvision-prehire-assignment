# 03 System Architecture

## Overview Architecture

```
                                  +-----------------------+
                                  |   Next.js 15 Client   |
                                  | (React 19 / Tailwind) |
                                  +-----------+-----------+
                                              |
                                      HTTP / REST API
                                              |
                                  +-----------v-----------+
                                  |    FastAPI Backend    |
                                  | (Python 3.11 / Pydantic)|
                                  +-----+-----+-------+---+
                                        |     |       |
                 +----------------------+     |       +---------------------+
                 |                            |                             |
        +--------v--------+          +--------v--------+           +--------v--------+
        |   PostgreSQL    |          | Razorpay Gateway|           | OpenPyXL Engine |
        |  (SQLAlchemy)   |          |   (Test Mode)   |           | (.xlsx Export)  |
        +-----------------+          +-----------------+           +-----------------+
```

## Communication Patterns
- Public endpoints: CORS open for frontend domain, rate limited.
- Protected admin endpoints: `Authorization: Bearer <JWT_TOKEN>` header required.
- Payment flow: Server-side order generation -> Client SDK execution -> Server-side signature validation.
- Excel Export: Streaming binary file (`application/vnd.openxmlformats-officiallyformat-officedocument.spreadsheetml.sheet`).
