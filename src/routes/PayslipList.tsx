import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Payslip } from '../core/types';
import { payslipsData } from '../core/mockData';

function PayslipList() {
	const [payslips] = useState<Payslip[]>(payslipsData);

	return (
		<main style={{ textAlign: 'center' }}>
			   <div className="payslip-list-container">
				<h1>Payslips</h1>
				<ul className="payslip-list">
					{payslips.map((payslip) => (
						<li key={payslip.id} className="payslip-item">
							<Link to={`/payslip/${payslip.id}`} className="payslip-link">
								<h2>{`Period: ${payslip.fromDate} - ${payslip.toDate}`}</h2>
							</Link>
						</li>
					))}
				</ul>
			</div>
		</main>
	);
}

export default PayslipList;