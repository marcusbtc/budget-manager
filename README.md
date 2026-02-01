# Budget Manager

A modern full-stack budget management application built with React, TypeScript, FastAPI, and SQLite.

## Features

- **Budget Entries**: Create, edit, and delete income/expense entries
- **Category Management**: Add, edit, delete custom categories with color coding
- **Date Range Filtering**: Filter entries, stats, and charts by custom date ranges
- **Real-time Statistics**: Dashboard with animated stat cards and interactive charts
- **Visual Analytics**: Monthly trend charts and category breakdown charts
- **Data Tables**: Sortable, filterable budget table with inline editing
- **Modern UI**: Smooth animations, toast notifications, responsive design
- **Production Ready**: API timeouts, error handling, database transactions

## Tech Stack

### Frontend
- React 18 + TypeScript
- Vite
- TailwindCSS
- shadcn/ui components
- React Query (TanStack Query) with staleTime & retry logic
- Recharts
- Framer Motion
- React Router
- Sonner (toasts)
- Plus Jakarta Sans (typography)

### Backend
- FastAPI
- SQLAlchemy
- SQLite
- Pydantic
- Uvicorn

## Quick Start

### Prerequisites
- Python 3.8+
- Node.js 16+
- npm or yarn

### Installation

1. **Clone the repository**
```bash
cd "Budget Manager"
```

2. **Setup Backend**
```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

3. **Setup Frontend**
```bash
cd ../frontend
npm install
```

### Running the Application

1. **Start Backend** (Terminal 1)
```bash
cd backend
source venv/bin/activate
uvicorn main:app --reload
```
Backend runs at http://localhost:8000

2. **Start Frontend** (Terminal 2)
```bash
cd frontend
npm run dev
```
Frontend runs at http://localhost:5173

## API Documentation

Interactive API docs available at http://localhost:8000/docs

### Endpoints

**Budgets**
- `GET /api/v1/budgets?start_date=&end_date=` - List entries (optional date filter)
- `POST /api/v1/budgets` - Create new entry
- `PUT /api/v1/budgets/{id}` - Update entry
- `DELETE /api/v1/budgets/{id}` - Delete entry

**Categories**
- `GET /api/v1/categories` - List all categories
- `POST /api/v1/categories` - Create category
- `PUT /api/v1/categories/{id}` - Update category
- `DELETE /api/v1/categories/{id}` - Delete category

**Statistics**
- `GET /api/v1/stats/summary?start_date=&end_date=` - Summary statistics
- `GET /api/v1/stats/by-category?start_date=&end_date=` - Category breakdown
- `GET /api/v1/stats/monthly-trend?months=&start_date=&end_date=` - Monthly trends

## Project Structure

```
Budget Manager/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/              # shadcn/ui components
│   │   │   ├── budget/          # Budget table & form
│   │   │   ├── dashboard/       # Stats & charts
│   │   │   └── layout/          # Layout components
│   │   ├── pages/               # Route pages
│   │   ├── hooks/               # React Query hooks
│   │   ├── api/                 # API client
│   │   ├── types/               # TypeScript types
│   │   └── lib/                 # Utilities
│   └── package.json
│
├── backend/
│   ├── database/                # SQLAlchemy models
│   ├── schemas/                 # Pydantic schemas
│   ├── routers/                 # API routes
│   ├── services/                # Business logic
│   ├── main.py                  # FastAPI app
│   └── requirements.txt
│
└── my-notes/                    # Learning guides
    ├── plan.md
    ├── QUICK-START.md
    └── IMPLEMENTATION-COMPLETE.md
```

## Default Categories

The app comes with 8 pre-seeded categories:
- Groceries (green)
- Transport (blue)
- Entertainment (purple)
- Utilities (amber)
- Salary (emerald)
- Healthcare (red)
- Dining (orange)
- Shopping (pink)

## Pages

### Dashboard
- Date range filter for all stats
- 4 animated stat cards (Balance, Income, Expenses, Entry Count)
- Monthly trend area chart (income vs expenses)
- Category breakdown bar charts
- Recent entries list

### Analytics
- Date range filter for detailed analysis
- Extended monthly trend (12 months)
- Category breakdown with income/expense separation

### Budget
- Date range filter for entries
- Sortable table with description, category, amount, date, type
- Inline editing via EntryFormDialog
- Category manager sidebar (add/edit/delete categories)
- Color-coded category badges

## Development

### Frontend Development
```bash
cd frontend
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
```

### Backend Development
```bash
cd backend
source venv/bin/activate
uvicorn main:app --reload  # Auto-reload on changes
```

## Currency Format

Uses USD ($) format: `$1,234.56`

## Database

SQLite database (`budget.db`) is created automatically on first run.

**Tables:**
- `categories` - Budget categories with colors and icons
- `budget_entries` - All budget transactions

## Engineering Highlights

- **API Client**: 10s timeout with AbortController, descriptive error messages
- **React Query**: Stale time (30s), retry logic (max 3, skip 404s)
- **Database**: Proper transaction rollback on errors
- **Error Handling**: HTTP 400 for invalid dates with clear messages
- **TypeScript**: Strict typing throughout

## Contributing

This is a learning project. Feel free to extend it with:
- User authentication
- Multi-currency support
- Recurring transactions
- Budget goals
- Data export (CSV/PDF)
- Mobile app
- Dark mode

## License

MIT License


