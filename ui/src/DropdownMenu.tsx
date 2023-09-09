import { ReactNode } from "react";
import './DropdownMenu.css';

type Props = {
  children: ReactNode,
  showing: boolean,
  // TODO dismiss when starting to drag ReactFlow, use context/provider
  // dismiss: () => void
}
function DropdownMenu({ children, showing }: Props) {

  return showing ? (
    <div className="dropdown-menu-content" onClick={(e) => {
      e.stopPropagation();
    }}>
      {children}
    </div>
  ) : null;
}

export default DropdownMenu;