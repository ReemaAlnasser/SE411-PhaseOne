import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CarForm from '../components/CarForm';
import { addCar } from '../api/carApi';

export default function AddCar() {
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (car) => {
    try {
      await addCar(car);
      navigate('/cars');
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <section>
      <h1>Add Car</h1>
      {error && <p className="error" role="alert">{error}</p>}
      <CarForm submitLabel="Add Car" onSubmit={handleSubmit} onCancel={() => navigate('/cars')} />
    </section>
  );
}
