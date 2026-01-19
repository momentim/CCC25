// Combined JavaScript for Daily Bible Reading, News, and Operation World Widget

// =============================================================================
// DAILY BIBLE READING FUNCTIONALITY
// =============================================================================

const BIBLE_CSV_URL = 'https://docs.google.com/spreadsheets/d/1OtH7lv1xwsAuMj6G6U_8S2COqa4Qa6l6MCGFDtk98So/export?format=csv&gid=778286819';

async function loadDailyReading() {
    const contentDiv = document.getElementById('daily-bible-reading');
    if (!contentDiv) {
        console.error('Element with id "daily-bible-reading" not found');
        return;
    }
    
    contentDiv.innerHTML = '<div>Loading today\'s Bible passage...</div>';
    
    try {
        const response = await fetch(BIBLE_CSV_URL);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const csvText = await response.text();
        const data = parseBibleCSV(csvText);
        
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

function parseBibleCSV(csvText) {
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

// Daily refresh check for Bible reading
function checkDailyRefresh() {
    const today = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
    const lastVisit = sessionStorage.getItem('lastVisitDate');

    if (lastVisit !== today) {
        sessionStorage.setItem('lastVisitDate', today);
        location.reload(); // Force reload on a new day
    }
}

// =============================================================================
// NEWS FUNCTIONALITY
// =============================================================================

const NEWS_CSV_URL = 'https://docs.google.com/spreadsheets/d/1Pr_0g-h6Kh9iIKfFxR9mg1w_TwUeKVJvwW3ikF01FQM/export?format=csv&gid=0';

// Function to parse CSV data for news
function parseNewsCSV(csvText) {
    const lines = csvText.split('\n');
    const headers = lines[0].split(',').map(header => header.trim().replace(/"/g, ''));
    const data = [];
    
    for (let i = 1; i < lines.length; i++) {
        if (lines[i].trim()) {
            // Handle CSV parsing with proper comma handling for quoted fields
            const values = [];
            let currentValue = '';
            let insideQuotes = false;
            
            for (let j = 0; j < lines[i].length; j++) {
                const char = lines[i][j];
                if (char === '"') {
                    insideQuotes = !insideQuotes;
                } else if (char === ',' && !insideQuotes) {
                    values.push(currentValue.trim());
                    currentValue = '';
                } else {
                    currentValue += char;
                }
            }
            values.push(currentValue.trim()); // Add the last value
            
            // Create object using headers as keys
            const item = {};
            headers.forEach((header, index) => {
                item[header] = values[index] || '';
            });
            data.push(item);
        }
    }
    
    return data;
}

// Function to create HTML for a single news item
function createNewsItem(item, isLast = false) {
    // Handle HTML entities in titles
    const title = item.newsTitle ? item.newsTitle.replace(/&#8217;/g, "'") : '';
    const imageURL = item['newsImage URL'] || item.newsImageURL || '';
    
    return `
        <article class="news-item">
            <h3><a href="${item.newsURL}" target="_blank">${title}</a></h3>
            ${imageURL ? `<img src="${imageURL}" alt="${title}" style="max-width: 100%; max-height: 500px; height: auto; margin: 10px 0; border-radius: 8px;">` : ''}
            <p style="font-style: italic; margin: 5px 0;">${item.newsDate}</p>
            <p>${item.newsDescription}</p>
            <a href="${item.newsURL}" target="_blank" style="display: inline-block; background-color: #007bff; color: white; padding: 8px 16px; text-decoration: none; border-radius: 4px; margin: 10px 0;">Read Full Article</a>
            ${!isLast ? '<hr style="margin: 20px 0; border: 1px solid #ddd;">' : ''}
        </article>
    `;
}

// Function to fetch and render news from CSV
async function fetchAndRenderNews() {
    const newsContainer = document.getElementById('news-container');
    if (!newsContainer) {
        console.error('News container element not found. Please add an element with id="news-container" to your HTML.');
        return;
    }

    try {
        // Show loading message
        newsContainer.innerHTML = '<p>Loading news...</p>';
        
        // Fetch CSV data
        const response = await fetch(NEWS_CSV_URL);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const csvText = await response.text();
        const newsData = parseNewsCSV(csvText);
        
        let htmlContent = '';
        
        // Determine how many Free Church items there are
        const freeChurchItems = newsData.filter(item => 
            item.newsSource && item.newsSource.toLowerCase().includes('free church')
        );
        const christianTodayItems = newsData.filter(item => 
            item.newsSource && item.newsSource.toLowerCase().includes('christian today')
        );
        
        // Add Free Church News section
        if (freeChurchItems.length > 0) {
            htmlContent += '<h2>Free Church News</h2>';
            freeChurchItems.forEach((item, index) => {
                const isLast = index === freeChurchItems.length - 1 && christianTodayItems.length === 0;
                htmlContent += createNewsItem(item, isLast);
            });
        }
        
        // Add Christian Today News section
        if (christianTodayItems.length > 0) {
            htmlContent += '<h2>Christian Today News</h2>';
            christianTodayItems.forEach((item, index) => {
                const isLast = index === christianTodayItems.length - 1;
                htmlContent += createNewsItem(item, isLast);
            });
        }
        
        // If no items match the expected sources, display all items
        if (freeChurchItems.length === 0 && christianTodayItems.length === 0 && newsData.length > 0) {
            htmlContent += '<h2>Latest News</h2>';
            newsData.forEach((item, index) => {
                const isLast = index === newsData.length - 1;
                htmlContent += createNewsItem(item, isLast);
            });
        }
        
        newsContainer.innerHTML = htmlContent;
        
    } catch (error) {
        console.error('Error fetching news data:', error);
        newsContainer.innerHTML = '<p>Error loading news. Please try again later.</p>';
    }
}

// =============================================================================
// OPERATION WORLD WIDGET
// =============================================================================

function loadOperationWorldWidget() {
    const s = document.createElement('script');
    s.src = 'https://widget.operationworld.org/js/widget.js';
    s.async = true;
    document.body.appendChild(s);
}

// =============================================================================
// INITIALIZATION
// =============================================================================

// Function to initialize all components
function initializeAllComponents() {
    // Load daily Bible reading
    loadDailyReading();
    
    // Load news
    fetchAndRenderNews();
    
    // Load Operation World widget
    loadOperationWorldWidget();
    
    // Check for daily refresh
    checkDailyRefresh();
}

// Initialize everything when the DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAllComponents);
} else {
    initializeAllComponents();
}