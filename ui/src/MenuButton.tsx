import './MenuButton.css'

type Props = {
  text: string;
  shortcut?: string;
  icon: JSX.Element;
}
function MenuButton({ text, shortcut = '', icon }: Props) {
  return (
    <button className="menu-button">
      {icon}
      <div className="menu-text">{text}</div>
      <div className="menu-shortcut-text">{shortcut}</div>
    </button>
  );
}

export default MenuButton;