 export default function MaterialsList({ materials }) {
  if (!materials?.length) return <p>No materials</p>;

  return (
    <ul>
      {materials.map((m) => (
        <li key={m.id}>{m.title}</li>
      ))}
    </ul>
  );
}
