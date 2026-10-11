import { prisma } from "./prisma";
import { BRA_SIZE_TABLE, CLOTHING_SIZE_TABLE, QUIZ_STEPS } from "./constants";
import { quizToText, tableToText } from "./text-parse";

export type TextDef = {
  key: string;
  label: string;
  group: string;
  multiline?: boolean;
  default: string;
};

export const TEXT_DEFS: TextDef[] = [
  { key: "home.hero.text", label: "טקסט פתיחה (ליד התמונה)", group: "עמוד ראשי — פתיחה", multiline: true,
    default: "שלום, אני הדס והאושר שלי בחיים זה פרפר סגול. אני חיה את עולם החזיות והבגדים, ואני רואה בזה שליחות — למצוא לכל אישה בדיוק את המידה שמתאימה לה.\nברוכה הבאה לאתר שלי, אני שמחה כל כך שהגעת!" },
  { key: "home.hero.who", label: "חתימה", group: "עמוד ראשי — פתיחה", default: "הדס, בעלת פרפר סגול" },
  { key: "home.hero.link", label: "קישור לסיפור המלא", group: "עמוד ראשי — פתיחה", default: "לקרוא את הסיפור המלא" },

  { key: "home.bras.title", label: "כותרת — חזיות", group: "עמוד ראשי — סקשנים", default: "חזיות" },
  { key: "home.bras.text", label: "טקסט — חזיות", group: "עמוד ראשי — סקשנים", multiline: true,
    default: "חזיות זה לא בגד שקונים סתם. זה בגד עם רגש, עם אהבה — ואנחנו כאן שתמצאי את שלך." },
  { key: "home.quiz.title", label: "כותרת — שאלון", group: "עמוד ראשי — סקשנים", default: "שאלון התאמת חזייה" },
  { key: "home.quiz.text", label: "טקסט — שאלון", group: "עמוד ראשי — סקשנים", multiline: true,
    default: "שיטה ייחודית להתאמת חזייה ע״י שאלון מרחוק — למי שלא יודעת מה נכון לה." },
  { key: "home.under.title", label: "כותרת — הלבשה תחתונה", group: "עמוד ראשי — סקשנים", default: "הלבשה תחתונה" },
  { key: "home.period.title", label: "כותרת — תחתוני מחזור", group: "עמוד ראשי — סקשנים", default: "תחתוני מחזור" },
  { key: "home.period.text", label: "טקסט — תחתוני מחזור", group: "עמוד ראשי — סקשנים", multiline: true,
    default: "ספיגה מדורגת, כותנה נעימה, בלי תחושת מוצר רפואי — ליום שלם בלי לחשוב על זה פעם נוספת." },
  { key: "home.cloth.title", label: "כותרת — ביגוד", group: "עמוד ראשי — סקשנים", default: "ביגוד" },
  { key: "home.circles.title", label: "כותרת — מעגלי החיים", group: "עמוד ראשי — סקשנים", default: "מעגלי החיים" },
  { key: "home.circles.text", label: "טקסט — מעגלי החיים", group: "עמוד ראשי — סקשנים", multiline: true,
    default: "הגוף משתנה — והמלאי אצלנו מסודר לפי השלב שאת בו, לא רק לפי המידה שרשומה בתווית." },
  { key: "home.guides.title", label: "כותרת — מדריכים", group: "עמוד ראשי — סקשנים", default: "מדריכים" },
  { key: "home.guides.text", label: "טקסט — מדריכים", group: "עמוד ראשי — סקשנים", multiline: true,
    default: "מה שאנחנו מסבירות בחנות עשר פעמים ביום, כתוב — בלי מונחים מקצועיים ובלי לנסות למכור לך משהו." },
  { key: "home.story.title", label: "כותרת — הסיפור", group: "עמוד ראשי — סקשנים", default: "הסיפור של פרפר סגול" },
  { key: "home.story.text", label: "טקסט — הסיפור", group: "עמוד ראשי — סקשנים", multiline: true,
    default: "למה פתחנו את החנות, ולמה אנחנו עדיין מאמינות שמדידה טובה שווה יותר מכל מבצע." },

  { key: "about.title", label: "כותרת", group: "עלינו", default: "חנות שבה מותר לקחת זמן" },
  { key: "about.text", label: "טקסט ראשי", group: "עלינו", multiline: true,
    default: "פתחנו את פרפר סגול ב-2009 אחרי שנים ששמענו את אותו משפט: ״ניסיתי הכול, שום דבר לא מתאים לי״. ברוב המקרים הבעיה לא הייתה הגוף — היא הייתה מידה לא נכונה שאף אחד לא טרח לבדוק. מאז אנחנו עושות דבר אחד: מודדות. עשרים דקות, בחדר סגור, בלי למהר ובלי לשפוט." },
  { key: "about.c1.title", label: "כרטיס 1 — כותרת", group: "עלינו", default: "מחיי החנות" },
  { key: "about.c1.text", label: "כרטיס 1 — טקסט", group: "עלינו", multiline: true,
    default: "כלה שהגיעה שעה לפני החופה. אמא ובת לחזייה הראשונה. לקוחה שחזרה אחרי אחת-עשרה שנים ואמרה שהחזייה עוד מחזיקה." },
  { key: "about.c2.title", label: "כרטיס 2 — כותרת", group: "עלינו", default: "אני מסמיקה :)" },
  { key: "about.c2.text", label: "כרטיס 2 — טקסט", group: "עלינו", multiline: true,
    default: "״נכנסתי בטוחה שאני 75C. יצאתי 70E ובפעם הראשונה לא כאב לי הגב בסוף היום.״ — רחל, ראש העין" },
  { key: "about.c3.title", label: "כרטיס 3 — כותרת", group: "עלינו", default: "איך מגיעים" },
  { key: "about.c3.text", label: "כרטיס 3 — טקסט", group: "עלינו", multiline: true,
    default: "רח׳ הרצל 12, פתח תקווה. חניון ציבורי 80 מטר. א׳–ה׳ 10:00–19:00, ו׳ 9:00–13:00. 03-9000000." },
  { key: "about.c4.title", label: "כרטיס 4 — כותרת", group: "עלינו", default: "משלוחים והחזרות" },
  { key: "about.c4.text", label: "כרטיס 4 — טקסט", group: "עלינו", multiline: true,
    default: "שליח ₪29, חינם מעל ₪250, איסוף מהחנות חינם. החלפה תוך 14 יום עם תווית מחוברת." },

  { key: "footer.about", label: "תיאור החנות בפוטר", group: "פוטר", multiline: true,
    default: "הלבשה תחתונה עם התאמה אישית מאז 2009." },

  { key: "sizeguide.title", label: "כותרת", group: "מדריך מידות", default: "מדריך מידות" },
  { key: "sizeguide.intro", label: "פתיח", group: "מדריך מידות", multiline: true,
    default: "מידה נכונה משנה הכול: נוחות, תמיכה, ומראה. כך מודדים בבית, בחמש דקות, מול מראה." },
  { key: "sizeguide.steps", label: "איך מודדים (שורה לכל שלב)", group: "מדריך מידות", multiline: true,
    default: "עומדים זקוף, ללא חזייה מרופדת או עם חזייה דקה וחלקה.\nמודדים את היקף בית החזה מתחת לחזה, כשהסרט צמוד ומקביל לרצפה.\nמודדים את היקף החזה בנקודה הרחבה ביותר, בלי להדק.\nההפרש בין שני המספרים קובע את הגביע: כל 2 ס״מ הם גביע נוסף.\nבבגדים: מודדים חזה, מותן וירכיים ובודקים בטבלה." },
  { key: "sizeguide.tips", label: "טיפים (שורה לכל טיפ)", group: "מדריך מידות", multiline: true,
    default: "בין שתי מידות — בוחרות את הקטנה בהיקף והגדולה בגביע.\nהמידה עשויה להשתנות בין דגמים ובדים, ולכן כדאי למדוד שוב.\nלא בטוחות? כתבו לנו בוואטסאפ ונעזור." },

  { key: "pdp.perks", label: "יתרונות מתחת לכפתור ההוספה (שורה לכל יתרון)", group: "עמוד מוצר", multiline: true,
    default: "החלפה והחזרה תוך 14 יום, גם על פריטי מבצע\nייעוץ מידה חינם בוואטסאפ לפני ההזמנה\nאיסוף מהחנות בפתח תקווה — חינם, תוך שעתיים" },
  { key: "pdp.shipping", label: "טאב משלוח והחזרה", group: "עמוד מוצר", multiline: true,
    default: "משלוח שליח עד הבית ₪29, חינם מעל ₪250. איסוף עצמי מהחנות בפתח תקווה — חינם. החלפה או החזרה תוך 14 יום עם תווית מחוברת. תחתונים ובגדי ים אינם ניתנים להחזרה מטעמי היגיינה." },
  { key: "pdp.reviews", label: "חוות דעת בעמוד מוצר (שורה לכל חוות דעת: שם|כוכבים 1-5|זמן|טקסט)", group: "עמוד מוצר", multiline: true,
    default: "נועה|5|לפני שבועיים|״הזמנתי אחרי שהתייעצתי בוואטסאפ. המידה שהמליצו הייתה בול, בלי החזרה.״\nדנה|4|לפני חודש|״נוחה מאוד, אבל הצבע קצת יותר בהיר מהתמונה.״" },

  { key: "sale.text", label: "טקסט בעמוד המבצעים", group: "מבצעים", default: "עד 35% הנחה. המלאי במידות הפופולריות אוזל מהר." },

  { key: "site.whatsapp", label: "מספר וואטסאפ (ספרות בלבד, כולל קידומת מדינה, למשל 972501234567)", group: "הגדרות כלליות", default: "" },
  { key: "seo.title", label: "כותרת האתר בגוגל ובלשונית הדפדפן", group: "הגדרות כלליות", default: "פרפר סגול · חנות" },
  { key: "seo.description", label: "תיאור האתר בגוגל", group: "הגדרות כלליות", multiline: true,
    default: "הלבשה תחתונה, חזיות, ביגוד, תחתוני מחזור ובגדי ים צנועים." },

  { key: "size.bra", label: "טבלת מידות חזיות (שורה לכל מידה: מידה|מתחת לחזה|חזה B|חזה C|חזה D)", group: "טבלאות מידות ושאלון", multiline: true,
    default: tableToText(BRA_SIZE_TABLE) },
  { key: "size.clothing", label: "טבלת מידות ביגוד (שורה לכל מידה: מידה|חזה|מותן|ירכיים)", group: "טבלאות מידות ושאלון", multiline: true,
    default: tableToText(CLOTHING_SIZE_TABLE) },
  { key: "quiz.steps", label: "שאלות השאלון (שורה לכל שאלה: שאלה|תשובה|תשובה|...)", group: "טבלאות מידות ושאלון", multiline: true,
    default: quizToText(QUIZ_STEPS) },
];

// Free-form settings that are not plain text fields (JSON lists, image urls). Stored in the same table.
export async function getSetting(key: string): Promise<string> {
  const row = await prisma.siteText.findUnique({ where: { key } });
  return row?.value ?? "";
}

export async function setSetting(key: string, value: string) {
  if (!value) await prisma.siteText.deleteMany({ where: { key } });
  else await prisma.siteText.upsert({ where: { key }, update: { value }, create: { key, value } });
}

export async function getIdList(key: string): Promise<string[]> {
  try {
    const v = JSON.parse(await getSetting(key));
    return Array.isArray(v) ? v.map(String) : [];
  } catch {
    return [];
  }
}

const DEFAULTS: Record<string, string> = Object.fromEntries(TEXT_DEFS.map((d) => [d.key, d.default]));

export async function getTexts(): Promise<Record<string, string>> {
  const rows = await prisma.siteText.findMany();
  const out = { ...DEFAULTS };
  for (const r of rows) if (r.key in out && r.value.trim() !== "") out[r.key] = r.value;
  return out;
}
