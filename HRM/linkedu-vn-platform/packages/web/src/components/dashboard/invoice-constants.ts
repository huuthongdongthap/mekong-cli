export const PAYMENT_METHODS = [
  { value: "bank_transfer", label: "Chuyển khoản" },
  { value: "momo", label: "MoMo" },
  { value: "vnpay", label: "VNPay" },
  { value: "zalopay", label: "ZaloPay" },
  { value: "cash", label: "Tiền mặt" },
  { value: "other", label: "Khác" },
]

export function fmtVnd(n: number): string {
  return n.toLocaleString("vi-VN") + " đ"
}
