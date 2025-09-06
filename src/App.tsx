import Layout from './components/Layout'; // Import the new Layout wrapper
import AwaitingDriverConfirm from './routes/AwaitingDriverConfirm';
import Entry from './routes/Entry'; // Import the Entry component

function App() {
  return (
    <Layout>
      <Entry />
      {/* <AwaitingDriverConfirm /> */}
    </Layout>
  );
}

export default App;