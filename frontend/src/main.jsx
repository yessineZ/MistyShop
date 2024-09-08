import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientContext, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'

const queryClient = new QueryClient({
  defaultOptions : {
    queries: {
      refetchOnWindowFocus: false,
    },
  }
});
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
    
    <QueryClientProvider client={queryClient} >
      <Toaster />
        <App />
    </QueryClientProvider>
    </BrowserRouter>
    
  </StrictMode>,
)
