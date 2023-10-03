import './styles/MenuButton.css';

type Props = {
  text: string;
  onPress?: () => void;
  link?: string;
  shortcut?: string;
  icon?: JSX.Element;
};
function MenuButton({ text, link = '', onPress = () => { }, shortcut = '', icon }: Props) {
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
      <button className="menu-button" onClick={onPress}>
        {icon}
        <div className="menu-text" > {text}</div>
        <div className="menu-shortcut-text">{shortcut}</div>
      </button >
    );
  }
}

export default MenuButton;