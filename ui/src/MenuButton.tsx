import './MenuButton.css'

type Props = {
  text: string;
  link?: string;
  shortcut?: string;
  icon: JSX.Element;
}
function MenuButton({ text, link = '', shortcut = '', icon }: Props) {
  if (link !== '') {
    return (
      <a className="menu-button" href={link} target="_blank" >
        {icon}
        <div className="menu-text" > {text}</div>
        <div className="menu-shortcut-text">{shortcut}</div>
      </a >
    );
  } else {
    return (
      <button className="menu-button" >
        {icon}
        <div className="menu-text" > {text}</div>
        <div className="menu-shortcut-text">{shortcut}</div>
      </button >
    );
  }
}

export default MenuButton;