import { Link, useNavigate, useParams } from 'react-router-dom';
import CarForm from '../components/CarForm';
import { useCars } from '../context/CarContext';

export default function EditCar() {
  const { id } = useParams();
  const { cars, getCar, updateCar } = useCars();
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

  return (
    <section>
      <h1>
        Edit {car.make} {car.model}
      </h1>
      <CarForm
        initialValues={car}
        submitLabel="Save Changes"
        existingPlates={cars.filter((c) => c.id !== car.id).map((c) => c.plateNumber)}
        onSubmit={(changes) => {
          updateCar(car.id, changes);
          navigate('/cars');
        }}
        onCancel={() => navigate('/cars')}
      />
    </section>
  );
}
