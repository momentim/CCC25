---
title: "Charleston Community Church"
description: "Good News for Charleston"
showRecent: true
showRecentItems: 5
disableTextInHeader: true
showTableOfContents: true
cascade:
 featured_image: '/images/charleston.jpg'

---

### The good news of Jesus knows no bounds, a message of love and redemption reaching out to all people regardless of their background or circumstances. 
We gather for worship every **Sunday at 10:30** in the [Charleston Community Centre](contact/#charleston-community-centre).  You are very welcome to join us and see how the message of the Bible brings hope and life to those who trust in Jesus.
{{< youtube RbPMl5X5Bks >}}

## Charleston Community Church Vision

Our vision is to be a vibrant and transformative church, deeply rooted in the Word of God, passionately committed to honoring God, and centered on the person and work of Jesus Christ. We aspire to be a beacon of light, love, and hope in our community and beyond, impacting lives with the life-changing message of the Gospel.

Charleston Community Church is a family of Christian believers, united by our belief in Jesus Christ, the Son of God, who lived, died, and rose again, so that we, and anyone else who believes in him, can be reunited with our Heavenly Father.

Our hope is that everything we do is for God’s glory, not our own, as we seek to see Jesus known and praised across Dundee, Scotland, and the rest of the world. These beliefs and desires are underpinned by the Bible, the Word of God, which we hold as our highest authority. As individuals, and as a church family, we read it, learn from it and seek to apply it to our lives.

Continue reading in the <a href="about">About Us</a> section.

## What's on this Week:
<style>
  .calendar-table-container {
    display: flex;
    justify-content: center;
  }

  table {
    width: 100%;
    max-width: 900px; /* Optional: limit table width for better readability */
    border-collapse: collapse;
    font-family: sans-serif;
    table-layout: fixed;
  }

  td {
    border: 2px solid gray;
    padding: 6px;
    text-align: center;
  }

  .day-heading {
    font-weight: bold;
    text-align: left;
    font-size: 1.1em;
    padding-left: 20px;
    padding-top: 10px;
    padding-bottom: 6px;
  }

  .event-cell {
    width: 33%;
  }

  .event-cell:first-child {
    padding-left: 10px;
  }

  .event-cell:last-child {
    padding-right: 10px;
  }

  a {
    text-decoration: none;
  }

  a:hover {
    text-decoration: underline;
  }
</style>

<div class="calendar-table-container">
  <div id="calendar-events"></div>
</div>

<script>
fetch('/calendar/calendar.json')
  .then(response => response.json())
  .then(events => {
    const container = document.getElementById('calendar-events');

    const grouped = {};
    events.forEach(event => {
      const dayTimeParts = event.dayTime.split(',');
      const dayDate = dayTimeParts[0] + ', ' + dayTimeParts[1];
      const time = dayTimeParts.slice(2).join(',').trim();
      if (!grouped[dayDate]) grouped[dayDate] = [];
      grouped[dayDate].push({ ...event, timeOnly: time });
    });

    let html = '<table>';

    Object.entries(grouped).forEach(([dayDate, dayEvents]) => {
      html += `
        <tr>
          <td colspan="3" class="day-heading">${dayDate}</td>
        </tr>
      `;

      dayEvents.forEach(ev => {
        const locationDisplay = ev.locationURL
          ? `<a href="${ev.locationURL}">${ev.location}</a>`
          : ev.location;

        html += `
          <tr>
            <td class="event-cell">
              ${ev.url 
                ? `<a href="${ev.url}" target="_blank">${ev.event}</a>`
                : ev.event}
            </td>
            <td class="event-cell">${ev.timeOnly}</td>
            <td class="event-cell">${locationDisplay}</td>
          </tr>
        `;
      });
    });

    html += '</table>';
    container.innerHTML = html;
  });
</script>


<br>

Read [today's daily bible passage](../about/daily-bible-reading). This collection of readings will help prepare you for Sunday's sermon and worship.

<br>

{{< gallery >}}
<img src="gallery/craft-group.png" class="grid-w50 md:grid-w33 xl:grid-w25" />
<img src="gallery/featureseniorsbingo.JPG" class="grid-w50 md:grid-w33 xl:grid-w25" />
<img src="gallery/book-club.png" class="grid-w50 md:grid-w33 xl:grid-w25" />
<img src="gallery/image2.jpeg" class="grid-w50 md:grid-w33 xl:grid-w25" />
<img src="gallery/featureCrossroads.jpg" class="grid-w50 md:grid-w33 xl:grid-w25" />
<img src="gallery/feature.JPG" class="grid-w50 md:grid-w33 xl:grid-w25" />
<img src="gallery/image0.jpeg" class="grid-w50 md:grid-w33 xl:grid-w25" />
<img src="gallery/ccclogopng.png" class="grid-w50 md:grid-w33 xl:grid-w25" />
<img src="gallery/CelebrateRecovery.png" class="grid-w50 md:grid-w33 xl:grid-w25" />
<img src="gallery/christmasdoor.JPG" class="grid-w50 md:grid-w33 xl:grid-w25" />
<img src="gallery/holidayclub23.JPG" class="grid-w50 md:grid-w33 xl:grid-w25" />
<img src="gallery/seniors.jpg" class="grid-w50 md:grid-w33 xl:grid-w25" />
<img src="gallery/weerascals.jpg" class="grid-w50 md:grid-w33 xl:grid-w25" />
<img src="gallery/ChurchBuilding.jpg" class="grid-w50 md:grid-w33 xl:grid-w25" />
<img src="gallery/cafe2.jpg" class="grid-w50 md:grid-w33 xl:grid-w25" />
<img src="gallery/cccherryblossoms3.jpg" class="grid-w50 md:grid-w33 xl:grid-w25" />
<img src="gallery/seniorslunchflyer.jpg" class="grid-w50 md:grid-w33 xl:grid-w25" />
<img src="gallery/teenscafe.JPG" class="grid-w50 md:grid-w33 xl:grid-w25" />
<img src="gallery/impactclub.jpg" class="grid-w50 md:grid-w33 xl:grid-w25" />
<img src="gallery/ccc@cc.webp" class="grid-w50 md:grid-w33 xl:grid-w25" />
<img src="gallery/featurecarolservice2.jpg" class="grid-w50 md:grid-w33 xl:grid-w25" />
<img src="gallery/seniorslunch.jpg" class="grid-w50 md:grid-w33 xl:grid-w25" />
<img src="gallery/GoodFriday.png" class="grid-w50 md:grid-w33 xl:grid-w25" />
<img src="gallery/featureholidayclub2023.jpeg" class="grid-w50 md:grid-w33 xl:grid-w25" />
<img src="gallery/rascals1.JPG" class="grid-w50 md:grid-w33 xl:grid-w25" />
{{< /gallery >}}

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