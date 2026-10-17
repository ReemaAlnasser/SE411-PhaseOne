import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';
import { CarProvider } from '../context/CarContext';

export function renderApp(route = '/cars', initialData) {
  return render(
    <MemoryRouter
      initialEntries={[route]}
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <CarProvider {...(initialData ? { initialData } : {})}>
        <App />
      </CarProvider>
    </MemoryRouter>,
  );
}
