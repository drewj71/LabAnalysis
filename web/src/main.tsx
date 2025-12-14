import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { AppRouter } from "./router";
import { AuthProvider } from "./hooks/useAuth";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast';

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <AppRouter />
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  </React.StrictMode>
);
