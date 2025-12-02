# ATS Backend (clean)

1. Copy `.env.example` -> `.env`, set DATABASE_URL, JWT_SECRET, GEMINI_API_KEY
2. Install dependencies:
   npm install
3. Ensure PostgreSQL DB exists and run the SQL schema.
4. Start server:
   npm run dev
5. Frontend expects backend at http://localhost:5000/api
