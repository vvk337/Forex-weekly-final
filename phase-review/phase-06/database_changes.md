# Database Changes - Phase 6

## 1. Schema Upgrades (`prisma/schema.prisma`)
Modified the `Article` model to add:
- `status`: String (DRAFT, PENDING, PUBLISHED, SCHEDULED, ARCHIVED, TRASH).
- `scheduledAt`: DateTime (optional).
- `publishedBy`: String (optional).
- `editedBy`: String (optional).
- `revisionComment`: String (optional).
- `department`: String (defaults to Publications).

## 2. Seed Update & Migration
Executed a TS migration command to set status of all 10 pre-existing articles to `"PUBLISHED"`.
- Command: `npx tsx -e "import { PrismaClient } from '@prisma/client'; const p = new PrismaClient(); p.article.updateMany({ data: { status: 'PUBLISHED' } }).then(r => console.log(r)).finally(() => p.$disconnect())"`
- Result: `{ count: 10 }` success.
