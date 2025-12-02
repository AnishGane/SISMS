import AppRoutes from "./routes/AppRoutes";
import { Toaster } from 'react-hot-toast';

function App() {
  return(
    <>
      <AppRoutes />
      <Toaster
              position="bottom-right"
              toastOptions={{
                className: '',
                style: {
                  fontSize: '14px',
                  borderRadius: '9px',
                  padding: '15px 18px',
                },
                success: {
                  style: {
                    background: '#875cf5',
                    color: '#fff',
                  },
                  iconTheme: {
                    primary: '#fff',
                    secondary: '#16a34a',
                  },
                },
                error: {
                  style: {
                    background: '#dc2626', // red-600
                    color: '#fff',
                  },
                  iconTheme: {
                    primary: '#fff',
                    secondary: '#dc2626',
                  },
                },
              }}
            />
    </>
  );
}

export default App;
