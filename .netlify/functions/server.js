// server.js - YouTube Proxy Server with GitHub Integration
const express = require('express');
const fetch = require('node-fetch');
const fs = require('fs').promises;
const path = require('path');
const { Octokit } = require('@octokit/rest');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Configuration
const CONFIG = {
    YOUTUBE_API_KEY: process.env.YOUTUBE_API_KEY,
    YOUTUBE_CHANNEL_ID: process.env.YOUTUBE_CHANNEL_ID,
    GITHUB_TOKEN: process.env.GITHUB_TOKEN,
    GITHUB_OWNER: process.env.MOMENTIM, // Your GitHub username
    GITHUB_REPO: process.env.CCC25,   // Your repository name
    DATA_FILE_PATH: 'data/videos.json',     // Path in your repo where data will be stored
    CSV_FILE_PATH: 'data/videos.csv'        // Alternative CSV format
};

// Initialize GitHub client
const octokit = new Octokit({
    auth: CONFIG.GITHUB_TOKEN
});

// Biblical book order mapping (same as before)
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

// Utility functions
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

// YouTube API functions
async function makeYouTubeRequest(endpoint, params) {
    const url = new URL(`https://www.googleapis.com/youtube/v3${endpoint}`);
    url.searchParams.set('key', CONFIG.YOUTUBE_API_KEY);
    
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

async function getChannelPlaylists() {
    const playlists = [];
    let nextPageToken = null;

    do {
        const params = {
            part: 'snippet,contentDetails',
            channelId: CONFIG.YOUTUBE_CHANNEL_ID,
            maxResults: 50
        };

        if (nextPageToken) {
            params.pageToken = nextPageToken;
        }

        const response = await makeYouTubeRequest('/playlists', params);
        playlists.push(...response.items);
        nextPageToken = response.nextPageToken;
        
    } while (nextPageToken);

    return playlists;
}

async function getPlaylistVideos(playlistId, playlistTitle, category) {
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

        const response = await makeYouTubeRequest('/playlistItems', params);
        
        for (const item of response.items) {
            videos.push({
                playlist: playlistTitle,
                category: category,
                title: item.snippet.title,
                datePublished: item.snippet.publishedAt,
                description: cleanDescription(item.snippet.description),
                videoId: item.snippet.resourceId.videoId,
                fullUrl: `https://www.youtube.com/watch?v=${item.snippet.resourceId.videoId}`,
                imageUrl: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.default?.url || '',
                lastUpdated: new Date().toISOString()
            });
        }

        nextPageToken = response.nextPageToken;
        
    } while (nextPageToken);

    return videos;
}

// GitHub functions
async function getExistingData() {
    try {
        const { data } = await octokit.rest.repos.getContent({
            owner: CONFIG.GITHUB_OWNER,
            repo: CONFIG.GITHUB_REPO,
            path: CONFIG.DATA_FILE_PATH
        });
        
        const content = Buffer.from(data.content, 'base64').toString('utf-8');
        return {
            data: JSON.parse(content),
            sha: data.sha
        };
    } catch (error) {
        if (error.status === 404) {
            // File doesn't exist yet
            return { data: [], sha: null };
        }
        throw error;
    }
}

async function saveDataToGitHub(videos, existingSha = null) {
    const content = JSON.stringify(videos, null, 2);
    const encodedContent = Buffer.from(content).toString('base64');
    
    const params = {
        owner: CONFIG.GITHUB_OWNER,
        repo: CONFIG.GITHUB_REPO,
        path: CONFIG.DATA_FILE_PATH,
        message: `Update video data - ${new Date().toISOString()}`,
        content: encodedContent
    };
    
    if (existingSha) {
        params.sha = existingSha;
    }
    
    await octokit.rest.repos.createOrUpdateFileContents(params);
}

async function saveCSVToGitHub(videos, existingSha = null) {
    // Convert to CSV format
    const headers = ['videoId', 'title', 'playlist', 'category', 'datePublished', 'description', 'fullUrl', 'imageUrl', 'lastUpdated'];
    const csvRows = [headers.join(',')];
    
    videos.forEach(video => {
        const row = headers.map(header => {
            const value = video[header] || '';
            // Escape commas and quotes in CSV
            return `"${value.toString().replace(/"/g, '""')}"`;
        });
        csvRows.push(row.join(','));
    });
    
    const csvContent = csvRows.join('\n');
    const encodedContent = Buffer.from(csvContent).toString('base64');
    
    try {
        // Try to get existing CSV file
        const { data: existingFile } = await octokit.rest.repos.getContent({
            owner: CONFIG.GITHUB_OWNER,
            repo: CONFIG.GITHUB_REPO,
            path: CONFIG.CSV_FILE_PATH
        });
        
        await octokit.rest.repos.createOrUpdateFileContents({
            owner: CONFIG.GITHUB_OWNER,
            repo: CONFIG.GITHUB_REPO,
            path: CONFIG.CSV_FILE_PATH,
            message: `Update video CSV - ${new Date().toISOString()}`,
            content: encodedContent,
            sha: existingFile.sha
        });
    } catch (error) {
        if (error.status === 404) {
            // File doesn't exist, create it
            await octokit.rest.repos.createOrUpdateFileContents({
                owner: CONFIG.GITHUB_OWNER,
                repo: CONFIG.GITHUB_REPO,
                path: CONFIG.CSV_FILE_PATH,
                message: `Create video CSV - ${new Date().toISOString()}`,
                content: encodedContent
            });
        } else {
            throw error;
        }
    }
}

function mergeVideoData(existingVideos, newVideos) {
    const videoMap = new Map();
    
    // Add existing videos to map
    existingVideos.forEach(video => {
        videoMap.set(video.videoId, video);
    });
    
    // Add new videos or update existing ones
    newVideos.forEach(video => {
        videoMap.set(video.videoId, video);
    });
    
    return Array.from(videoMap.values()).sort((a, b) => 
        new Date(b.datePublished) - new Date(a.datePublished)
    );
}

// API Routes
app.get('/api/recent-videos', async (req, res) => {
    try {
        // Get recent videos (last month)
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
        
        const playlists = await getChannelPlaylists();
        const allVideos = [];

        for (const playlist of playlists) {
            const biblicalInfo = identifyBiblicalBook(playlist.snippet.title);
            let category;

            if (biblicalInfo) {
                category = biblicalInfo.testament;
            } else {
                category = 'Other Series';
            }

            const playlistVideos = await getPlaylistVideos(
                playlist.id, 
                playlist.snippet.title, 
                category
            );
            
            allVideos.push(...playlistVideos);
            
            // Small delay to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 100));
        }

        // Filter for recent videos only
        const recentVideos = allVideos.filter(video => {
            const publishedDate = new Date(video.datePublished);
            return publishedDate >= oneMonthAgo;
        });

        // Get existing data from GitHub
        const { data: existingVideos, sha } = await getExistingData();
        
        // Merge new videos with existing data
        const mergedVideos = mergeVideoData(existingVideos, allVideos);
        
        // Save updated data back to GitHub (both JSON and CSV)
        await Promise.all([
            saveDataToGitHub(mergedVideos, sha),
            saveCSVToGitHub(mergedVideos)
        ]);
        
        console.log(`Updated GitHub repo with ${mergedVideos.length} total videos, ${recentVideos.length} recent`);
        
        // Return only recent videos to the client
        res.json({
            videos: recentVideos,
            totalVideos: mergedVideos.length,
            lastUpdated: new Date().toISOString()
        });
        
    } catch (error) {
        console.error('Error fetching videos:', error);
        res.status(500).json({ 
            error: 'Failed to fetch videos',
            message: error.message 
        });
    }
});

// Get all videos from GitHub (for debugging/testing)
app.get('/api/all-videos', async (req, res) => {
    try {
        const { data: videos } = await getExistingData();
        res.json({
            videos,
            count: videos.length
        });
    } catch (error) {
        console.error('Error fetching all videos:', error);
        res.status(500).json({ 
            error: 'Failed to fetch all videos',
            message: error.message 
        });
    }
});

// Health check
app.get('/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        timestamp: new Date().toISOString(),
        config: {
            hasYouTubeKey: !!CONFIG.YOUTUBE_API_KEY,
            hasGitHubToken: !!CONFIG.GITHUB_TOKEN,
            channelId: CONFIG.YOUTUBE_CHANNEL_ID,
            repo: `${CONFIG.GITHUB_OWNER}/${CONFIG.GITHUB_REPO}`
        }
    });
});

app.listen(PORT, () => {
    console.log(`YouTube proxy server running on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/health`);
    console.log(`Recent videos: http://localhost:${PORT}/api/recent-videos`);
});

module.exports = app;