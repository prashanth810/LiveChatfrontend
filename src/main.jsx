import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom'
import Mystore from './redux/store/Mystore.js';
import { Provider } from 'react-redux'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Provider store={Mystore}>
      <App />
    </Provider>
  </BrowserRouter>,
)
