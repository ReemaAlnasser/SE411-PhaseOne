import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <section>
      <h1>Page not found</h1>
      <Link to="/cars">Go to the car list</Link>
    </section>
  );
}
