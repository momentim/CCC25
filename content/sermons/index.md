---
title: "Sermons"
description: "We invite you to join us in experiencing the life-transforming power of God's Word through our church sermons!"
featured_image: '/images/Preaching.jpg'
showEdit: false
showSummary: false
hideFeatureImage: false
showAuthor: false
showReadingTime: false
showWordCount: false
showDate: false
showPagination: false
---

We invite you to join us in experiencing the life-transforming power of God's Word through our church sermons archive! And you are always welcome to worship with us in person every Sunday at 10:30 in the [Charleston Community Centre](../contact/#charleston-community-centre)

## Here is the latest sermon from our channel
<style>
  .video-container {
    position: relative;
    padding-bottom: 56.25%; /* 16:9 ratio */
    height: 0;
    overflow: hidden;
    max-width: 100%;
  }

  .video-container iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
</style>

<script>
const YOUTUBE_API_KEY = 'AIzaSyBW-apJdxy7gSPuDaOUdhy6MmboIxhmBHw';
const CHANNEL_ID = 'UC2SC7RXekX9eLkqmTsQy4SA';

async function fetchLatestSermon() {
  const res = await fetch(`https://www.googleapis.com/youtube/v3/search?key=${YOUTUBE_API_KEY}&channelId=${CHANNEL_ID}&order=date&maxResults=1&part=snippet`);
  const data = await res.json();
  const video = data.items[0];

  const videoId = video.id.videoId || video.id; // fallback if ID is a string
  const description = video.snippet.description;
  const cutoffIndex = description.indexOf('https://charleston-church.com');

  // Get all text before the church website
  let introText = description;
  if (cutoffIndex !== -1) {
    introText = description.substring(0, cutoffIndex).trim();
  }

  // Break into clean, non-empty lines
  const cleanLines = introText.split(/\r?\n/).map(l => l.trim()).filter(l => l);

  // Display all lines
  const sermonText = cleanLines.map(line => `<p>${line}</p>`).join('');

  // Display the video
  document.getElementById('sermon-video').innerHTML = `
    <div class="video-container">
      <iframe src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe>
    </div>
  `;

  // Display the intro text
  document.getElementById('sermon-description').innerHTML = sermonText;
}

fetchLatestSermon();
</script>

<div id="sermon-video"></div>
<div id="sermon-description" style="margin-top: 1rem;"></div>

{{< youtubeplaylist playlistId="PLZ7PZ5No1npHeF43QNrLn-x4-2Nh4B1h2" apiKey="AIzaSyBW-apJdxy7gSPuDaOUdhy6MmboIxhmBHw" order="chronological" >}}

{{< youtubeplaylist playlistId="PLZ7PZ5No1npHiTWJwyro44LlU7nntV73U" apiKey="AIzaSyBW-apJdxy7gSPuDaOUdhy6MmboIxhmBHw" order="chronological" >}}




