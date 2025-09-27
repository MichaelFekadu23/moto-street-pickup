import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';

import Entry from './routes/Entry';
import AwaitingDriverConfirm from './routes/AwaitingDriverConfirm';
import InTrip from './routes/InTrip';
import TripCompleted from './routes/TripCompleted';
import Receipt from './routes/Receipt';
import { RideRejected } from './routes/RideRejected';
import { RideProvider } from './features/ride/rideContext'; // Import the new unified context

function App() {
  return (
    <RideProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Entry />} />
            <Route path="/awaiting" element={<AwaitingDriverConfirm />} />
            <Route path="/trip" element={<InTrip />} />
            <Route path="/trip-completed" element={<TripCompleted />} />
            <Route path="/receipt" element={<Receipt />} />
            <Route path="/ride-rejected" element={<RideRejected />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </Router>
    </RideProvider>
  );
}

export default App;