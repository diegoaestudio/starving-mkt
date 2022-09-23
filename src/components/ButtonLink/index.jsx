import Nullstack from "nullstack";
import "./ButtonLink.css";

class ButtonLink extends Nullstack {
  render({ linkPath, className, children }) {
    return (
      <a class={["btn-link font-bold uppercase", className]} href={linkPath}>
        {children}
      </a>
    );
  }
}

export default ButtonLink;
