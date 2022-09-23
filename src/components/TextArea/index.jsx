import "./TextArea.css";

export default function TextArea({ label, type = "text", bind }) {
  return (
    <div class="textarea">
      <label> {label} </label>
      <textarea type={type} bind={bind} />
    </div>
  );
}
