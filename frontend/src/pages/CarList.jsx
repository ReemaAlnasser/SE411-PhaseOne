import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { deleteCar, getCars } from '../api/carApi';
import StatusBadge from '../components/StatusBadge';

const PAGE_SIZE = 5;

export default function CarList() {
  const [cars, setCars] = useState([]);
  const [page, setPage] = useState(0); // the backend counts pages from 0
  const [totalPages, setTotalPages] = useState(0);
  const [totalCars, setTotalCars] = useState(0);
  const [error, setError] = useState('');
  const [searchId, setSearchId] = useState('');
  const navigate = useNavigate();

  const loadCars = async () => {
    try {
      const data = await getCars(page, PAGE_SIZE);
      setCars(data.content);
      setTotalPages(data.page.totalPages);
      setTotalCars(data.page.totalElements);
      setError('');
    } catch (e) {
      setError(e.message);
    }
  };

  // Load the cars again every time the page number changes.
  useEffect(() => {
    loadCars();
  }, [page]);

  const handleDelete = async (car) => {
    if (window.confirm(`Delete ${car.make} ${car.model} (${car.plateNumber})?`)) {
      await deleteCar(car.id);
      if (cars.length === 1 && page > 0) {
        setPage(page - 1); // the page is now empty, go back one page
      } else {
        loadCars();
      }
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchId.trim()) navigate(`/cars/${searchId.trim()}`);
  };

  return (
    <section>
      <div className="page-header">
        <div>
          <h1>Cars</h1>
          <p className="muted">
            {totalCars} car{totalCars === 1 ? '' : 's'} in the fleet
          </p>
        </div>
        <Link to="/cars/new" className="btn btn-primary">
          + Add Car
        </Link>
      </div>

      <form className="toolbar" onSubmit={handleSearch}>
        <input
          type="number"
          min="1"
          placeholder="Search by ID…"
          aria-label="Car ID"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
        />
        <button type="submit" className="btn">
          Search
        </button>
      </form>

      {error && <p className="error">{error}</p>}

      {cars.length === 0 ? (
        <p className="empty card">No cars found.</p>
      ) : (
        <div className="card table-wrap">
          <table>
            <thead>
              <tr>
                <th>ID</th>
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
              {cars.map((car) => (
                <tr key={car.id}>
                  <td className="mono">{car.id}</td>
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

      {totalPages > 1 && (
        <div className="pagination">
          <button type="button" className="btn" disabled={page === 0} onClick={() => setPage(page - 1)}>
            Previous
          </button>
          <span>
            Page {page + 1} of {totalPages}
          </span>
          <button
            type="button"
            className="btn"
            disabled={page + 1 >= totalPages}
            onClick={() => setPage(page + 1)}
          >
            Next
          </button>
        </div>
      )}
    </section>
  );
}
