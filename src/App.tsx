import { BookingProvider } from './services/BookingContext';
import { BookingPage } from './pages/BookingPage';

function App() {
  return (
    <BookingProvider>
      <BookingPage />
    </BookingProvider>
  );
}

export default App;
