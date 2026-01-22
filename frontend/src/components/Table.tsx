export default function Table({ headers, children }: any) {
  return (
    <table className="w-full border rounded">
      <thead className="bg-gray-100">
        <tr>
          {headers.map((h: string) => (
            <th key={h} className="p-3 text-left">{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>{children}</tbody>
    </table>
  );
}