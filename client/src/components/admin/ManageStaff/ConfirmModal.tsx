import Button from '../../ui/Button';

interface Props {
  open: boolean;
  title: string;
  message: string;
  confirmText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmModal: React.FC<Props> = ({
  open,
  title,
  message,
  confirmText = 'Yes',
  onConfirm,
  onCancel,
}) => {
  if (!open) return null;

  return (
    <div className="modal modal-open backdrop-blur-sm">
      <div className="modal-box ring-neutral ring-1">
        <h3 className="text-lg font-bold">{title}</h3>
        <p className="py-4">{message}</p>

        <div className="modal-action">
          <Button text="No" title="Cancel" className="btn btn-ghost" onClick={onCancel} />
          <Button
            title={confirmText}
            text={confirmText}
            className="btn btn-error text-white"
            onClick={onConfirm}
          />
        </div>
      </div>

      <div className="modal-backdrop" onClick={onCancel} />
    </div>
  );
};

export default ConfirmModal;
