import "../Styles/confirm-dialog.css";

type Props = {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmDialog({
  title,
  message,
  onConfirm,
  onCancel,
}: Props) {
  return (
    <div className="cd-overlay" onClick={onCancel}>
      <div className="cd-dialog" onClick={(e) => e.stopPropagation()}>
        <h2 className="cd-title">{title}</h2>
        <p className="cd-message">{message}</p>
        <div className="cd-actions">
          <button className="cd-cancel" onClick={onCancel}>
            Cancel
          </button>
          <button className="cd-confirm" onClick={onConfirm}>
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
