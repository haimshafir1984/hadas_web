import { BRA_SIZE_TABLE, CLOTHING_SIZE_TABLE } from "@/lib/constants";

export function BraSizeTable() {
  return (
    <div className="t-scroll">
      <table className="t">
        <thead>
          <tr>
            <th>מידה</th>
            <th>מתחת לחזה</th>
            <th>חזה B</th>
            <th>חזה C</th>
            <th>חזה D</th>
          </tr>
        </thead>
        <tbody>
          {BRA_SIZE_TABLE.map((row) => (
            <tr key={row[0]}>
              {row.map((cell, i) => (
                <td key={i}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <p style={{ fontSize: 12.5, marginTop: 8 }}>כל המידות בסנטימטרים. בספק — היקף קטן, גביע גדול.</p>
    </div>
  );
}

export function ClothingSizeTable() {
  return (
    <div className="t-scroll">
      <table className="t">
        <thead>
          <tr>
            <th>מידה</th>
            <th>חזה</th>
            <th>מותן</th>
            <th>ירכיים</th>
          </tr>
        </thead>
        <tbody>
          {CLOTHING_SIZE_TABLE.map((row) => (
            <tr key={row[0]}>
              {row.map((cell, i) => (
                <td key={i}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
