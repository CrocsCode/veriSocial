import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { NavigationHandler } from './routes/navigation.js';
import store, { persistor } from './redux/store.js';
import LoginPage from './pages/LoginPage.jsx';
import theme from './styles/theme.js';
import HomePage from './pages/HomePage.jsx';
import Layout from "./styles/layout"

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ChakraProvider theme={theme}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <Router>
            <NavigationHandler />
            <Routes>
              {/* Login Routes */}
              <Route element={<Layout />}>
                <Route path="/" element={<HomePage />} />
              </Route>

              {/* Logout Routes */}
              <Route path="/login" element={<LoginPage />} />
            </Routes>
          </Router>
        </PersistGate>
      </Provider>
    </ChakraProvider>
  </StrictMode>
);

