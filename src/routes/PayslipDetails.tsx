import { useParams } from "react-router";
import { Payslip } from "../core/types";
import { payslipsData } from "../core/mockData";
import { Link } from "react-router-dom";
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Capacitor } from '@capacitor/core';
import { registerPlugin } from '@capacitor/core';
import type { FileOpenerOptions, FileOpenerPlugin } from "../core/definitions";
const FileOpener = registerPlugin<FileOpenerPlugin>('FileOpener');

function PayslipDetails() {
	const { id } = useParams<{ id: string }>();
	const payslip: Payslip | undefined = payslipsData.find((p) => p.id === id);


	const handleDownload = async () => {
		const fileName = "example.pdf"

		try {

			if (Capacitor.isNative) {

				const fileData = await fetch(`/assets/files/${fileName}`);
				const blob = await fileData.blob();
				const reader = new FileReader();

				reader.onloadend = async () => {
					const base64Data = reader.result as string;

					const savedFile = await Filesystem.writeFile({
						path: fileName,
						data: base64Data,
						directory: Directory.Documents,
						recursive: true,
					})

					console.log('File downloaded successfully.');
					console.log(savedFile.uri);
					const fileOpenerOptions: FileOpenerOptions = {
						filePath: savedFile.uri,
						contentType: 'application/pdf',
					}
					await FileOpener.open(fileOpenerOptions)
						.then(() => {
							// 'File is opened'
						})
						.catch((error) => {
							console.error(error)
						})

				};
				reader.readAsDataURL(blob);
			} else {
				// For web platform
				const url = `/assets/files/${fileName}`;
				const a = document.createElement('a');
				a.href = url;
				a.download = fileName;
				document.body.appendChild(a);
				a.click();
				document.body.removeChild(a);
			}
		} catch (error) {
			console.error('Error downloading file:', error);
		}
	};

	if (!payslip) {
		return <h1>Payslip not found!</h1>;
	}

	return (
		<div className="payslip-details-container">
			<Link to={`/`}>Back</Link>
			<div className="payslip-info">
				<h1>Payslip Details</h1>
				<h2>{`Payslip ID: ${payslip.id}`}</h2>
				<h2>{`Period: ${payslip.fromDate} - ${payslip.toDate}`}</h2>
				<button onClick={handleDownload}>Download Payslip</button>
			</div>
		</div>
	);
}

export default PayslipDetails;