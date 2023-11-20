import QRCodeI from "../../useCase/interface/qrCode";
import QR from 'qrcode';

class GenerateQRCode implements QRCodeI {
    generateQR(data: any): Promise<string> {
        const dataJSON = JSON.stringify(data);

        return new Promise((resolve, reject) => {
            QR.toDataURL(dataJSON, function (err, code) {
                if (err) {
                    console.log(err);
                } else {
                    resolve(code);
                }
            });
        });
    }
}
export default GenerateQRCode;
