 export default function PendingGroupsList({ groups, onApprove }) {
  return (
    <ul>
      {groups.map((g) => (
        <li key={g.id}>
          {g.name}
          <button onClick={() => onApprove(g.id)}>Approve</button>
        </li>
      ))}
    </ul>
  );
}
