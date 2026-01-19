// Function for test button (can remain global if desired)
function testScript() {
    alert('JavaScript is working!');
}

class YouTubePlaylistDisplay {
    constructor(containerElement) {
        this.container = containerElement;
        this.apiKey = this.container.dataset.apiKey;
        this.playlistId = this.container.dataset.playlistId;
        this.isReversed = this.container.dataset.order === 'chronological';
        
        this.videos = [];
        this.isExpanded = false;
        this.newestVideo = null;
        this.loadedVideos = new Set();

        if (!this.container) {
            return;
        }
    }
    
    async init() {
        try {
            await this.fetchPlaylistData();
        } catch (error) {
            this.renderError(error.message);
        }
    }

    async fetchPlaylistData() {
        try {
            const testUrl = `https://www.googleapis.com/youtube/v3/playlists?part=snippet&id=${this.playlistId}&key=${this.apiKey}`;
            const response = await fetch(testUrl);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            const data = await response.json();
            if (data.error) {
                throw new Error(`API Error: ${data.error.message} (${data.error.code})`);
            }
            if (!data.items || data.items.length === 0) {
                throw new Error('Playlist not found or empty');
            }
            const playlist = data.items[0];
            await this.fetchVideos(playlist);
        } catch (error) {
            throw error;
        }
    }
    
    async fetchVideos(playlist) {
        let allVideos = [];
        let nextPageToken = '';
        let pageCount = 0;
        do {
            pageCount++;
            const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&playlistId=${this.playlistId}&maxResults=50&pageToken=${nextPageToken}&key=${this.apiKey}`;
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Failed to fetch videos page ${pageCount}: ${response.status}`);
            }
            const data = await response.json();
            if (data.error) {
                throw new Error(`API Error on page ${pageCount}: ${data.error.message}`);
            }
            allVideos = allVideos.concat(data.items || []);
            nextPageToken = data.nextPageToken || '';
        } while (nextPageToken && pageCount < 10);
        
        // Filter out private/deleted videos
        const validVideos = allVideos.filter(item => 
            item.snippet.title !== "Private video" && 
            item.snippet.title !== "Deleted video" &&
            item.snippet.resourceId?.videoId
        );
        
        // Get actual upload dates by fetching video details
        await this.enrichVideosWithUploadDates(validVideos);
        
        this.videos = validVideos;
        
        if (this.videos.length > 0) {
            // Find newest video based on actual upload date
            this.newestVideo = this.videos.reduce((newest, current) => {
                const newestDate = new Date(newest.actualPublishDate || newest.snippet.publishedAt);
                const currentDate = new Date(current.actualPublishDate || current.snippet.publishedAt);
                return currentDate > newestDate ? current : newest;
            });
        }
        
        await this.renderPlaylist(playlist);
    }

    async enrichVideosWithUploadDates(videos) {
        // Extract video IDs
        const videoIds = videos
            .map(video => video.snippet.resourceId?.videoId)
            .filter(id => id);
        
        if (videoIds.length === 0) return;
        
        // Batch fetch video details (YouTube API allows up to 50 IDs per request)
        const batchSize = 50;
        for (let i = 0; i < videoIds.length; i += batchSize) {
            const batchIds = videoIds.slice(i, i + batchSize);
            const idsParam = batchIds.join(',');
            
            try {
                const videoDetailsUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet,liveStreamingDetails&id=${idsParam}&key=${this.apiKey}`;
                const response = await fetch(videoDetailsUrl);
                
                if (response.ok) {
                    const videoData = await response.json();
                    
                    // Map the detailed video info back to our playlist items
                    videoData.items?.forEach(videoDetail => {
                        const playlistVideo = videos.find(v => 
                            v.snippet.resourceId?.videoId === videoDetail.id
                        );
                        
                        if (playlistVideo) {
                            // Use actualStartTime for live streams, otherwise use video's publishedAt
                            // The video's publishedAt is more reliable than playlist item's publishedAt
                            playlistVideo.actualPublishDate = 
                                videoDetail.liveStreamingDetails?.actualStartTime || 
                                videoDetail.snippet.publishedAt;
                            
                            // Store whether this was a live stream
                            playlistVideo.isLiveStream = !!videoDetail.liveStreamingDetails?.actualStartTime;
                        }
                    });
                }
            } catch (error) {
                console.warn('Failed to fetch video details for batch:', error);
                // Continue with playlist publishedAt dates as fallback
            }
        }
    }

    async getDominantColor(imageUrl) {
        return new Promise((resolve) => {
            const img = new Image();
            img.crossOrigin = 'Anonymous';
            img.onload = () => {
                try {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    canvas.width = img.width;
                    canvas.height = img.height;
                    ctx.drawImage(img, 0, 0);
                    
                    let r = 0, g = 0, b = 0;
                    const sampleSize = 10;
                    let count = 0;
                    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                    const data = imageData.data;
                    
                    for (let i = 0; i < data.length; i += 4 * sampleSize) {
                        r += data[i];
                        g += data[i + 1];
                        b += data[i + 2];
                        count++;
                    }
                    
                    r = Math.floor(r / count);
                    g = Math.floor(g / count);
                    b = Math.floor(b / count);
                    
                    const lightness = 0.8; 
                    r = Math.floor(r + (255 - r) * lightness);
                    g = Math.floor(g + (255 - g) * lightness);
                    b = Math.floor(b + (255 - b) * lightness);
                    
                    resolve(`rgb(${r}, ${g}, ${b})`);
                } catch (e) {
                    resolve('#f8f9fa');
                }
            };
            img.onerror = () => resolve('#f8f9fa');
            img.src = imageUrl;
        });
    }

    async renderPlaylist(playlist) {
        // Sort videos by actual publish date
        const sortedVideos = [...this.videos].sort((a, b) => {
            const dateA = new Date(a.actualPublishDate || a.snippet.publishedAt);
            const dateB = new Date(b.actualPublishDate || b.snippet.publishedAt);
            return this.isReversed ? dateB - dateA : dateA - dateB;
        });
        
        const newestVideoThumbnail = this.newestVideo ? 
            this.newestVideo.snippet.thumbnails.medium?.url || this.newestVideo.snippet.thumbnails.default?.url :
            '';
        const newestVideoDate = this.newestVideo ? 
            (this.newestVideo.actualPublishDate || this.newestVideo.snippet.publishedAt) : 
            playlist.snippet.publishedAt;
        
        let dominantColor = '#f8f9fa';
        if (newestVideoThumbnail) {
            try {
                dominantColor = await this.getDominantColor(newestVideoThumbnail);
            } catch (e) {
                // Use default color if extraction fails
            }
        }
        
        this.container.innerHTML = `
            <div class="playlist-container">
                <div class="playlist-header collapsed" style="background-color: ${dominantColor};" data-playlist-id="${this.container.id}">
                    ${newestVideoThumbnail ? `<img src="${newestVideoThumbnail}" alt="Latest video thumbnail" class="playlist-thumbnail">` : ''}
                    <h1 class="playlist-title">${playlist.snippet.title}</h1>
                    <div class="playlist-info">
                        ${this.videos.length} videos • Latest: ${this.formatDate(newestVideoDate)}
                    </div>
                    <div class="expand-hint">
                        Click to view videos
                    </div>
                </div>
                <div class="controls">
                    <button class="sort-button" data-playlist-id="${this.container.id}">
                        Sort by: ${this.isReversed ? 'Oldest First' : 'Newest First'}
                    </button>
                </div>
                <div class="videos-container" data-playlist-id="${this.container.id}">
                    ${sortedVideos.map((video, index) => this.renderVideoItem(video, index)).join('')}
                </div>
                <div class="close-footer" data-playlist-id="${this.container.id}">
                    Click to hide videos
                </div>
            </div>
        `;
        
        // Store sorted videos for consistent indexing
        this.sortedVideos = sortedVideos;
        
        this.addEventListeners();
    }
    
    addEventListeners() {
        const header = this.container.querySelector('.playlist-header');
        if (header) {
            header.onclick = null;
            header.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.toggleExpand();
                return false;
            };
        }

        const closeFooter = this.container.querySelector('.close-footer');
        if (closeFooter) {
            closeFooter.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.toggleExpand();
                return false;
            };
        }

        const sortButton = this.container.querySelector('.sort-button');
        if (sortButton) {
            sortButton.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.toggleSort();
                return false;
            };
        }

        const videosContainer = this.container.querySelector('.videos-container');
        if (videosContainer) {
            const videoHeaders = videosContainer.querySelectorAll('.video-header');
            
            videoHeaders.forEach((header, index) => {
                header.onclick = (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    this.toggleVideo(index);
                    return false;
                };
            });
        }
    }

    toggleExpand() {
        this.isExpanded = !this.isExpanded;
        const header = this.container.querySelector('.playlist-header');
        const controls = this.container.querySelector('.controls');
        const videosContainer = this.container.querySelector('.videos-container');
        const expandHint = this.container.querySelector('.expand-hint');
        const closeFooter = this.container.querySelector('.close-footer');
        
        if (this.isExpanded) {
            header.classList.remove('collapsed');
            controls.classList.add('visible');
            videosContainer.classList.add('visible');
            closeFooter.classList.add('visible');
            expandHint.innerHTML = 'Click to hide videos';
        } else {
            header.classList.add('collapsed');
            controls.classList.remove('visible');
            videosContainer.classList.remove('visible');
            closeFooter.classList.remove('visible');
            expandHint.innerHTML = 'Click to view videos';
            
            this.container.querySelectorAll('.video-content.visible').forEach(vc => vc.classList.remove('visible'));
            this.container.querySelectorAll('.video-header.active').forEach(vh => vh.classList.remove('active'));
        }
    }

    renderVideoItem(video, index) {
        const snippet = video.snippet;
        const videoId = snippet.resourceId?.videoId;
        const description = this.truncateDescription(snippet.description, 2);
        const publishDate = video.actualPublishDate || snippet.publishedAt;
        const streamLabel = video.isLiveStream ? ' (Live Stream)' : '';
        
        return `
            <div class="video-item">
                <div class="video-header" data-video-index="${index}" data-playlist-id="${this.container.id}">
                    <h3 class="video-title">
                        ${snippet.title}${streamLabel}
                    </h3>
                    <p class="video-preview">${description}</p>
                    <div class="video-meta">
                        Published: ${this.formatDate(publishDate)}
                    </div>
                </div>
                <div class="video-content" data-video-index="${index}">
                    <div class="video-container">
                    </div>
                </div>
            </div>
        `;
    }

    toggleVideo(index) {
        const videoItem = this.container.querySelector(`.video-item:nth-child(${index + 1})`);
        if (!videoItem) {
            return;
        }

        const header = videoItem.querySelector('.video-header');
        const content = videoItem.querySelector('.video-content');
        const videoPlayerContainer = videoItem.querySelector('.video-container');
        
        const isCurrentlyOpen = content.classList.contains('visible');
        
        this.container.querySelectorAll('.video-content').forEach(vc => vc.classList.remove('visible'));
        this.container.querySelectorAll('.video-header').forEach(vh => vh.classList.remove('active'));
        
        if (!isCurrentlyOpen) {
            content.classList.add('visible');
            header.classList.add('active');
            
            if (!this.loadedVideos.has(index)) {
                this.loadVideo(index, videoPlayerContainer);
                this.loadedVideos.add(index);
            }
        }
    }

    loadVideo(index, container) {
        const video = this.sortedVideos[index];
        const videoId = video.snippet.resourceId?.videoId || video.contentDetails?.videoId;
        
        if (!videoId) {
            container.innerHTML = '<p style="color: red;">Video not available.</p>';
            return;
        }

        container.innerHTML = `
            <iframe src="https://www.youtube.com/embed/${videoId}" 
                    title="${video.snippet.title}"
                    frameborder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowfullscreen>
            </iframe>
        `;
    }

    getFullDescription(description) {
        if (!description) return 'No description available.';
        
        let cutoffIndex = description.indexOf('https://charleston-church.com');
        if (cutoffIndex === -1) {
            cutoffIndex = description.indexOf('http://charleston-church.com');
        }
        
        let fullText = description;
        if (cutoffIndex !== -1) {
            fullText = description.substring(0, cutoffIndex).trim();
        }
        
        return fullText.replace(/\n/g, '<br>') || 'No description available.';
    }

    truncateDescription(description, lines = 2) {
        if (!description) return 'No description available.';
        
        let cutoffIndex = description.indexOf('https://charleston-church.com');
        if (cutoffIndex === -1) {
            cutoffIndex = description.indexOf('http://charleston-church.com');
        }
        
        let introText = description;
        if (cutoffIndex !== -1) {
            introText = description.substring(0, cutoffIndex).trim();
        }
        
        const cleanLines = introText.split(/\r?\n/).map(l => l.trim()).filter(l => l);
        const cleanDescription = cleanLines.join(' ');
        
        const words = cleanDescription.split(' ');
        const maxWords = lines * 15;
        
        return words.length > maxWords ? words.slice(0, maxWords).join(' ') + '...' : cleanDescription || 'No description available.';
    }

    formatDate(dateString) {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    toggleSort() {
        this.isReversed = !this.isReversed;
        const videosContainer = this.container.querySelector('.videos-container');
        const sortButton = this.container.querySelector('.sort-button');
        
        this.loadedVideos.clear();
        
        // Re-sort videos with new order
        const sortedVideos = [...this.videos].sort((a, b) => {
            const dateA = new Date(a.actualPublishDate || a.snippet.publishedAt);
            const dateB = new Date(b.actualPublishDate || b.snippet.publishedAt);
            return this.isReversed ? dateB - dateA : dateA - dateB;
        });
        
        this.sortedVideos = sortedVideos;
        
        videosContainer.innerHTML = sortedVideos.map((video, index) => this.renderVideoItem(video, index)).join('');
        sortButton.textContent = `Sort by: ${this.isReversed ? 'Oldest First' : 'Newest First'}`;
        
        const videoHeaders = videosContainer.querySelectorAll('.video-header');
        videoHeaders.forEach((header, index) => {
            header.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.toggleVideo(index);
                return false;
            };
        });
    }

    renderError(message) {
        this.container.innerHTML = `
            <div class="error">
                <h3>Error Loading Playlist</h3>
                <p>${message}</p>
                <div class="debug-info">
                    Playlist ID: ${this.playlistId}
                    Container: ${this.container?.id}
                    Time: ${new Date().toISOString()}
                </div>
            </div>
        `;
    }
}

// === Centralized Initialization Logic ===
document.addEventListener('DOMContentLoaded', () => {
    const playlistRoots = document.querySelectorAll('.youtube-playlist-root');
    
    playlistRoots.forEach((container, index) => {
        const instance = new YouTubePlaylistDisplay(container);
        instance.init().catch(error => {
            console.error(`Failed to initialize playlist ${container.id}:`, error);
        });
    });
});