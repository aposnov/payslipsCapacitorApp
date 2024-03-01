import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import PayslipList from './routes/PayslipList';
import PayslipDetails from './routes/PayslipDetails';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
	<React.StrictMode>
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<App />}>
					<Route path="" element={<PayslipList />} />
					<Route path="/payslip/:id" element={<PayslipDetails />} />
				</Route>
			</Routes>
		</BrowserRouter>
	</React.StrictMode>
);