import { Suspense } from "react";
import DoneContent from "./DoneContent";

export default function DonePage() {
  return (
    <Suspense fallback={null}>
      <DoneContent />
    </Suspense>
  );
}
