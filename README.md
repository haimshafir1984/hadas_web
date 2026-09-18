# פרפר סגול — חנות

אתר Next.js (App Router, TypeScript) שממיר את פרוטוטייפ ה-HTML/JS החי של "פרפר סגול" לאתר production אמיתי: בקאנד אמיתי, Postgres + Prisma, ואזור ניהול עם CRUD מלא למוצרים, קטגוריות והזמנות.

## סטאק

- Next.js 15 (App Router) + TypeScript
- Tailwind CSS, עם משתני העיצוב (`--violet`, `--bg-2` וכו') מועתקים בדיוק מהפרוטוטייפ ב-`src/app/globals.css`
- Postgres + Prisma (`prisma/schema.prisma`)
- פונט Assistant דרך `next/font/google`, `dir="rtl"` על ה-`<html>`
- קרוסלות: `embla-carousel-react` — גלילת מגע חלקה במובייל, חיצי ניווט RTL במחשב (`src/components/Carousel.tsx`)
- העלאת תמונות מוצר לאחסון מקומי (`/public/uploads`), עם שכבת שמירה מופרדת (`src/app/api/admin/upload/route.ts`) שקל להחליף בהמשך ל-S3/Cloudinary

## הרצה מקומית

### 1. מסד נתונים

צריך Postgres נגיש. שתי אפשרויות:

**Docker** (אם מותקן Docker Desktop):

```bash
docker compose up -d
```

זה מרים Postgres מקומי על פורט 5432 עם המשתמש/סיסמה/DB שכבר מוגדרים ב-`.env` (`parpar`/`parpar`/`parpar_sagol`).

**Postgres קיים** (מותקן כשירות, בענן וכו'): עדכנו את `DATABASE_URL` ב-`.env` (ראו `.env.example`) לפרטי החיבור שלכם.

### 2. משתני סביבה

```bash
cp .env.example .env
```

המשתנה היחיד הנדרש כרגע הוא `DATABASE_URL`.

### 3. התקנה, סכימה וזרעים (seed)

```bash
npm install
npx prisma migrate dev --name init
npm run prisma:seed
```

ה-seed מייבא את כל נתוני הדמה מהפרוטוטייפ (6 קטגוריות, 20 מוצרים, 4 מדריכים, 2 הזמנות דוגמה, הגדרות חנות) כך שהאתר לא עולה ריק.

### 4. הרצה

```bash
npm run dev
```

האתר ב-http://localhost:3000, אזור הניהול ב-http://localhost:3000/admin (admin / 1234).

## מבנה עיקרי

- `src/app/(shop)/…` — עמודי החנות (דף בית, קטגוריה, מוצר, סל, תשלום, שאלון, מדריכים, עלינו). ה-layout המשותף (`src/app/(shop)/layout.tsx`) מרנדר את ה-header/דרואר/פוטר.
- `src/app/admin/…` — אזור הניהול. כל עמוד עטוף ב-`AdminShell`.
- `src/app/api/admin/…` — ה-API של הניהול (מוצרים/קטגוריות/הזמנות/הגדרות/העלאת תמונות/איפוס דמו).
- `src/middleware.ts` — שומר על `/admin/*` ו-`/api/admin/*` מאחורי ה-cookie של ההתחברות.
- `src/lib/seed-data.ts` — נתוני הדמה (משמש גם את `prisma/seed.ts` וגם את כפתור "איפוס נתוני הדגמה" בהגדרות).
- `src/lib/cart-context.tsx` — סל הקניות: client-side + `localStorage` (ההזמנה עצמה נכתבת ל-DB רק בלחיצה על "שליחת ההזמנה").

## ⚠️ TODO לפני עלייה לאוויר בפועל

1. **אימות ניהול אמיתי.** כרגע ה-login הוא `admin`/`1234` קשיח (`src/lib/admin-auth.ts`, פונקציית `verifyAdminCredentials`) — בכוונה, כך שלא משקיעים בשכבת אימות לפני שהתוכן מתייצב. להחלפה: NextAuth/Auth.js עם משתמשי DB וסיסמאות מוצפנות. השינוי מקומי ל-`src/lib/admin-auth.ts` + `src/middleware.ts` בלבד.
2. **אחסון תמונות.** כרגע מקומי תחת `/public/uploads`. לפני production אמיתי (בעיקר בפריסה serverless/Vercel שבה הדיסק לא נשמר) יש להחליף ל-S3/Cloudinary דרך `src/app/api/admin/upload/route.ts`.
3. **סליקה אמיתית.** אין אינטגרציית תשלום (Tranzila/Cardcom/Stripe) — ההזמנה נשמרת ב-DB עם סטטוס "חדשה" ומחכה לטיפול טלפוני/וואטסאפ, כפי שהיה בפרוטוטייפ. לוודא מול הלקוחה מי הספק המועדף.
4. **מיילי התראה.** אין שליחת מייל אוטומטית על הזמנה חדשה. אפשר להוסיף בקלות ב-`src/app/api/orders/route.ts` (למשל עם Resend).
5. **פלטפורמת אחסון (hosting).** עדיין לא הוחלט. שום דבר בקוד לא נעול לפלטפורמה ספציפית (אין Vercel KV וכו') — Postgres רגיל + Next.js standard, כדי לא לסבך מעבר בהמשך.

## בדיקות ידניות מומלצות

- דפדוף בין כל הדפים, כולל דף מוצר עם בחירת מידה/צבע/כמות והוספה לסל.
- קרוסלות בדף הבית ברוחב מחשב — חיצי ניווט מופיעים ועובדים (ונעלמים כשאין overflow), וברוחב מובייל — גלילת מגע חלקה בלי חיצים.
- השלמת הזמנה מלאה (סל ← תשלום ← אישור), ואז בדיקה שההזמנה מופיעה ב-`/admin/orders`.
- כניסה לניהול, יצירה/עריכה/מחיקה של מוצר כולל העלאת תמונה, ובדיקה שהשינוי משתקף מיד בחנות.
