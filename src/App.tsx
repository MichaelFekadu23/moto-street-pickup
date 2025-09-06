import { useEffect } from 'react';
import Layout from './components/Layout'; // Import the new Layout wrapper
// import AwaitingDriverConfirm from './routes/AwaitingDriverConfirm';
import Entry from './routes/Entry'; // Import the Entry component
// import Intrip from './routes/InTrip'; // Import the InTrip component
// import Receipt from './routes/Receipt'; // Import the Receipt component
// import TripComplete from './routes/TripComplete'; // Import the TripComplete component


function App() {
  useEffect(() => {
      // Function to set the CSS variable for viewport height
      const setVh = () => {
        // Get the viewport height in pixels and set a CSS variable on the document root
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
      };
  
      // Set the initial viewport height
      setVh();
  
      // Add an event listener to update the height on window resize (e.g., device rotation)
      window.addEventListener('resize', setVh);
  
      // Cleanup function to remove the event listener when the component unmounts
      return () => window.removeEventListener('resize', setVh);
    }, []); // The empty dependency array ensures this effect runs only once on mount
    
  return (
    <Layout>
      <Entry />
      {/* <AwaitingDriverConfirm /> */}
      {/* <Intrip /> */}
      {/* <Receipt /> */}
      {/* < TripComplete /> */}
    </Layout>
  );
}

export default App;