import Nullstack from "nullstack";
import "./ButtonLink.scss";

class ButtonLink extends Nullstack {
  render({ linkPath, className, children }) {
    return (
      <a class={["btn-link", className]} href={linkPath}>
        {children}
      </a>
    );
  }
}

export default ButtonLink;
