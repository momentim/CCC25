---
title: "Daily Bible Reading"
date: 2025-05-04
summary: "Stay in the word by following along with our daily bible readings.  This collection of readings help you prepare your heart for each Sunday's sermon and worship."
showBreadCrumbs: false
---

<script>
  fetch('../../verse-of-day/verse-of-the-day.html')
    .then(response => response.text())
    .then(html => {
      document.getElementById('verse-of-the-day').innerHTML = html;
    });
</script>
<div id="verse-of-the-day"></div>
<br>



## Operation World Daily Prayer Notes

<div class="ow-web-widget" style="height: 800px; width: 100%;"></div>

<script>
(function() {
    var s = document.createElement('script');
    s.src = 'https://widget.operationworld.org/js/widget.js';
    s.async = true;
    document.body.appendChild(s);
}());
</script>

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