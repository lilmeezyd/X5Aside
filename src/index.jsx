import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'
import { Toaster } from '../@/components/ui/sonner'
import store from "./store";
import { Provider } from "react-redux";

ReactDOM.createRoot(document.getElementById('root')).render(
	<Provider store={store}>
	<React.StrictMode>
		<BrowserRouter>
			<App />
			<Toaster />
		</BrowserRouter>
	</React.StrictMode>
	</Provider> 
)
