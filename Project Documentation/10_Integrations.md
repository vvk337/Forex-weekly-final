# Document 10: Integrations

## External Dependencies & Services
- **Yahoo Finance RSS**: Consumed via HTTPS GET (`https://finance.yahoo.com/news/rss`) and parsed via custom regex to stream headlines.
- **Local File System Storage**: Uploaded files written to `/public/uploads/` using Node.js `fs` streams.
- **Jose JWT Library**: Used for cryptographic signing and verification of session tokens.
- **Bcryptjs**: Used for password hashing (10 salt rounds).
