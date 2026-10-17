import { useNavigate } from 'react-router-dom';
import CarForm from '../components/CarForm';
import { useCars } from '../context/CarContext';

export default function AddCar() {
  const { cars, addCar } = useCars();
  const navigate = useNavigate();

  return (
    <section>
      <h1>Add Car</h1>
      <CarForm
        submitLabel="Add Car"
        existingPlates={cars.map((c) => c.plateNumber)}
        onSubmit={(car) => {
          addCar(car);
          navigate('/cars');
        }}
        onCancel={() => navigate('/cars')}
      />
    </section>
  );
}
