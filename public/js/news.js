// CSV URL from your Google Sheet
const CSV_URL = 'https://docs.google.com/spreadsheets/d/1Pr_0g-h6Kh9iIKfFxR9mg1w_TwUeKVJvwW3ikF01FQM/export?format=csv&gid=0';

// Function to parse CSV data
function parseCSV(csvText) {
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
    const response = await fetch(CSV_URL);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const csvText = await response.text();
    const newsData = parseCSV(csvText);
    
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

// Initialize the news display when the DOM is loaded
document.addEventListener('DOMContentLoaded', fetchAndRenderNews);

// Alternative: Call fetchAndRenderNews() immediately if DOM is already loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', fetchAndRenderNews);
} else {
  fetchAndRenderNews();
}