import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import { AuthenticationProvider } from "./authentication/authProviders/AuthenticationProvider.jsx";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <QueryClientProvider client={queryClient}>
    <React.StrictMode>
      <AuthenticationProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AuthenticationProvider>
    </React.StrictMode>
  </QueryClientProvider>
);
