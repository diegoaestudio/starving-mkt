import Nullstack from "nullstack";
import "./Button.css";

class Button extends Nullstack {
  render({ onclick, className, children, disable }) {
    return (
      <button
        class={["btn font-bold uppercase", className]}
        onclick={onclick}
        disable={disable}
      >
        {children}
      </button>
    );
  }
}

export default Button;
