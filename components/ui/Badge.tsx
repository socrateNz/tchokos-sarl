"use client";

interface BadgeProps {
  status: "pending" | "confirmed" | "delivered";
  size?: "sm" | "md";
}

const labels = {
  pending: "En attente",
  confirmed: "Confirmée",
  delivered: "Livrée",
};

const Badge = ({ status, size = "md" }: BadgeProps) => {
  const sizeClass = size === "sm" ? "text-[10px] px-2 py-0.5" : "text-xs px-3 py-1";
  return (
    <span className={`badge badge-${status} ${sizeClass}`}>
      {labels[status]}
    </span>
  );
};

export default Badge;
