import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'
import { Toaster } from '../@/components/ui/sonner'
import store from "./store";
import { Provider } from "react-redux";
import * as Sentry from "@sentry/react";

Sentry.init({
	dsn: "https://6027d8dd93c51371cd5778f1bb2d5196@o4509646806646784.ingest.de.sentry.io/4509646810579024",
	// Setting this option to true will send default PII data to Sentry.
	// For example, automatic IP address collection on events
	sendDefaultPii: true
});

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
