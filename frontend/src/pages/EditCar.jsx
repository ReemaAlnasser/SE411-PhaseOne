import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import CarForm from '../components/CarForm';
import { getCar, updateCar } from '../api/carApi';

export default function EditCar() {
  const { id } = useParams();
  const [car, setCar] = useState(undefined); // undefined = loading, null = not found
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    getCar(id).then(setCar).catch(() => setCar(null));
  }, [id]);

  if (car === undefined) return <p>Loading…</p>;

  if (car === null) {
    return (
      <section>
        <h1>Car not found</h1>
        <Link to="/cars">Back to the list</Link>
      </section>
    );
  }

  const handleSubmit = async (changes) => {
    try {
      await updateCar(car.id, changes);
      navigate('/cars');
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <section>
      <h1>
        Edit {car.make} {car.model}
      </h1>
      {error && <p className="error" role="alert">{error}</p>}
      <CarForm
        initialValues={car}
        submitLabel="Save Changes"
        onSubmit={handleSubmit}
        onCancel={() => navigate('/cars')}
      />
    </section>
  );
}
