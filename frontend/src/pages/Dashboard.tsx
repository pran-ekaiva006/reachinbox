import { Link } from "react-router-dom";

export default function Dashboard() {
  return (
    <div>
      <h1>ReachInbox Dashboard</h1>

      <nav>
        <ul>
          <li>
            <Link to="/scheduled">Scheduled Emails</Link>
          </li>
          <li>
            <Link to="/sent">Sent Emails</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
