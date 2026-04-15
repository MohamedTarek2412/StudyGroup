export default function PendingCreatorsList({ creators }) {
  return (
    <ul>
      {creators.map((c) => (
        <li key={c.id}>{c.name}</li>
      ))}
    </ul>
  );
} 
