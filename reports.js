let writer;

export async function logErrorToFile(message, error = "") {
    const timestamp = new Date().toISOString();
    if (!writer) {
        const file = Bun.file(`error_${timestamp}.log`);
        writer = file.writer();
    }
    const logEntry = `[${timestamp}] ${message}${error ? ' | ' + error : ''}\n`;
    writer.write(logEntry);
}

export async function writeReportToFile(message) {
    const timestamp = new Date().toISOString();
    const file = Bun.file(`report.log`);
    await file.write(message);
}

export async function showReport() {
    console.log("*".repeat(40) + "Last report" + "*".repeat(40));
    console.log(await Bun.file(`report.log`).text());
}