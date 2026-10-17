export const teamMembers = [
  { name: 'Reema Alnasser', studentId: '223410003' },
  { name: 'Sarah Almuhaini', studentId: '222511391' },
  { name: 'Aljoharah Alqahtani', studentId: '221511429' },
];

export default function About() {
  return (
    <section>
      <h1>About</h1>
      <p className="muted">
        Fleet Manager is a React application for managing a company&apos;s cars, built for the SE411
        course project (Part 1, Fall 2026–27).
      </p>
      <h2>Team Members</h2>
      <div className="card table-wrap">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Student ID</th>
            </tr>
          </thead>
          <tbody>
            {teamMembers.map((m) => (
              <tr key={m.studentId}>
                <td>{m.name}</td>
                <td className="mono">{m.studentId}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
