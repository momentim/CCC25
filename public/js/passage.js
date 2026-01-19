const CSV_URL = 'https://docs.google.com/spreadsheets/d/1OtH7lv1xwsAuMj6G6U_8S2COqa4Qa6l6MCGFDtk98So/export?format=csv&gid=778286819';

async function loadDailyReading() {
    const contentDiv = document.getElementById('daily-bible-reading');
    if (!contentDiv) {
        console.error('Element with id "daily-bible-reading" not found');
        return;
    }
    
    contentDiv.innerHTML = '<div>Loading today\'s Bible passage...</div>';
    
    try {
        const response = await fetch(CSV_URL);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const csvText = await response.text();
        const data = parseCSV(csvText);
        
        if (data.length < 2) {
            throw new Error('No data found in the spreadsheet');
        }
        
        // Assuming the data is in the second row (first row is headers)
        const row = data[1];
        const date = row[0];
        const reference = row[1];
        const theme = row[2];
        const passage = row[3];
        
        displayReading(date, reference, theme, passage);
        
    } catch (error) {
        console.error('Error loading daily reading:', error);
        contentDiv.innerHTML = `
            <div class="error">
                <strong>Error loading daily reading:</strong><br>
                ${error.message}<br><br>
                Please check that the Google Sheet is publicly accessible and try again.
            </div>
        `;
    }
}

function parseCSV(csvText) {
    const lines = csvText.trim().split('\n');
    const result = [];
    
    for (let line of lines) {
        const row = [];
        let current = '';
        let inQuotes = false;
        
        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            
            if (char === '"') {
                inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
                row.push(current.trim());
                current = '';
            } else {
                current += char;
            }
        }
        
        row.push(current.trim());
        result.push(row);
    }
    
    return result;
}

function displayReading(date, reference, theme, passage) {
    const formattedDate = formatDate(date);
    const dayOfWeek = getDayOfWeek(date);
    
    const html = `
        <p><strong>Theme of the Day:</strong> ${theme}</p>
        <p><strong>Bible Passage for ${dayOfWeek} ${formattedDate}:</strong> ${reference}</p>
        <div class="passage-text">
            ${passage}
        </div>
    `;
    
    document.getElementById('daily-bible-reading').innerHTML = html;
}

function formatDate(dateStr) {
    const date = new Date(dateStr);
    const day = date.getDate();
    const month = date.toLocaleDateString('en-GB', { month: 'long' });
    return `${day} ${month}`;
}

function getDayOfWeek(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', { weekday: 'long' });
}

function shouldRefresh() {
    // Use a simpler check that doesn't rely on localStorage
    const lastRefresh = sessionStorage.getItem('lastBibleRefresh');
    const today = new Date().toDateString();
    
    if (lastRefresh !== today) {
        sessionStorage.setItem('lastBibleRefresh', today);
        return true;
    }
    return false;
}

// Load the reading when the DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadDailyReading);
} else {
    loadDailyReading();
}

<script>
  (function() {
    const today = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
    const lastVisit = localStorage.getItem('lastVisitDate');

    if (lastVisit !== today) {
      localStorage.setItem('lastVisitDate', today);
      location.reload(); // Force reload on a new day
    }
  })();
</script>