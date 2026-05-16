type StatusMessageProps = {
  type: "success" | "error";
  message: string;
  onDismiss: () => void;
};

const styles = {
  success: "border-green-200 bg-green-50 text-green-800",
  error: "border-red-200 bg-red-50 text-red-800",
};

export default function StatusMessage({
  type,
  message,
  onDismiss,
}: StatusMessageProps) {
  return (
    <div
      role="alert"
      className={`mb-4 flex items-start justify-between gap-3 rounded-lg border px-4 py-3 text-sm ${styles[type]}`}
    >
      <p className="font-medium">{message}</p>
      <button
        type="button"
        onClick={onDismiss}
        className="shrink-0 text-lg leading-none opacity-70 hover:opacity-100"
        aria-label="Dismiss message"
      >
        ×
      </button>
    </div>
  );
}
