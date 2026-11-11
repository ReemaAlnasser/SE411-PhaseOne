import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { deleteCar, getCar } from '../api/carApi';
import StatusBadge from '../components/StatusBadge';

export default function CarDetails() {
  const { id } = useParams();
  const [car, setCar] = useState(undefined); // undefined = loading, null = not found
  const navigate = useNavigate();

  useEffect(() => {
    getCar(id).then(setCar).catch(() => setCar(null));
  }, [id]);

  if (car === undefined) return <p>Loading…</p>;

  if (car === null) {
    return (
      <section>
        <h1>Car not found</h1>
        <p className="muted">There is no car with ID {id}.</p>
        <Link to="/cars">Back to the list</Link>
      </section>
    );
  }

  const handleDelete = async () => {
    if (window.confirm(`Delete ${car.make} ${car.model} (${car.plateNumber})?`)) {
      await deleteCar(car.id);
      navigate('/cars');
    }
  };

  const rows = [
    ['ID', car.id],
    ['Make', car.make],
    ['Model', car.model],
    ['Year', car.year],
    ['Plate Number', car.plateNumber],
    ['Color', car.color],
    ['Fuel Type', car.fuelType],
    ['Mileage', `${car.mileage.toLocaleString()} km`],
    ['Status', <StatusBadge key="s" status={car.status} />],
  ];

  return (
    <section>
      <div className="page-header">
        <h1>
          {car.make} {car.model}
        </h1>
        <div className="actions">
          <Link to={`/cars/${car.id}/edit`} className="btn">
            Edit
          </Link>
          <button type="button" className="btn btn-danger" onClick={handleDelete}>
            Delete
          </button>
        </div>
      </div>
      <dl className="card details">
        {rows.map(([label, value]) => (
          <div key={label} className="details-row">
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
      <Link to="/cars">← Back to the list</Link>
    </section>
  );
}
