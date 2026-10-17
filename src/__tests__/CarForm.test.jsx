import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import CarForm, { validateCar } from '../components/CarForm';

const valid = {
  make: 'Honda',
  model: 'Civic',
  year: '2021',
  plateNumber: 'hnd 4455',
  color: 'Red',
  fuelType: 'Petrol',
  mileage: '15000',
  status: 'Available',
};

describe('validateCar', () => {
  it('accepts a valid car', () => {
    expect(validateCar(valid)).toEqual({});
  });

  it('reports every missing required field', () => {
    const errors = validateCar({ ...valid, make: '', model: ' ', year: '', plateNumber: '', color: '', mileage: '' });
    expect(Object.keys(errors).sort()).toEqual(['color', 'make', 'mileage', 'model', 'plateNumber', 'year']);
  });

  it('rejects an out-of-range year and negative mileage', () => {
    const errors = validateCar({ ...valid, year: '1950', mileage: '-5' });
    expect(errors.year).toMatch(/between/);
    expect(errors.mileage).toMatch(/negative/);
  });

  it('rejects a duplicate plate number (case-insensitive)', () => {
    expect(validateCar(valid, ['HND 4455']).plateNumber).toMatch(/already/);
  });
});

describe('CarForm', () => {
  it('shows validation errors and does not submit an empty form', async () => {
    const onSubmit = vi.fn();
    render(<CarForm submitLabel="Add Car" onSubmit={onSubmit} onCancel={() => {}} />);
    await userEvent.click(screen.getByRole('button', { name: 'Add Car' }));
    expect(screen.getByText('Make is required.')).toBeInTheDocument();
    expect(screen.getByText('Plate number is required.')).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('submits normalized values', async () => {
    const onSubmit = vi.fn();
    render(<CarForm submitLabel="Add Car" onSubmit={onSubmit} onCancel={() => {}} />);
    await userEvent.type(screen.getByLabelText('Make'), 'Honda');
    await userEvent.type(screen.getByLabelText('Model'), 'Civic');
    await userEvent.type(screen.getByLabelText('Year'), '2021');
    await userEvent.type(screen.getByLabelText('Plate Number'), 'hnd 4455');
    await userEvent.type(screen.getByLabelText('Color'), 'Red');
    await userEvent.type(screen.getByLabelText('Mileage (km)'), '15000');
    await userEvent.selectOptions(screen.getByLabelText('Fuel Type'), 'Hybrid');
    await userEvent.click(screen.getByRole('button', { name: 'Add Car' }));

    expect(onSubmit).toHaveBeenCalledWith({
      make: 'Honda',
      model: 'Civic',
      year: 2021,
      plateNumber: 'HND 4455',
      color: 'Red',
      fuelType: 'Hybrid',
      mileage: 15000,
      status: 'Available',
    });
  });

  it('pre-fills values in edit mode', () => {
    render(
      <CarForm
        initialValues={{ ...valid, year: 2021, mileage: 15000 }}
        submitLabel="Save Changes"
        onSubmit={() => {}}
        onCancel={() => {}}
      />,
    );
    expect(screen.getByLabelText('Make')).toHaveValue('Honda');
    expect(screen.getByLabelText('Year')).toHaveValue(2021);
  });

  it('calls onCancel', async () => {
    const onCancel = vi.fn();
    render(<CarForm submitLabel="Add Car" onSubmit={() => {}} onCancel={onCancel} />);
    await userEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(onCancel).toHaveBeenCalledOnce();
  });
});
