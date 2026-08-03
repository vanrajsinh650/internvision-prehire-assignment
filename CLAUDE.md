# CLAUDE.md - InternVision Tech Development Instructions

## Build & Test Commands
### Backend
- Navigate to `backend/`
- Install dependencies: `pip install -r requirements.txt`
- Run local server: `python -m app.main` or `uvicorn app.main:app --reload`
- Run seed data: `python -m app.seed`
- Run tests: `pytest`

### Frontend
- Navigate to `frontend/`
- Install dependencies: `npm install`
- Run dev server: `npm run dev`
- Build production: `npm run build`

## Code Style & Rules
- **Python**: Standard PEP 8, Pydantic v2 schemas, SQLAlchemy 2.0 type hints (`Mapped`, `mapped_column`), explicit status codes in FastAPI routes.
- **TypeScript / Next.js**: App Router (`src/app`), strict TypeScript, Tailwind CSS, Lucide React icons, Zod form validation.
- **Documentation**: Keep `context/` markdown files updated when modifying models or routes.
