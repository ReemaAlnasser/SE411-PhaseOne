import { Navigate, Route, Routes } from 'react-router-dom';
import NavBar from './components/NavBar';
import CarList from './pages/CarList';
import AddCar from './pages/AddCar';
import EditCar from './pages/EditCar';
import CarDetails from './pages/CarDetails';
import About from './pages/About';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <>
      <NavBar />
      <main className="container">
        <Routes>
          <Route path="/" element={<Navigate to="/cars" replace />} />
          <Route path="/cars" element={<CarList />} />
          <Route path="/cars/new" element={<AddCar />} />
          <Route path="/cars/:id" element={<CarDetails />} />
          <Route path="/cars/:id/edit" element={<EditCar />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <footer className="footer">SE411 Project · Part 1 · Fall 2026–27</footer>
    </>
  );
}
