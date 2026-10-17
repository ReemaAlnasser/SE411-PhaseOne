import { useState } from 'react';
import { CAR_STATUSES, FUEL_TYPES } from '../data/cars';

const MAX_YEAR = new Date().getFullYear() + 1;

const emptyCar = {
  make: '',
  model: '',
  year: '',
  plateNumber: '',
  color: '',
  fuelType: FUEL_TYPES[0],
  mileage: '',
  status: CAR_STATUSES[0],
};

export function validateCar(car, existingPlates = []) {
  const errors = {};
  if (!car.make.trim()) errors.make = 'Make is required.';
  if (!car.model.trim()) errors.model = 'Model is required.';

  const year = Number(car.year);
  if (car.year === '' || !Number.isInteger(year)) {
    errors.year = 'Year is required.';
  } else if (year < 1990 || year > MAX_YEAR) {
    errors.year = `Year must be between 1990 and ${MAX_YEAR}.`;
  }

  const plate = car.plateNumber.trim().toUpperCase();
  if (!plate) {
    errors.plateNumber = 'Plate number is required.';
  } else if (existingPlates.includes(plate)) {
    errors.plateNumber = 'Another car already uses this plate number.';
  }

  if (!car.color.trim()) errors.color = 'Color is required.';

  const mileage = Number(car.mileage);
  if (car.mileage === '' || Number.isNaN(mileage)) {
    errors.mileage = 'Mileage is required.';
  } else if (mileage < 0) {
    errors.mileage = 'Mileage cannot be negative.';
  }
  return errors;
}

export default function CarForm({ initialValues, existingPlates = [], submitLabel, onSubmit, onCancel }) {
  const [values, setValues] = useState(() => ({
    ...emptyCar,
    ...initialValues,
    year: initialValues?.year?.toString() ?? '',
    mileage: initialValues?.mileage?.toString() ?? '',
  }));
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const found = validateCar(values, existingPlates);
    if (Object.keys(found).length) {
      setErrors(found);
      return;
    }
    onSubmit({
      make: values.make.trim(),
      model: values.model.trim(),
      year: Number(values.year),
      plateNumber: values.plateNumber.trim().toUpperCase(),
      color: values.color.trim(),
      fuelType: values.fuelType,
      mileage: Number(values.mileage),
      status: values.status,
    });
  };

  const field = (name, label, props = {}) => (
    <div className="field">
      <label htmlFor={name}>{label}</label>
      <input
        id={name}
        name={name}
        value={values[name]}
        onChange={handleChange}
        aria-invalid={Boolean(errors[name])}
        aria-describedby={errors[name] ? `${name}-error` : undefined}
        {...props}
      />
      {errors[name] && (
        <span id={`${name}-error`} className="error" role="alert">
          {errors[name]}
        </span>
      )}
    </div>
  );

  const select = (name, label, options) => (
    <div className="field">
      <label htmlFor={name}>{label}</label>
      <select id={name} name={name} value={values[name]} onChange={handleChange}>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );

  return (
    <form className="card form" onSubmit={handleSubmit} noValidate>
      <div className="form-grid">
        {field('make', 'Make', { placeholder: 'e.g. Toyota' })}
        {field('model', 'Model', { placeholder: 'e.g. Camry' })}
        {field('year', 'Year', { type: 'number', min: 1990, max: MAX_YEAR })}
        {field('plateNumber', 'Plate Number', { placeholder: 'e.g. ABC 1234' })}
        {field('color', 'Color', { placeholder: 'e.g. White' })}
        {field('mileage', 'Mileage (km)', { type: 'number', min: 0 })}
        {select('fuelType', 'Fuel Type', FUEL_TYPES)}
        {select('status', 'Status', CAR_STATUSES)}
      </div>
      <div className="form-actions">
        <button type="submit" className="btn btn-primary">
          {submitLabel}
        </button>
        <button type="button" className="btn" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
}
