import './styles/Modal.css';

type Props = {
  showing: boolean
  onDismiss: () => void
  actionName?: string
  onSubmit?: () => void
}
function Modal({ showing, onDismiss, actionName, onSubmit, children }: React.PropsWithChildren<Props>) {

  if (!showing) return null;
  return (
    <>
      <form onSubmit={(e) => {
        e.preventDefault();
        if (onSubmit !== undefined) {
          onSubmit();
        }
      }}>
        <div className="outside-of-modal" onClick={onDismiss}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            {children}
            <div className="modal-footer">
              <button type="button" onClick={onDismiss}>Cancel</button>
              {onSubmit !== undefined &&
                <button type="submit">{actionName ?? 'Submit'}</button>
              }
            </div>
          </div>
        </div >
      </form>
    </>
  );
}

export default Modal;