import { Link, useNavigate, useParams } from 'react-router-dom';
import { useCars } from '../context/CarContext';
import StatusBadge from '../components/StatusBadge';

export default function CarDetails() {
  const { id } = useParams();
  const { getCar, deleteCar } = useCars();
  const navigate = useNavigate();
  const car = getCar(Number(id));

  if (!car) {
    return (
      <section>
        <h1>Car not found</h1>
        <Link to="/cars">Back to the list</Link>
      </section>
    );
  }

  const handleDelete = () => {
    if (window.confirm(`Delete ${car.make} ${car.model} (${car.plateNumber})?`)) {
      deleteCar(car.id);
      navigate('/cars');
    }
  };

  const rows = [
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
