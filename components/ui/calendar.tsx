export function Calendar({ selected, onSelect }) {
  return (
    <input
      type="date"
      value={selected.toISOString().substring(0, 10)}
      onChange={(e) => onSelect(new Date(e.target.value))}
      className="w-full p-2 border rounded"
    />
  );
}
