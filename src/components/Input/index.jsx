import "./Input.css";

export default function Input({ label, type = "text", bind }) {
  return (
    <div class="input">
      <label> {label} </label>
      <input type={type} bind={bind} />
    </div>
  );
}
