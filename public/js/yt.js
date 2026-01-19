<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>YouTube Data Fetcher</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f5f5f5;
        }
        .container {
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        h1 {
            color: #333;
            text-align: center;
            margin-bottom: 30px;
        }
        .status {
            padding: 15px;
            border-radius: 5px;
            margin: 20px 0;
            font-weight: bold;
        }
        .success { background-color: #d4edda; color: #155724; border: 1px solid #c3e6cb; }
        .error { background-color: #f8d7da; color: #721c24; border: 1px solid #f5c6cb; }
        .warning { background-color: #fff3cd; color: #856404; border: 1px solid #ffeaa7; }
        .info { background-color: #d1ecf1; color: #0c5460; border: 1px solid #bee5eb; }
        
        button {
            background-color: #007bff;
            color: white;
            border: none;
            padding: 12px 24px;
            font-size: 16px;
            border-radius: 5px;
            cursor: pointer;
            margin: 10px 0;
        }
        button:hover { background-color: #0056b3; }
        button:disabled { background-color: #ccc; cursor: not-allowed; }
        
        .config-section {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 5px;
            margin: 20px 0;
        }
        .config-section h3 {
            margin-top: 0;
            color: #495057;
        }
        input[type="text"] {
            width: 100%;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 14px;
            margin: 5px 0;
        }
        
        .results {
            margin-top: 30px;
        }
        .video-item {
            background: #f8f9fa;
            padding: 15px;
            margin: 10px 0;
            border-radius: 5px;
            border-left: 4px solid #007bff;
        }
        .video-title {
            font-weight: bold;
            color: #333;
            margin-bottom: 5px;
        }
        .video-meta {
            color: #666;
            font-size: 14px;
        }
        .playlist-badge {
            background: #e9ecef;
            padding: 3px 8px;
            border-radius: 3px;
            font-size: 12px;
            margin-right: 10px;
        }
        .category-badge {
            padding: 3px 8px;
            border-radius: 3px;
            font-size: 12px;
            color: white;
            margin-right: 10px;
        }
        .old-testament { background-color: #28a745; }
        .new-testament { background-color: #17a2b8; }
        .other-series { background-color: #6c757d; }
        
        .summary {
            background: #e9ecef;
            padding: 20px;
            border-radius: 5px;
            margin: 20px 0;
        }
        .summary h3 {
            margin-top: 0;
            color: #495057;
        }
        .summary-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
        }
        .summary-item {
            background: white;
            padding: 15px;
            border-radius: 5px;
            text-align: center;
        }
        .summary-number {
            font-size: 24px;
            font-weight: bold;
            color: #007bff;
        }
        .summary-label {
            color: #666;
            font-size: 14px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🎥 YouTube Data Fetcher</h1>
        
        <div class="config-section">
            <h3>Configuration</h3>
            <label for="apiKey">YouTube API Key:</label>
            <input type="text" id="apiKey" placeholder="Enter your YouTube API Key">
            
            <label for="channelId">Channel ID:</label>
            <input type="text" id="channelId" placeholder="Enter your YouTube Channel ID">
            
            <button onclick="fetchYouTubeData()">🚀 Fetch Data</button>
        </div>
        
        <div id="status"></div>
        <div id="summary"></div>
        <div id="results"></div>
    </div>

    <script>
        // Biblical book order mapping
        const BIBLICAL_BOOK_ORDER = {
            // Old Testament
            'Genesis': { order: 1, testament: 'Old Testament' },
            'Exodus': { order: 2, testament: 'Old Testament' },
            'Leviticus': { order: 3, testament: 'Old Testament' },
            'Numbers': { order: 4, testament: 'Old Testament' },
            'Deuteronomy': { order: 5, testament: 'Old Testament' },
            'Joshua': { order: 6, testament: 'Old Testament' },
            'Judges': { order: 7, testament: 'Old Testament' },
            'Ruth': { order: 8, testament: 'Old Testament' },
            '1 Samuel': { order: 9, testament: 'Old Testament' },
            '2 Samuel': { order: 10, testament: 'Old Testament' },
            '1 Kings': { order: 11, testament: 'Old Testament' },
            '2 Kings': { order: 12, testament: 'Old Testament' },
            '1 Chronicles': { order: 13, testament: 'Old Testament' },
            '2 Chronicles': { order: 14, testament: 'Old Testament' },
            'Ezra': { order: 15, testament: 'Old Testament' },
            'Nehemiah': { order: 16, testament: 'Old Testament' },
            'Esther': { order: 17, testament: 'Old Testament' },
            'Job': { order: 18, testament: 'Old Testament' },
            'Psalms': { order: 19, testament: 'Old Testament' },
            'Proverbs': { order: 20, testament: 'Old Testament' },
            'Ecclesiastes': { order: 21, testament: 'Old Testament' },
            'Song of Songs': { order: 22, testament: 'Old Testament' },
            'Isaiah': { order: 23, testament: 'Old Testament' },
            'Jeremiah': { order: 24, testament: 'Old Testament' },
            'Lamentations': { order: 25, testament: 'Old Testament' },
            'Ezekiel': { order: 26, testament: 'Old Testament' },
            'Daniel': { order: 27, testament: 'Old Testament' },
            'Hosea': { order: 28, testament: 'Old Testament' },
            'Joel': { order: 29, testament: 'Old Testament' },
            'Amos': { order: 30, testament: 'Old Testament' },
            'Obadiah': { order: 31, testament: 'Old Testament' },
            'Jonah': { order: 32, testament: 'Old Testament' },
            'Micah': { order: 33, testament: 'Old Testament' },
            'Nahum': { order: 34, testament: 'Old Testament' },
            'Habakkuk': { order: 35, testament: 'Old Testament' },
            'Zephaniah': { order: 36, testament: 'Old Testament' },
            'Haggai': { order: 37, testament: 'Old Testament' },
            'Zechariah': { order: 38, testament: 'Old Testament' },
            'Malachi': { order: 39, testament: 'Old Testament' },
            
            // New Testament
            'Matthew': { order: 40, testament: 'New Testament' },
            'Mark': { order: 41, testament: 'New Testament' },
            'Luke': { order: 42, testament: 'New Testament' },
            'John': { order: 43, testament: 'New Testament' },
            'Acts': { order: 44, testament: 'New Testament' },
            'Romans': { order: 45, testament: 'New Testament' },
            '1 Corinthians': { order: 46, testament: 'New Testament' },
            '2 Corinthians': { order: 47, testament: 'New Testament' },
            'Galatians': { order: 48, testament: 'New Testament' },
            'Ephesians': { order: 49, testament: 'New Testament' },
            'Philippians': { order: 50, testament: 'New Testament' },
            'Colossians': { order: 51, testament: 'New Testament' },
            '1 Thessalonians': { order: 52, testament: 'New Testament' },
            '2 Thessalonians': { order: 53, testament: 'New Testament' },
            '1 Timothy': { order: 54, testament: 'New Testament' },
            '2 Timothy': { order: 55, testament: 'New Testament' },
            'Titus': { order: 56, testament: 'New Testament' },
            'Philemon': { order: 57, testament: 'New Testament' },
            'Hebrews': { order: 58, testament: 'New Testament' },
            'James': { order: 59, testament: 'New Testament' },
            '1 Peter': { order: 60, testament: 'New Testament' },
            '2 Peter': { order: 61, testament: 'New Testament' },
            '1 John': { order: 62, testament: 'New Testament' },
            '2 John': { order: 63, testament: 'New Testament' },
            '3 John': { order: 64, testament: 'New Testament' },
            'Jude': { order: 65, testament: 'New Testament' },
            'Revelation': { order: 66, testament: 'New Testament' }
        };

        let allVideos = [];

        function showStatus(message, type = 'info') {
            const statusDiv = document.getElementById('status');
            statusDiv.innerHTML = `<div class="status ${type}">${message}</div>`;
        }

        function identifyBiblicalBook(title) {
            for (const [book, info] of Object.entries(BIBLICAL_BOOK_ORDER)) {
                if (title.toLowerCase().includes(book.toLowerCase())) {
                    return info;
                }
            }
            return null;
        }

        function cleanDescription(description) {
            if (!description) return '';
            
            const cutoffText = 'http://charleston-church.com';
            const cutoffIndex = description.indexOf(cutoffText);
            
            if (cutoffIndex !== -1) {
                return description.substring(0, cutoffIndex).trim();
            }
            
            return description.trim();
        }

        async function makeYouTubeRequest(endpoint, params, apiKey) {
            const url = new URL(`https://www.googleapis.com/youtube/v3${endpoint}`);
            url.searchParams.set('key', apiKey);
            
            for (const [key, value] of Object.entries(params)) {
                url.searchParams.set(key, value);
            }

            const response = await fetch(url);
            const data = await response.json();
            
            if (data.error) {
                throw new Error(`YouTube API Error: ${data.error.message}`);
            }
            
            return data;
        }

        async function testConnection(apiKey) {
            showStatus('🔍 Testing YouTube API connection...', 'info');
            
            try {
                await makeYouTubeRequest('/search', {
                    part: 'snippet',
                    type: 'channel',
                    q: 'test',
                    maxResults: 1
                }, apiKey);
                
                showStatus('✅ YouTube API connection successful!', 'success');
                return true;
            } catch (error) {
                showStatus(`❌ API connection failed: ${error.message}`, 'error');
                throw error;
            }
        }

        async function getChannelPlaylists(channelId, apiKey) {
            showStatus('📋 Fetching channel playlists...', 'info');
            
            const playlists = [];
            let nextPageToken = null;

            do {
                const params = {
                    part: 'snippet,contentDetails',
                    channelId: channelId,
                    maxResults: 50
                };

                if (nextPageToken) {
                    params.pageToken = nextPageToken;
                }

                const response = await makeYouTubeRequest('/playlists', params, apiKey);
                playlists.push(...response.items);
                nextPageToken = response.nextPageToken;
                
            } while (nextPageToken);

            showStatus(`📋 Found ${playlists.length} playlists`, 'info');
            return playlists;
        }

        async function getPlaylistVideos(playlistId, playlistTitle, category, apiKey) {
            const oneMonthAgo = new Date();
            oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
            
            const videos = [];
            let nextPageToken = null;

            do {
                const params = {
                    part: 'snippet',
                    playlistId: playlistId,
                    maxResults: 50
                };

                if (nextPageToken) {
                    params.pageToken = nextPageToken;
                }

                const response = await makeYouTubeRequest('/playlistItems', params, apiKey);
                
                for (const item of response.items) {
                    const publishedDate = new Date(item.snippet.publishedAt);
                    
                    // Only include videos from the last month
                    if (publishedDate >= oneMonthAgo) {
                        videos.push({
                            playlist: playlistTitle,
                            category: category,
                            title: item.snippet.title,
                            datePublished: item.snippet.publishedAt,
                            description: cleanDescription(item.snippet.description),
                            videoId: item.snippet.resourceId.videoId,
                            fullUrl: `https://www.youtube.com/watch?v=${item.snippet.resourceId.videoId}`,
                            imageUrl: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.default?.url || '',
                            lastUpdated: new Date().toLocaleString('en-GB', { 
                                day: '2-digit', 
                                month: '2-digit', 
                                year: 'numeric', 
                                hour: '2-digit', 
                                minute: '2-digit',
                                hour12: false 
                            })
                        });
                    }
                }

                nextPageToken = response.nextPageToken;
                
            } while (nextPageToken);

            return videos;
        }

        function displaySummary(videos) {
            const categoryCounts = videos.reduce((acc, video) => {
                acc[video.category] = (acc[video.category] || 0) + 1;
                return acc;
            }, {});

            const summaryHtml = `
                <div class="summary">
                    <h3>📊 Summary</h3>
                    <div class="summary-grid">
                        <div class="summary-item">
                            <div class="summary-number">${videos.length}</div>
                            <div class="summary-label">Total Videos</div>
                        </div>
                        <div class="summary-item">
                            <div class="summary-number">${categoryCounts['Old Testament'] || 0}</div>
                            <div class="summary-label">Old Testament</div>
                        </div>
                        <div class="summary-item">
                            <div class="summary-number">${categoryCounts['New Testament'] || 0}</div>
                            <div class="summary-label">New Testament</div>
                        </div>
                        <div class="summary-item">
                            <div class="summary-number">${categoryCounts['Other Series'] || 0}</div>
                            <div class="summary-label">Other Series</div>
                        </div>
                    </div>
                </div>
            `;

            document.getElementById('summary').innerHTML = summaryHtml;
        }

        function displayVideos(videos) {
            const resultsDiv = document.getElementById('results');
            
            if (videos.length === 0) {
                resultsDiv.innerHTML = '<div class="status warning">No videos found from the last month.</div>';
                return;
            }

            // Sort videos by date (newest first)
            const sortedVideos = videos.sort((a, b) => new Date(b.datePublished) - new Date(a.datePublished));

            const videosHtml = sortedVideos.map(video => {
                const date = new Date(video.datePublished);
                const formattedDate = date.toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: '2-digit', 
                    year: 'numeric'
                });

                const categoryClass = video.category.toLowerCase().replace(/ /g, '-');

                return `
                    <div class="video-item">
                        <div class="video-title">${video.title}</div>
                        <div class="video-meta">
                            <span class="playlist-badge">📋 ${video.playlist}</span>
                            <span class="category-badge ${categoryClass}">${video.category}</span>
                        </div>
                        <div class="video-meta" style="margin-top: 8px;">
                            <strong>📅 Published:</strong> ${formattedDate}
                        </div>
                        <div class="video-meta">
                            <strong>🎬 Video ID:</strong> ${video.videoId}
                        </div>
                        <div class="video-meta">
                            <strong>🔗 URL:</strong> <a href="${video.fullUrl}" target="_blank">${video.fullUrl}</a>
                        </div>
                    </div>
                `;
            }).join('');

            resultsDiv.innerHTML = `
                <div class="results">
                    <h3>📹 Videos from Last Month</h3>
                    ${videosHtml}
                </div>
            `;
        }

        async function fetchYouTubeData() {
            const apiKey = document.getElementById('apiKey').value.trim();
            const channelId = document.getElementById('channelId').value.trim();

            if (!apiKey) {
                showStatus('❌ Please enter your YouTube API Key', 'error');
                return;
            }

            if (!channelId) {
                showStatus('❌ Please enter your Channel ID', 'error');
                return;
            }

            // Clear previous results
            document.getElementById('results').innerHTML = '';
            document.getElementById('summary').innerHTML = '';
            allVideos = [];

            try {
                // Test connection
                await testConnection(apiKey);
                
                // Get playlists
                const playlists = await getChannelPlaylists(channelId, apiKey);
                
                showStatus('🎥 Processing playlists and fetching videos...', 'info');
                
                // Process each playlist
                for (const playlist of playlists) {
                    const biblicalInfo = identifyBiblicalBook(playlist.snippet.title);
                    let category;

                    if (biblicalInfo) {
                        category = biblicalInfo.testament;
                    } else {
                        category = 'Other Series';
                    }

                    // Get videos from this playlist
                    const playlistVideos = await getPlaylistVideos(
                        playlist.id, 
                        playlist.snippet.title, 
                        category,
                        apiKey
                    );
                    
                    allVideos.push(...playlistVideos);
                    
                    // Small delay to avoid rate limiting
                    await new Promise(resolve => setTimeout(resolve, 100));
                }

                // Display results
                displaySummary(allVideos);
                displayVideos(allVideos);
                
                showStatus(`✅ Successfully processed ${allVideos.length} videos from the last month!`, 'success');

            } catch (error) {
                showStatus(`❌ Error: ${error.message}`, 'error');
                console.error('Detailed error:', error);
            }
        }

        // Auto-populate from environment variables if available (for Netlify)
        window.addEventListener('load', () => {
            // This won't work in regular browsers, but will work in Netlify if you set up environment variables
            if (typeof process !== 'undefined' && process.env) {
                if (process.env.YOUTUBE_API_KEY) {
                    document.getElementById('apiKey').value = process.env.YOUTUBE_API_KEY;
                }
            }
        });
    </script>
</body>
</html>