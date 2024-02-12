import React from 'react';
import App from './App';
import { ChakraProvider } from "@chakra-ui/react";
import theme from './theme';
import { createRoot } from 'react-dom/client';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <App />
    </ChakraProvider>
  </React.StrictMode>
);
