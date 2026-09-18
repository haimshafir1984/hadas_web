import type { PrismaClient } from "@prisma/client";

const BAND = ["70", "75", "80", "85", "90", "95"];
const CUP = ["B", "C", "D", "DD"];
const braSizes = () => BAND.flatMap((b) => CUP.map((c) => b + c));
const cl = ["XS", "S", "M", "L", "XL", "XXL"];

export const SEED_CATEGORIES = [
  {
    id: "bras",
    name: "חזיות",
    blurb: "התאמה מדויקת לכל שלב — מבייסיק יומיומי ועד חזיות הנקה.",
    subs: ["בייסיק", "מרופדות", "מינימייזר", "פושאפ", "הנקה", "מתחילות", "ספורט", "סטים", "אביזרים"],
  },
  {
    id: "under",
    name: "הלבשה תחתונה",
    blurb: "מחטבים, תחתונים וגופיות בבדים נושמים שנשארים נוחים כל היום.",
    subs: ["מחטבים", "תחתונים", "בייבידולים", "גופיות", "תחתיות", "קומבניזונים", "חולצות בית", "חולצות בסיס"],
  },
  {
    id: "cloth",
    name: "ביגוד",
    blurb: "שכבות בסיס, כותנות וחלוקים — הפריטים שנמצאים בשימוש הכי הרבה.",
    subs: ["חולצות", "חצאיות", "חלוקים", "כותנות", "פיג׳מות"],
  },
  {
    id: "period",
    name: "תחתוני מחזור",
    blurb: "ספיגה מדורגת, כותנה נעימה, בלי תחושת מוצר רפואי.",
    subs: ["כותנה", "דורינה", "ליליבלום"],
  },
  {
    id: "swim",
    name: "בגדי ים צנועים",
    blurb: "כיסוי מלא, בד עמיד לכלור, גזרה שלא מתרוממת במים.",
    subs: ["שלם", "חזייה לבריכה", "תחתוני מחזור לים", "מגבות"],
  },
  {
    id: "circles",
    name: "מעגלי החיים",
    blurb: "הגוף משתנה — והמלאי מסודר לפי השלב, לא רק לפי המידה.",
    subs: ["אחרי לידה והנקה", "כלות ואירועים", "נערות", "ספורט", "גיל המעבר"],
  },
];

export const SEED_PRODUCTS = [
  { id: "b1", n: "חזיית תמר", s: "בייסיק", c: "bras", pr: 129, r: 4.8, rc: 212, st: 14, d: "חזיית כותנה יומיומית עם חישוק דק וגב רחב. הבסיס שרוב הלקוחות שלנו חוזרות אליו.", col: ["#F4EFE9", "#2B2330", "#D8C3B4", "#8E9AA8"], sz: braSizes(), out: ["70DD", "95B"], f: ["92% כותנה מסורקת, 8% אלסטן", "חישוק דק עטוף — לא נדקר", "גב רחב שלא מתקפל", "כביסה עדינה 30°"], badge: "רב-מכר" },
  { id: "b2", n: "חזיית רננה", s: "מינימייזר", c: "bras", pr: 189, was: 229, r: 4.6, rc: 88, st: 5, d: "מינימייזר תחרה שמצמצם עד מידה אחת בהיקף החזה בלי לשטח.", col: ["#2B2330", "#6D2E9E", "#F4EFE9"], sz: braSizes(), out: ["70B"], f: ["תחרה אלסטית עם רירית כותנה", "כתפיות מרופדות ורחבות", "5 שורות ווים במידות הגדולות"], badge: "מבצע" },
  { id: "b3", n: "חזיית שירה", s: "הנקה", c: "bras", pr: 149, r: 4.9, rc: 341, st: 22, d: "פתיחה בכף יד אחת, ללא חישוק, עם כיס לרפידת הנקה.", col: ["#F4EFE9", "#2B2330", "#C9A3AF"], sz: braSizes(), out: [], f: ["קליפס פתיחה חד-ידני", "ללא חישוק — מתאים גם לשינה", "כיס פנימי לרפידה נשלפת", "בד נושם למניעת גודש"], badge: "הכי נמכר בהנקה" },
  { id: "b4", n: "חזיית יעל", s: "מרופדות", c: "bras", pr: 159, r: 4.5, rc: 126, st: 9, d: "ריפוד עדין שמחליק מתחת לחולצה, בלי הרמה אגרסיבית.", col: ["#F4EFE9", "#D8C3B4", "#2B2330", "#8E9AA8"], sz: braSizes(), out: ["95D"], f: ["ריפוד ספוג 4 מ״מ", "תפר חלק מתחת לבגד", "כתפיות מתכווננות מקדימה"] },
  { id: "b5", n: "חזיית אביגיל", s: "ספורט", c: "bras", pr: 179, r: 4.7, rc: 64, st: 3, d: "תמיכה גבוהה לריצה ואימוני עצימות, בלי חישוק.", col: ["#2B2330", "#6D2E9E", "#0E8F6F"], sz: cl, out: ["XXL"], f: ["תמיכה רמה 3 (גבוהה)", "בד מנדף זיעה", "גב מוצלב שלא נחתך"] },
  { id: "b6", n: "חזיית מרים", s: "מתחילות", c: "bras", pr: 89, r: 4.9, rc: 97, st: 31, d: "החזייה הראשונה: רכה, ללא חישוק, בגזרת גופייה קצרה.", col: ["#F4EFE9", "#C9A3AF", "#8E9AA8"], sz: ["XS", "S", "M", "L"], out: [], f: ["ללא חישוק וללא תפרים", "כותנה 100% ברירית", "גזרה שלא נראית מתחת לחולצה"], badge: "לנערות" },
  { id: "u1", n: "מחטב נועה", s: "מחטבים", c: "under", pr: 219, r: 4.4, rc: 53, st: 7, d: "מחטב מותניה בגזרה גבוהה — מחליק את קו המותן מתחת לשמלה.", col: ["#F4EFE9", "#2B2330"], sz: cl, out: ["XS"], f: ["דרגת חיטוב 2 מתוך 3", "סיליקון עדין שמחזיק במקום", "תפר שטוח בקצה"] },
  { id: "u2", n: "תחתון בסיס (3 יח׳)", s: "תחתונים", c: "under", pr: 99, was: 135, r: 4.8, rc: 410, st: 60, d: "מארז שלושה תחתוני כותנה בגזרה קלאסית מעל קו הטבור.", col: ["#F4EFE9", "#2B2330", "#C9A3AF"], sz: cl, out: [], f: ["כותנה 100% במגע עם הגוף", "גומי רך שלא חורץ", "מארז 3 יחידות"], badge: "3 ב-₪249" },
  { id: "u3", n: "גופיית הדס", s: "גופיות", c: "under", pr: 79, r: 4.6, rc: 188, st: 25, d: "גופיית כותנה כשכבת בסיס — ארוכה מספיק כדי להישאר בפנים.", col: ["#F4EFE9", "#2B2330", "#8E9AA8", "#D8C3B4"], sz: cl, out: ["XXL"], f: ["אורך מוארך ב-6 ס״מ", "כתפייה ברוחב 2 ס״מ", "לא מתקצרת בכביסה"] },
  { id: "u4", n: "קומבניזון אלה", s: "קומבניזונים", c: "under", pr: 139, r: 4.5, rc: 41, st: 12, d: "קומבניזון חלק למניעת הידבקות של שמלות וחצאיות.", col: ["#F4EFE9", "#2B2330", "#D8C3B4"], sz: cl, out: [], f: ["בד אנטי-סטטי", "שסע צדדי נסתר", "אורך 95 ס״מ"] },
  { id: "u5", n: "בייבידול נועם", s: "בייבידולים", c: "under", pr: 169, r: 4.7, rc: 36, st: 4, d: "בייבידול תחרה בגזרה זורמת, מגיע עם תחתון תואם.", col: ["#6D2E9E", "#2B2330", "#F4EFE9"], sz: ["S", "M", "L", "XL"], out: [], f: ["תחרה אלסטית רכה", "כולל תחתון תואם", "אריזת מתנה ללא תשלום"], badge: "חדש" },
  { id: "c1", n: "חולצת בסיס רות", s: "חולצות", c: "cloth", pr: 109, r: 4.6, rc: 151, st: 18, d: "שרוול ארוך בגזרה צמודה — שכבה ראשונה שנשארת חלקה.", col: ["#F4EFE9", "#2B2330", "#8E9AA8", "#6D2E9E"], sz: cl, out: ["XS"], f: ["ויסקוזה נושמת", "צווארון גבוה מעט", "אורך מתחת לקו האגן"] },
  { id: "c2", n: "חצאית טליה", s: "חצאיות", c: "cloth", pr: 229, was: 279, r: 4.7, rc: 73, st: 6, d: "חצאית מידי פליסה עם גומי במותן, נופלת יפה גם אחרי כביסה.", col: ["#2B2330", "#6D2E9E", "#0E8F6F"], sz: cl, out: ["XXL"], f: ["פליסה קבועה", "אורך 78 ס״מ", "בטנה מלאה"], badge: "מבצע" },
  { id: "c3", n: "חלוק ענבל", s: "חלוקים", c: "cloth", pr: 199, r: 4.8, rc: 59, st: 11, d: "חלוק מגבת קל שסופג בלי להכביד.", col: ["#F4EFE9", "#C9A3AF", "#8E9AA8"], sz: ["S", "M", "L", "XL"], out: [], f: ["מיקרו-מגבת מהירת ייבוש", "שני כיסים וחגורה", "לולאה לתלייה"] },
  { id: "c4", n: "כותונת שקד", s: "כותנות", c: "cloth", pr: 149, r: 4.5, rc: 82, st: 16, d: "כותונת לילה כותנה עם שרוול קצר וכיס.", col: ["#F4EFE9", "#C9A3AF", "#8E9AA8"], sz: cl, out: [], f: ["כותנה 100%", "אורך מתחת לברך", "כיס קדמי"] },
  { id: "c5", n: "פיג׳מת אורית", s: "פיג׳מות", c: "cloth", pr: 189, r: 4.6, rc: 44, st: 8, d: "מכנס ארוך וחולצה מכופתרת, בד שלא מתחשמל.", col: ["#8E9AA8", "#6D2E9E", "#F4EFE9"], sz: cl, out: ["XS"], f: ["כותנה-מודאל", "מכנס עם גומי וקשירה", "גזרה רחבה לשינה"] },
  { id: "p1", n: "תחתון מחזור כותנה", s: "כותנה", c: "period", pr: 69, r: 4.7, rc: 264, st: 40, d: "ספיגה בינונית — מחליף 2–3 טמפונים, נשטף במכונה.", col: ["#2B2330", "#F4EFE9"], sz: cl, out: [], f: ["ספיגה בינונית (עד 15 מ״ל)", "שכבה חיצונית אטומה", "עד 60 כביסות"], badge: "רב-פעמי" },
  { id: "p2", n: "תחתון ליליבלום", s: "ליליבלום", c: "period", pr: 89, r: 4.8, rc: 117, st: 2, d: "ספיגה גבוהה בגזרה גבוהה — מתאים גם ללילה.", col: ["#2B2330", "#6D2E9E"], sz: cl, out: ["XXL"], f: ["ספיגה גבוהה (עד 25 מ״ל)", "גזרה גבוהה לכיסוי מלא", "שכבה אנטיבקטריאלית"] },
  { id: "s1", n: "בגד ים מרינה", s: "שלם", c: "swim", pr: 349, r: 4.6, rc: 31, st: 5, d: "בגד ים שלם עם שרוול קצר וחצאית מובנית.", col: ["#2B2330", "#0E8F6F", "#6D2E9E"], sz: cl, out: ["XS", "XXL"], f: ["בד עמיד לכלור", "חצאית מובנית שלא מתרוממת", "הגנת UPF 50+"], badge: "צנוע" },
  { id: "s2", n: "מטפחת כותנה קשורה", s: "מגבות", c: "swim", pr: 59, r: 4.9, rc: 203, st: 48, d: "מטפחת כותנה עם קשירה מוכנה מאחור.", col: ["#C9A3AF", "#8E9AA8", "#2B2330", "#D8C3B4"], sz: ["מידה אחת"], out: [], f: ["כותנה רכה שלא מחליקה", "קשירה מוכנה", "12 גוונים במלאי"] },
];

export const SEED_GUIDES = [
  {
    title: "איך מודדים מידת חזייה נכונה",
    teaser: "שני מספרים, סרט מדידה אחד וחמש דקות מול המראה.",
    sections: [["למה זה משנה", "שמונה מתוך עשר נשים שנכנסות לחנות לובשות מידה לא נכונה — בדרך כלל היקף גדול מדי וגביע קטן מדי. התוצאה: החזייה מטפסת מאחור, הכתפיות נחתכות, והתמיכה מגיעה מהצוואר במקום מהגב."]],
    steps: ["מדדי את היקף בית החזה מתחת לחזה, כשסרט המדידה צמוד ומקביל לרצפה. עגלי למספר הזוגי הקרוב.", "מדדי את היקף החזה בנקודה הרחבה ביותר, בלי להדק.", "החסירי את הראשון מהשני: 13 ס״מ ≈ B, 15 ≈ C, 18 ≈ D, 20 ≈ DD.", "בדקי במראה שהגב ישר וקו אחד עם החזית."],
  },
  {
    title: "חמישה סימנים שהחזייה לא בגודל הנכון",
    teaser: "סימנים שקל לפספס — וקל לתקן.",
    sections: [["הסימנים", "הגב מטפס למעלה; הכתפיות משאירות חריץ; החישוק יושב על רקמת החזה; הגביע מתקמט או נשפך בצדדים; יש הקלה מיידית כשמורידים את החזייה בסוף היום."]],
    steps: ["גב שמטפס — היקף קטן יותר, גביע גדול יותר.", "גביע שמתקמט — גביע קטן יותר באותו היקף.", "חישוק שנדקר — כמעט תמיד גביע קטן מדי."],
  },
  {
    title: "כביסה ותחזוקה של הלבשה תחתונה",
    teaser: "חזייה טובה מחזיקה שנתיים — אם מכבסים אותה נכון.",
    sections: [["הכללים", "חזיות לא מתייבשות במייבש, לא מתכבסות ב-40 מעלות ולא נסחטות. כל אחד משלושת אלה מקצר את חיי האלסטן בחצי."]],
    steps: ["סגרי את הווים לפני הכביסה.", "רשת כביסה ותוכנית עדינה עד 30°.", "ייבוש בצל, שטוח.", "החליפי בין שתי חזיות לפחות."],
  },
  {
    title: "מדריך חזיות הנקה",
    teaser: "מה באמת חשוב בחודשים הראשונים, ומה פחות.",
    sections: [["לפני הלידה", "מומלץ למדוד בשבוע 36–38. ההיקף בדרך כלל גדל במידה אחת והגביע בשתיים. קני שתיים בלבד לתקופה הראשונה."]],
    steps: ["פתיחה שאפשר לפתוח ביד אחת, בחושך.", "ללא חישוק בשבועות הראשונים.", "מקום לרפידת הנקה בלי מתיחת הגביע."],
  },
];

export const SEED_ORDERS = [
  {
    orderNumber: "PS-10480",
    customerName: "נועה ברק",
    phone: "052-4410021",
    city: "ראש העין",
    items: [
      { productId: "b3", size: "80C", qty: 1 },
      { productId: "u2", size: "M", qty: 1 },
    ],
    shipping: 0,
    total: 277,
    status: "SENT" as const,
  },
  {
    orderNumber: "PS-10481",
    customerName: "מיכל אדרי",
    phone: "054-7782310",
    city: "פתח תקווה",
    items: [{ productId: "b2", size: "85C", qty: 1 }],
    shipping: 29,
    total: 218,
    status: "IN_PROGRESS" as const,
  },
];

export const SEED_SETTINGS = {
  id: "singleton",
  storeName: "פרפר סגול",
  phone: "03-9000000",
  address: "רח׳ הרצל 12, פתח תקווה",
  tickerHtml: "מבצע סוף עונה: <b>3 ב-₪249</b> על כל התחתונים · משלוח חינם מעל ₪250 · החזרה תוך 14 יום",
  shippingCost: 29,
  freeShippingOver: 250,
};

const GRAD_LEN = 5;
export function gradientIndexFor(id: string, name: string): number {
  return (id.charCodeAt(1) + name.length) % GRAD_LEN;
}

// Resets the database to the demo catalog shipped with the approved prototype.
// Used by both `prisma/seed.ts` and the admin "איפוס נתוני הדגמה" button.
export async function seedDatabase(prisma: PrismaClient) {
  await prisma.order.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.subcategory.deleteMany();
  await prisma.category.deleteMany();
  await prisma.guide.deleteMany();
  await prisma.storeSettings.deleteMany();

  const subcategoryIds = new Map<string, string>();

  for (const [order, cat] of SEED_CATEGORIES.entries()) {
    await prisma.category.create({ data: { id: cat.id, name: cat.name, blurb: cat.blurb, order } });
    for (const [subOrder, subName] of cat.subs.entries()) {
      const sub = await prisma.subcategory.create({ data: { name: subName, order: subOrder, categoryId: cat.id } });
      subcategoryIds.set(`${cat.id}|${subName}`, sub.id);
    }
  }

  for (const p of SEED_PRODUCTS) {
    await prisma.product.create({
      data: {
        id: p.id,
        name: p.n,
        categoryId: p.c,
        subcategoryId: subcategoryIds.get(`${p.c}|${p.s}`) ?? null,
        price: p.pr,
        wasPrice: p.was ?? null,
        stock: p.st,
        description: p.d,
        features: p.f,
        colors: p.col,
        sizes: p.sz,
        outOfStockSizes: p.out,
        badge: p.badge ?? null,
        gradientIndex: gradientIndexFor(p.id, p.n),
        rating: p.r,
        ratingCount: p.rc,
      },
    });
  }

  for (const [order, g] of SEED_GUIDES.entries()) {
    await prisma.guide.create({
      data: { order, title: g.title, teaser: g.teaser, sections: g.sections, steps: g.steps },
    });
  }

  for (const o of SEED_ORDERS) {
    await prisma.order.create({
      data: {
        orderNumber: o.orderNumber,
        customerName: o.customerName,
        phone: o.phone,
        city: o.city,
        items: o.items,
        shipping: o.shipping,
        total: o.total,
        status: o.status,
      },
    });
  }

  await prisma.storeSettings.create({ data: SEED_SETTINGS });
}
