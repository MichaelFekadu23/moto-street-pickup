import Layout from './components/Layout'; // Import the new Layout wrapper
// import AwaitingDriverConfirm from './routes/AwaitingDriverConfirm';
// import Entry from './routes/Entry'; // Import the Entry component
import Intrip from './routes/InTrip'; // Import the InTrip component

function App() {
  return (
    <Layout>
      {/* <Entry /> */}
      {/* <AwaitingDriverConfirm /> */}
      <Intrip />
    </Layout>
  );
}

export default App;