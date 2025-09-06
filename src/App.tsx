import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';

import Entry from './routes/Entry';
import AwaitingDriverConfirm from './routes/AwaitingDriverConfirm';
import InTrip from './routes/InTrip';
import TripComplete from './routes/TripComplete';
import Receipt from './routes/Receipt';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Entry />} />
          <Route path="/awaiting" element={<AwaitingDriverConfirm />} />
          <Route path="/trip" element={<InTrip />} />
          <Route path="/trip-complete" element={<TripComplete />} />
          <Route path="/receipt" element={<Receipt />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
