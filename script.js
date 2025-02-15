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

                // Loop through each sheet in the workbook
                workbook.SheetNames.forEach(sheetName => {
                    let sheet = workbook.Sheets[sheetName];

                    // Convert the sheet to raw text (tab-separated)
                    let sheetText = XLSX.utils.sheet_to_txt(sheet);

                    // Display the sheet's raw text content in the results container
                    resultsContainer.innerText += `\nSheet: ${sheetName}\n`;
                    resultsContainer.innerText += sheetText + "\n\n";
                });
            } catch (error) {
                console.error("Error reading the Excel file:", error);
                resultsContainer.innerText += "Error reading the Excel file. Please make sure it's a valid Excel file.";
            }
        };
        reader.readAsBinaryString(file);
    }
}
