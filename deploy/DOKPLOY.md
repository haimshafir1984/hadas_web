# העלאה ל-Dokploy (Contabo)

האתר רץ כאפליקציה מ-`Dockerfile` שבשורש הריפו, עם Postgres של Dokploy, ותמונות בתיקייה קבועה (volume).

## 1. מסד נתונים
1. ב-Dokploy: פרויקט חדש (למשל `parpar-sagol`) → **Create Service → Database → PostgreSQL**.
2. שם: `parpar-db`, משתמש `parpar`, שם מסד `parpar_sagol`, סיסמה חזקה. גרסה 16.
3. **לא** לפתוח פורט חיצוני (External Port) — האפליקציה מתחברת מתוך הרשת הפנימית.
4. אחרי היצירה, להעתיק את ה-**Internal Connection URL**. הוא נראה כך:
   `postgresql://parpar:<סיסמה>@parpar-db:5432/parpar_sagol`

## 2. האפליקציה
1. באותו פרויקט: **Create Service → Application**, מקור **GitHub**, הריפו `haimshafir1984/hadas_web`, ענף `main`.
2. **Build Type: Dockerfile** (נתיב `./Dockerfile`).
3. **Environment**:
   ```
   DATABASE_URL=<ה-Internal Connection URL מהשלב הקודם>
   DIRECT_URL=<אותו ערך>
   ```
   (אין צורך בכל משתני Supabase. אם הם מוגדרים — ללא `UPLOAD_DIR` האתר ישתמש בהם. ב-Dockerfile כבר מוגדר `UPLOAD_DIR=/data/uploads`, כך שההעלאות נשמרות בדיסק של השרת.)
4. **Advanced → Volumes**: להוסיף **Volume Mount**, שם `parpar-uploads`, נתיב בתוך הקונטיינר `/data/uploads`. בלי זה התמונות נמחקות בכל דיפלוי.
5. **Domains**: להוסיף את הדומיין, פורט `3000`, **HTTPS** פעיל (Let's Encrypt). הדומיין צריך להצביע (רשומת A) לכתובת ה-IP של השרת.
6. **Deploy**. בלוג אמור להופיע `All migrations have been successfully applied`, ואחריו `Ready`.
7. **Auto Deploy**: להפעיל, כדי שכל דחיפה ל-`main` תפרוס אוטומטית (או Webhook מ-GitHub).

## 3. גיבויים (חשוב)
- ב-Dokploy, בשירות ה-Postgres → **Backups**: להגדיר יעד S3 (אפשר Contabo Object Storage, שהוא תואם S3) וזמן יומי, עם שמירה של 14 ימים.
- את תיקיית התמונות (`parpar-uploads`) כדאי לגבות גם היא (למשל באמצעות Volume Backups של Dokploy או `rsync`).
- אפשר גם ייצוא מוצרים והזמנות לאקסל מהניהול.

## 4. העברת נתונים מ-Supabase (אם יש מה להעביר)
מהמחשב שלך, אחרי שפרויקט ה-Supabase Active:

```bash
pg_dump "<DIRECT_URL של Supabase>" --no-owner --no-privileges --schema=public -Fc -f parpar.dump
```

ואז לשחזר למסד החדש (פותחים זמנית פורט חיצוני ב-Dokploy או מריצים מתוך הקונטיינר):

```bash
pg_restore --no-owner --no-privileges -d "<כתובת המסד החדש>" parpar.dump
```

תמונות שהועלו ל-Supabase Storage ממשיכות לעבוד כל עוד הקישורים שלהן חיים. אם מבטלים את Supabase, צריך להעלות אותן מחדש.

## 5. אחרי העלייה
- להיכנס ל-`/admin`, לבדוק מוצרים, קטגוריות ותמונות.
- **להחליף את הסיסמה הקשיחה admin/1234 לפני שמפרסמים** (נשאר לסוף, כפי שסוכם).
