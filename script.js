const monthsSlovenian = ['Januar', 'Februar', 'Marec', 'April', 'Maj', 'Junij', 'Julij', 'Avgust', 'September', 'Oktober', 'November', 'December'];

function getMonthName(monthNumber) {
    return monthsSlovenian[monthNumber - 1];
}

function processFiles() {
    const selectedMonths = Array.from(document.querySelectorAll('input[type="checkbox"]:checked'))
        .map(checkbox => parseInt(checkbox.value)); // Get selected month values
    const files = document.getElementById('file-input').files;
    const resultsContainer = document.getElementById('results');
    let data = [];
    let totalSum = 0;

    if (selectedMonths.length === 0) {
        resultsContainer.innerText = "Please select at least one month.";
        return;
    }

    resultsContainer.innerText = "Processing files...\n";

    for (let file of files) {
        let reader = new FileReader();
        reader.onload = function(event) {
            const workbook = XLSX.read(event.target.result, { type: 'binary' });
            let sheetName = workbook.SheetNames[0];
            let sheet = workbook.Sheets[sheetName];

            let rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });
            let foundSkupaj = false;
            let monthName = "Unknown"; // Default in case of no month

            // Iterate over rows in the sheet
            rows.forEach((row, index) => {
                row.forEach((cell, colIndex) => {
                    // Convert cell to string and trim it, perform case-insensitive check for 'Skupaj'
                    if (typeof cell === 'string' && cell.trim().toLowerCase().includes("skupaj")) {
                        foundSkupaj = true;
                        monthName = getMonthName(selectedMonths[index]); // Map to Slovenian month
                        const leftValue = rows[index][colIndex - 1];
                        if (leftValue) {
                            data.push({ month: monthName, value: parseFloat(leftValue) });
                            totalSum += parseFloat(leftValue);
                        }
                    }
                });
            });

            if (!foundSkupaj) {
                resultsContainer.innerText += `No 'Skupaj' found in file: ${file.name}\n`;
            }
            if (data.length > 0) {
                resultsContainer.innerText += `Processed file: ${file.name}\n`;
            }
            outputResults();
        };
        reader.readAsBinaryString(file);
    }

    function outputResults() {
        if (data.length > 0) {
            let finalData = [...data];
            let results = "Processed Data:\n";
            finalData.forEach(d => {
                results += `Month: ${d.month}, Value: ${d.value}\n`;
            });

            // Calculate sum and append to results
            let sum = finalData.reduce((acc, d) => acc + d.value, 0);
            results += `\nTotal Sum: ${sum}`;

            // Prepare results for divisor calculation (example used 499)
            const divisor = 499;
            let remainder = Math.abs(sum);
            let divisorResults = [];

            while (remainder >= divisor) {
                remainder -= divisor;
                divisorResults.push(divisor);
            }

            divisorResults.push(remainder);
            results += `\n\nDivisor Results:\n${divisorResults.join('\n')}`;

            resultsContainer.innerText = results;
        }
    }
}
