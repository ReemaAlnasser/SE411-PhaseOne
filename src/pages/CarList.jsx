import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCars } from '../context/CarContext';
import { CAR_STATUSES } from '../data/cars';
import StatusBadge from '../components/StatusBadge';

export default function CarList() {
  const { cars, deleteCar } = useCars();
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return cars.filter((c) => {
      const matchesText =
        !q || [c.make, c.model, c.plateNumber, c.color].some((v) => v.toLowerCase().includes(q));
      const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
      return matchesText && matchesStatus;
    });
  }, [cars, query, statusFilter]);

  const handleDelete = (car) => {
    if (window.confirm(`Delete ${car.make} ${car.model} (${car.plateNumber})?`)) {
      deleteCar(car.id);
    }
  };

  return (
    <section>
      <div className="page-header">
        <div>
          <h1>Cars</h1>
          <p className="muted">
            {cars.length} car{cars.length === 1 ? '' : 's'} in the fleet
          </p>
        </div>
        <Link to="/cars/new" className="btn btn-primary">
          + Add Car
        </Link>
      </div>

      <div className="toolbar">
        <input
          type="search"
          placeholder="Search by make, model, plate or color…"
          aria-label="Search cars"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <select
          aria-label="Filter by status"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="All">All statuses</option>
          {CAR_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {visible.length === 0 ? (
        <p className="empty card">No cars found.</p>
      ) : (
        <div className="card table-wrap">
          <table>
            <thead>
              <tr>
                <th>Plate</th>
                <th>Make &amp; Model</th>
                <th>Year</th>
                <th>Color</th>
                <th>Mileage</th>
                <th>Status</th>
                <th aria-label="Actions" />
              </tr>
            </thead>
            <tbody>
              {visible.map((car) => (
                <tr key={car.id}>
                  <td className="mono">{car.plateNumber}</td>
                  <td>
                    <Link to={`/cars/${car.id}`}>
                      {car.make} {car.model}
                    </Link>
                  </td>
                  <td>{car.year}</td>
                  <td>{car.color}</td>
                  <td>{car.mileage.toLocaleString()} km</td>
                  <td>
                    <StatusBadge status={car.status} />
                  </td>
                  <td className="actions">
                    <Link to={`/cars/${car.id}/edit`} className="btn btn-small">
                      Edit
                    </Link>
                    <button
                      type="button"
                      className="btn btn-small btn-danger"
                      onClick={() => handleDelete(car)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
