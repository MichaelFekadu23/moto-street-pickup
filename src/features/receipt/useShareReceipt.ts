// src/hooks/useShareReceipt.ts
import { useState } from "react";
import { fetchReceipt } from "./receiptService";
import { shareReceipt } from "./receiptShare";
import type { Receipt } from "./type";

export function useShareReceipt() {
  const [loading, setLoading] = useState(false);

  const run = async (rideId: string) => {
    setLoading(true);
    try {
      const receipt: Receipt = await fetchReceipt(rideId);
      const result = await shareReceipt(receipt);
      return { ok: true, method: result.method as "file" | "text" | "clipboard" };
    } catch (e: any) {
      return { ok: false, error: e?.message ?? "Failed to share receipt." };
    } finally {
      setLoading(false);
    }
  };

  return { share: run, loading };
}
