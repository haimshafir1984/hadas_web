import Link from "next/link";

const CARDS: [string, string][] = [
  ["מחיי החנות", "כלה שהגיעה שעה לפני החופה. אמא ובת לחזייה הראשונה. לקוחה שחזרה אחרי אחת-עשרה שנים ואמרה שהחזייה עוד מחזיקה."],
  ["אני מסמיקה :)", "״נכנסתי בטוחה שאני 75C. יצאתי 70E ובפעם הראשונה לא כאב לי הגב בסוף היום.״ — רחל, ראש העין"],
  ["איך מגיעים", "רח׳ הרצל 12, פתח תקווה. חניון ציבורי 80 מטר. א׳–ה׳ 10:00–19:00, ו׳ 9:00–13:00. 03-9000000."],
  ["משלוחים והחזרות", "שליח ₪29, חינם מעל ₪250, איסוף מהחנות חינם. החלפה תוך 14 יום עם תווית מחוברת."],
];

export default function AboutPage() {
  return (
    <div className="wrap" style={{ paddingBottom: 60 }}>
      <div className="crumb">
        <Link href="/">דף הבית</Link> ← עלינו
      </div>
      <h1 style={{ fontSize: "clamp(26px,4vw,36px)" }}>חנות שבה מותר לקחת זמן</h1>
      <p style={{ color: "var(--ink-2)", maxWidth: "66ch" }}>
        פתחנו את פרפר סגול ב-2009 אחרי שנים ששמענו את אותו משפט: ״ניסיתי הכול, שום דבר לא מתאים לי״. ברוב המקרים
        הבעיה לא הייתה הגוף — היא הייתה מידה לא נכונה שאף אחד לא טרח לבדוק. מאז אנחנו עושות דבר אחד: מודדות. עשרים
        דקות, בחדר סגור, בלי למהר ובלי לשפוט.
      </p>
      <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(230px,1fr))", marginTop: 26 }}>
        {CARDS.map(([h, t]) => (
          <div className="p-card" style={{ padding: 20 }} key={h}>
            <h3 style={{ fontSize: 19, marginBottom: 6 }}>{h}</h3>
            <p style={{ margin: 0, fontSize: 14, color: "var(--ink-2)" }}>{t}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
