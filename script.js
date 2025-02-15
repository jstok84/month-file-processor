const monthsSlovenian = ['Januar', 'Februar', 'Marec', 'April', 'Maj', 'Junij', 'Julij', 'Avgust', 'September', 'Oktober', 'November', 'December'];

function processFiles() {
    const files = document.getElementById('file-input').files;
    const resultsContainer = document.getElementById('results');
    
    if (files.length === 0) {
        resultsContainer.innerText = "Please select at least one file.";
        return;
    }

    resultsContainer.innerText = "Processing files...\n";

    // Loop through each file selected
    for (let file of files) {
        let reader = new FileReader();
        reader.onload = function(event) {
            const workbook = XLSX.read(event.target.result, { type: 'binary' });
            let sheetName = workbook.SheetNames[0];
            let sheet = workbook.Sheets[sheetName];

            // Log the raw sheet data to the console
            console.log(`Raw data from sheet [${sheetName}]:`, sheet);

            // Convert the sheet to JSON (row-based, for easier reading)
            let rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });

            // Log the rows to see what data was read from the file
            console.log(`Rows read from sheet [${sheetName}]:`, rows);

            // Display the raw content in the results container
            resultsContainer.innerText += `\nRaw content from file: ${file.name}:\n`;

            rows.forEach((row, index) => {
                resultsContainer.innerText += `Row ${index + 1}: ${row.join(' | ')}\n`;
            });
        };
        reader.readAsBinaryString(file);
    }
}
