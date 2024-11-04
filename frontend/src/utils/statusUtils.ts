export const STATUS_COLORS = {
  new: "info",
  pending: "warning",
  accepted: "success",
  rejected: "error",
} as const;

export const STATUS_LABELS = {
  new: "New Application",
  pending: "Under Review",
  accepted: "Approved",
  rejected: "Rejected",
} as const;

export const getStatusColor = (status: keyof typeof STATUS_COLORS) => {
  return STATUS_COLORS[status];
};

export const getStatusLabel = (status: keyof typeof STATUS_LABELS) => {
  return STATUS_LABELS[status];
};
