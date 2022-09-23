import "./Select.css";

export default function Select({ label, bind, options }) {
  return (
    <div class="select">
      <label> {label} </label>
      <select name={label} id={label} bind={bind}>
        {options.map((option) => (
          <option value={option.value}>{option.label}</option>
        ))}
      </select>
    </div>
  );
}
