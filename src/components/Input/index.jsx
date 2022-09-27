import "./Input.css";

export default function Input({ label, type = "text", bind, oninput }) {
  return (
    <div class="input">
      <label> {label} </label>
      <input type={type} bind={bind} oninput={oninput} />
    </div>
  );
}
