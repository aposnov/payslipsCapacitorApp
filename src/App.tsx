import './App.css';
import { Outlet } from 'react-router-dom';

function App() {
	return (
    <div className="app-container">
			<h1>Payslips App</h1>
			<Outlet />
		</div>
	);
}

export default App;