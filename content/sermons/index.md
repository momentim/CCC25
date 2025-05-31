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


## Current Sermon Series
{{< youtube-playlist "PLZ7PZ5No1npHeF43QNrLn-x4-2Nh4B1h2" "reverse-chronological" >}}  <!-- Psalms -->
## Sermon Archive ordered by Book of the Bible
{{< youtube-playlist "PLZ7PZ5No1npGIAlX5N7bc9j0mo30VdMsN" "reverse-chronological" >}} <!-- Exodus -->
{{< youtube-playlist "PLZ7PZ5No1npHIaiRYAVi_feldm_ZHEnLh" "reverse-chronological" >}} <!-- Judges -->
{{< youtube-playlist "PLZ7PZ5No1npFxlUhzF-MrOOCnTCff1K7z" "reverse-chronological" >}} <!-- Ruth -->
{{< youtube-playlist "PLZ7PZ5No1npHeF43QNrLn-x4-2Nh4B1h2" "reverse-chronological" >}}  <!-- Psalms -->
{{< youtube-playlist "PLZ7PZ5No1npHiTWJwyro44LlU7nntV73U" "reverse-chronological" >}} <!-- Proverbs -->
{{< youtube-playlist "PLZ7PZ5No1npGSAe66B5NPQQ58Jx7sXC5J" "reverse-chronological" >}} <!-- Ecclesiastes -->
{{< youtube-playlist "PLZ7PZ5No1npH1kYINoIExstWl13VgVlHS" "reverse-chronological" >}} <!-- Ezekiel -->
{{< youtube-playlist "PLZ7PZ5No1npGhHOvUH2ySo5DkqhDe7FO6" "reverse-chronological" >}} <!-- Daniel -->
{{< youtube-playlist "PLZ7PZ5No1npGmX-wunCnIahjfKGyhvfso" "reverse-chronological" >}} <!-- Jonah -->
{{< youtube-playlist "PLZ7PZ5No1npFa1dmvuGNe4Swb6h4LivEB" "reverse-chronological" >}} <!-- Habakkuk -->
{{< youtube-playlist "PLZ7PZ5No1npFhnvj6IZ21zI9Rf8Vpc8SM" "reverse-chronological" >}} <!-- Matthew -->
{{< youtube-playlist "PLZ7PZ5No1npFe7HGiNZ9oS4ZLPpCrANLJ" "reverse-chronological" >}} <!-- Mark -->
{{< youtube-playlist "PLZ7PZ5No1npH_UcNcjYZyYcrYeeKQMIzK" "reverse-chronological" >}} <!-- Romans -->
{{< youtube-playlist "PLZ7PZ5No1npGMp6oUXeZn1pugg4qcAiJv" "reverse-chronological" >}} <!-- 1 Corinthians -->
{{< youtube-playlist "PLZ7PZ5No1npHmdxB3mPbn0wMZe1IPIToe" "reverse-chronological" >}} <!-- Philippians -->
{{< youtube-playlist "PLZ7PZ5No1npFp0v36v9t9F2LuLSyK8IBy" "reverse-chronological" >}} <!-- 1 Thessalonians -->
{{< youtube-playlist "PLZ7PZ5No1npGB7vy1x7vmMaE1qBwtf6vG" "reverse-chronological" >}} <!-- 2 Thessalonians -->
{{< youtube-playlist "PLZ7PZ5No1npHYAunrJi-JoaraunLiWqvI" "reverse-chronological" >}} <!-- Philemon -->
## Other Sermons
{{< youtube-playlist "PLZ7PZ5No1npE4gfeQX2U5APGn_Ng1NivT" "reverse-chronological" >}} <!-- Carol Service -->
{{< youtube-playlist "PLZ7PZ5No1npGmY31hKy0FIfP9igTIzfGk" "reverse-chronological" >}} <!-- Cross Crook and Crown -->
{{< youtube-playlist "PLZ7PZ5No1npFAxJtnHQGlukMRfRbuLw6-" "reverse-chronological" >}} <!-- Doctrine for the Scheme - Baptism -->
{{< youtube-playlist "PLZ7PZ5No1npHFRgOSKdX5y5EYFgsKx2qO" "reverse-chronological" >}} <!-- Hope in Hard Times -->
{{< youtube-playlist "PLZ7PZ5No1npH_d438fNhAeIHka7cBPf8c" "reverse-chronological" >}} <!-- Sermon on the Mount -->
{{< youtube-playlist "PLZ7PZ5No1npEp6L0VsZqL4B37Egfukdj9" "reverse-chronological" >}} <!-- Stand Alone -->


Stay up to date with all the latest Sermons on [Our Youtube Channel](https://www.youtube.com/channel/UC2SC7RXekX9eLkqmTsQy4SA).


<!--
Sermons from Matthew 26 - 28.
[![Matthew](Matthew26-28.jpg)](https://youtube.com/playlist?list=PLZ7PZ5No1npFhnvj6IZ21zI9Rf8Vpc8SM)

Sermons from the book of Psalms.
[![Psalms](psalm.jpg)](https://www.youtube.com/playlist?list=PLZ7PZ5No1npHeF43QNrLn-x4-2Nh4B1h2)

Sermons from the book of Romans.
[![Romans](romans.jpg)](https://www.youtube.com/playlist?list=PLZ7PZ5No1npH_UcNcjYZyYcrYeeKQMIzK)

Sermons from the book of Ezekiel.
[![Ezekiel](ezekiel.jpg)](https://youtube.com/playlist?list=PLZ7PZ5No1npH1kYINoIExstWl13VgVlHS)

Sermons from the book of Proverbs.
[![Proverbs](proverbs.jpg)](https://www.youtube.com/playlist?list=PLZ7PZ5No1npHiTWJwyro44LlU7nntV73U)

Sermons from the book of 1 Corinthians.
[![1Corinthians](1corinthians.PNG)](https://www.youtube.com/playlist?list=PLZ7PZ5No1npGMp6oUXeZn1pugg4qcAiJv)

Sermons from the book of Daniel.
[![Daniel](daniel.jpeg)](https://www.youtube.com/playlist?list=PLZ7PZ5No1npGhHOvUH2ySo5DkqhDe7FO6)

There are many other sermons and sermon series on [Our Youtube Channel](https://www.youtube.com/channel/UC2SC7RXekX9eLkqmTsQy4SA).  -->