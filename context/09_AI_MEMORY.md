# 09 AI Memory & Code Conventions

## Code Patterns & Conventions
- **Pydantic Models**: Use Pydantic v2 `BaseModel` with `ConfigDict(from_attributes=True)`.
- **SQLAlchemy 2.0**: Use `select()`, `Mapped`, `mapped_column`, async/sync session standard pattern.
- **Frontend Components**: Functional React components with TypeScript interfaces, Tailwind styling, and lucide-react icons.
- **Error Responses**: Unified JSON `{ "detail": "Error description" }` format across backend APIs.
- **Excel Output**: OpenPyXL workbook styled headers (bold font, background fill, auto column width).
