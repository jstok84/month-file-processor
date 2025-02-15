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
            try {
                // Read the file as binary string
                const workbook = XLSX.read(event.target.result, { type: 'binary' });

                // Log the number of sheets in the workbook
                console.log(`The workbook contains ${workbook.SheetNames.length} sheets:`, workbook.SheetNames);

                // Loop through each sheet in the workbook and print all raw data
                workbook.SheetNames.forEach(sheetName => {
                    let sheet = workbook.Sheets[sheetName];
                    console.log(`Sheet Name: ${sheetName}`);

                    // Convert the sheet to JSON (row-based, for easier reading)
                    let rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });
                    console.log(`Rows from sheet [${sheetName}]:`, rows);

                    // Display the raw content in the results container
                    resultsContainer.innerText += `\nContent from sheet [${sheetName}]:\n`;

                    // Print each row of data
                    rows.forEach((row, index) => {
                        resultsContainer.innerText += `Row ${index + 1}: ${row.join(' | ')}\n`;
                    });
                });
            } catch (error) {
                console.error("Error reading the Excel file:", error);
                resultsContainer.innerText += "Error reading the Excel file. Please make sure it's a valid Excel file.";
            }
        };
        reader.readAsBinaryString(file);
    }
}

