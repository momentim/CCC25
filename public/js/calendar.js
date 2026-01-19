// Calendar Events Script
// Fetches data from Google Sheets and displays as a formatted table

// Function to parse CSV data
function parseCSV(text) {
    const lines = text.split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    const events = [];
    
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        
        const values = [];
        let current = '';
        let inQuotes = false;
        
        for (let j = 0; j < line.length; j++) {
            const char = line[j];
            if (char === '"') {
                inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
                values.push(current.trim());
                current = '';
            } else {
                current += char;
            }
        }
        values.push(current.trim());
        
        if (values.length >= headers.length && values[0]) {
            const event = {};
            headers.forEach((header, index) => {
                event[header] = values[index] || '';
            });
            events.push(event);
        }
    }
    
    return events;
}

// Main function to load and display calendar events
function loadCalendarEvents() {
    const sheetId = '18RVO0BAL2EADIhq4tetBrfRuKQlZY_20y-7xp8NedFA';
    const csvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=0`;

    fetch(csvUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch calendar data');
            }
            return response.text();
        })
        .then(csvText => {
            const events = parseCSV(csvText);
            const container = document.getElementById('calendar-events');

            if (!container) {
                console.error('Calendar container element not found. Make sure you have an element with id="calendar-events"');
                return;
            }

            if (events.length === 0) {
                container.innerHTML = '<div class="error">No events found.</div>';
                return;
            }

            // Group events by day
            const grouped = {};
            events.forEach(event => {
                const dayTimeStr = event['calDay&Time'] || '';
                if (!dayTimeStr) return;
                
                const dayTimeParts = dayTimeStr.split(',');
                if (dayTimeParts.length < 3) return;
                
                const dayDate = dayTimeParts[0].trim() + ', ' + dayTimeParts[1].trim();
                const time = dayTimeParts.slice(2).join(',').trim();
                
                if (!grouped[dayDate]) grouped[dayDate] = [];
                grouped[dayDate].push({ 
                    ...event, 
                    timeOnly: time 
                });
            });

            // Generate HTML table
            let html = '<table>';

            Object.entries(grouped).forEach(([dayDate, dayEvents]) => {
                html += `
                    <tr>
                        <td colspan="3" class="day-heading">${dayDate}</td>
                    </tr>
                `;

                dayEvents.forEach(ev => {
                    const eventName = ev.calEvent || '';
                    const location = ev.calLocation || '';
                    const locationURL = ev.calLocationURL || '';
                    const eventURL = ev.calURL || '';

                    const locationDisplay = locationURL 
                        ? `<a href="${locationURL}">${location}</a>`
                        : location;

                    html += `
                        <tr>
                            <td class="event-cell">
                                ${eventURL 
                                    ? `<a href="${eventURL}" target="_blank">${eventName}</a>`
                                    : eventName}
                            </td>
                            <td class="event-cell">${ev.timeOnly}</td>
                            <td class="event-cell">${locationDisplay}</td>
                        </tr>
                    `;
                });
            });

            html += '</table>';
            container.innerHTML = html;
        })
        .catch(error => {
            console.error('Error fetching calendar data:', error);
            const container = document.getElementById('calendar-events');
            if (container) {
                container.innerHTML = '<div class="error">Error loading calendar events. Please try again later.</div>';
            }
        });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', loadCalendarEvents);