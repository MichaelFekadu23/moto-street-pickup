// src/utils/receiptShare.ts
import type { Receipt } from "./type";

export function formatReceiptText(r: Receipt) {
  const money = (n: number) => `${r.currency} ${n.toFixed(2)}`;
  return [
    `Ride Receipt – ${r.ride_id}`,
    `Generated: ${new Date(r.generated_at).toLocaleString()}`,
    "",
    `Rider: ${r.rider_name}`,
    `Driver: ${r.driver_name} (${r.driver_id})`,
    `Vehicle: ${r.vehicle_model} • Plate: ${r.plate_number}`,
    "",
    `Start:  ${new Date(r.start_time).toLocaleString()} @ ${r.start_location}`,
    `End:    ${new Date(r.end_time).toLocaleString()} @ ${r.end_location}`,
    `Distance: ${r.distance} km • Duration: ${r.duration} min`,
    "",
    `Payment Method: ${r.payment_method}`,
    `Fare: ${money(r.fare)}`,
  ].join("\n");
}

export async function shareReceipt(r: Receipt) {
  const text = formatReceiptText(r);
  // Try file share first (better UX in many phones)
  try {
    const blob = new Blob([text], { type: "text/plain" });
    const file = new File([blob], `receipt_${r.ride_id}.txt`, { type: "text/plain" });
    if ((navigator as any).canShare?.({ files: [file] })) {
      await (navigator as any).share({ files: [file], title: "Ride Receipt", text: "" });
      return { method: "file" as const };
    }
  } catch {
    /* fall back */
  }

  // Fallback: plain text share (if supported)
  if (navigator.share) {
    await navigator.share({ title: "Ride Receipt", text });
    return { method: "text" as const };
  }

  // Final fallback: copy to clipboard
  await navigator.clipboard.writeText(text);
  return { method: "clipboard" as const };
}
