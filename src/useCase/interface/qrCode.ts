interface QRCodeI {
    generateQR(data: any): Promise<string>;
}
export default QRCodeI;
