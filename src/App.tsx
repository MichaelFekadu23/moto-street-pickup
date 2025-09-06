import Layout from './components/Layout'; // Import the new Layout wrapper
// import AwaitingDriverConfirm from './routes/AwaitingDriverConfirm';
// import Entry from './routes/Entry'; // Import the Entry component
// import Intrip from './routes/InTrip'; // Import the InTrip component
// import TripComplete from './routes/TripComplete'; // Import the TripComplete component
import Receipt from './routes/Receipt';

function App() {
  return (
    <Layout>
      {/* <Entry /> */}
      {/* <AwaitingDriverConfirm /> */}
      {/* <Intrip /> */}
      {/* <TripComplete /> */}
      <Receipt />
    </Layout>
  );
}

export default App;