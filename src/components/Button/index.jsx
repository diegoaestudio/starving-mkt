import Nullstack from "nullstack";
import "./Button.scss";

class Button extends Nullstack {
  render({ onclick, className, children }) {
    return (
      <button class={["btn", className]} onclick={onclick}>
        {children}
      </button>
    );
  }
}

export default Button;
