import Nullstack from "nullstack";
import "./Button.css";

class Button extends Nullstack {
  render({ onclick, className, children }) {
    return (
      <button class={["btn font-bold uppercase", className]} onclick={onclick}>
        {children}
      </button>
    );
  }
}

export default Button;
