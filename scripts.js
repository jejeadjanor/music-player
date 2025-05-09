let songs = [
    {
        id:1,
        title: 'Summer Paradise',
        artist: 'SIMPLE PLAN',
        cover: 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21',
        audioSrc: 'assets/audio/summer-paradise.mp3',
        duration: 220,
        liked: false,
        lyrics: [
            "Someday",
            "I will find my way back to where your name is written in the sand",
            "Yeah, yeah, yeah, let's go",
            "Cause I remember every sunset (I remember)",
            "I remember every word you said",
            "We were never gonna say goodbye (No-no, no)",
            "Singing la-da-da-da-da",
            "Tell me how to get back to (Back to)",
            "Back to summer paradise with you (Yeah)",
            "And I'll be there in a heartbeat"
        ]
    },
    {
        id:2,
        title: 'Diamond',
        artist: 'RIHANNA',
        cover: 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21',
        audioSrc: 'assets/audio/rihanna-diamonds.mp3',
        duration: 210,
        liked: true,
        lyrics: [
            "Shine bright like a diamond",
            "I will find my way back to where your name is written in the sand",
            "Yeah, yeah, yeah, let's go",
        ]
    }
]


//DOM Elements
//Now Playing VIew
const nowPlayingView = document.getElementById('nowPlayingView');
const albumCover = document.getElementById('albumCover');
const songTitle = document.getElementById('songTitle');
const artistName = document.getElementById('artistName');
const volumeSlider = document.getElementById('volumeSlider');
const progressBar = document.getElementById('progressBar');
const currentTime = document.getElementById('currentTime');
const totalTime = document.getElementById('totalTime');
const playPauseBtn = document.getElementById('playPauseBtn');
const shuffleBtn = document.getElementById('shuffleBtn');
const repeatBtn = document.getElementById('repeatBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const showPlaylistBtn = document.getElementById('showPlaylistBtn');
const showLyricsBtn = document.getElementById('showLyricsBtn');
function getAudioPlayer() {
    return document.getElementById('audioPlayer');
}

//Lyrics View
const lyricsView  = document.getElementById('lyricsView');
const lyricsSongTitle = document.getElementById('lyricsSongTitle');
const lyricsArtistName = document.getElementById('lyricsArtistName');
const lyricsText = document.getElementById('lyricsText');
const lyricsProgressBar = document.getElementById('lyricsProgressBar');
const lyricsCurrentTime = document.getElementById('lyricsCurrentTime');
const lyricsTotalTime = document.getElementById('lyricsTotalTime');
const lyricsPlayPauseBtn = document.getElementById('lyricsPlayPauseBtn');
const lyricsPrevBtn = document.getElementById('lyricsPrevBtn');
const lyricsNextBtn = document.getElementById('lyricsNextBtn');
const backToNowPlayingBtn = document.getElementById('backToNowPlayingBtn');

//Playlist view
const playlistView = document.getElementById('playlistView');
const songList = document.getElementById('songList');
const backToPlayerBtn = document.getElementById('backToPlayerBtn');
const nowPlayingBar = document.getElementById('nowPlayingBar');
const miniCover = document.getElementById('miniCover');
const miniTitle = document.getElementById('miniTitle');
const miniArtist = document.getElementById('miniArtist');
const miniPlayPauseBtn = document.getElementById('miniPlayPauseBtn');


//App State
let currentSongIndex = 0;
let isPlaying = false;
let currentTimeValue = 0;
let isShuffling = false;
let isRepeating = false;
let playerInterval;


//Initialize Player
function initPlayer() {
    loadCurrentSong();
    renderPlaylist();
    updateProgressBars();
    setupEventListeners();
}

//Load Current song
export function loadCurrentSong() {
    const song = songs[currentSongIndex];

    //Update Now Playing View
    albumCover.src = song.cover;
    songTitle.textContent = song.title;
    artistName.textContent = song.artist;
    audioPlayer.src = song.audioSrc;
    progressBar.max = song.duration;
    progressBar.value = currentTimeValue;
    totalTime.textContent = formatTime(song.duration);
    currentTime.textContent = formatTime(currentTimeValue);


    //Update Play/Pause buttons
    updatePlayPauseButtons();

    //Update Lyrics View
    lyricsSongTitle.textContent = song.title;
    lyricsArtistName.textContent = song.artist;
    lyricsProgressBar.max = song.duration;
    lyricsProgressBar.value = currentTimeValue;
    lyricsTotalTime.textContent = formatTime(song.duration);
    lyricsCurrentTime.textContent = formatTime(currentTimeValue);

    //Update Lyrics Text
    renderLyrics();

    //Update Now Playing Bar in Playlist view
    miniCover.src = song.cover;
    miniTitle.textContent = song.title;
    miniArtist.textContent = song.artist;
}

// Render Playlist
function renderPlaylist() {
    songList.innerHTML = '';

    songs.forEach((song, index) => {
        const songItem = document.createElement('div');
        songItem.className = `song-item ${index === currentSongIndex ? 'active' : ''}`;
        songItem.dataset.index = index;

        songItem.innerHTML = `
            <div class="song-cover">
                <img src="${song.cover}" alt="${song.title}">
            </div>
            <div class="song-details">
                <h3>${song.title}</h3>
                <p>${song.artist}</p>
            </div>
            <button class="like-btn ${song.liked ? 'active' : ''}" data-id="${song.id}">
                <i class="ri-heart-${song.liked ? 'fill': 'line'}"></i>
            </button>
        `;

        songList.appendChild(songItem);
    });

    // Add event listeners to playlist items
    const songItems = document.querySelectorAll('.song-item');
    songItems.forEach(item => {
        item.addEventListener('click', (e) => {
            if(!e.target.classList.contains('like-btn') && !e.target.closest('.like-btn')) {
                const index = parseInt(item.dataset.index);
                currentSongIndex = index;
                currentTimeValue = 0;
                loadCurrentSong();
                playSong();
                showView('nowPlayingView')
            }
        });
    });

    // Add event listeners to like buttons
    const likeButtons = document.querySelectorAll('.like-btn');
    likeButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            const songId = parseInt(button.dataset.id);
            toggleLike(songId)
        });
    });
}

//Render Lyrics
function renderLyrics() {
    const song = songs[currentSongIndex];

    if(song.lyrics && song.lyrics.length > 0) {
        lyricsText.innerHTML = '';
        song.lyrics.forEach((line, index) => {
            const p = document.createElement('p');
            p.textContent = line;
            if (index === 4) p.className = 'current-line';
            lyricsText.appendChild(p);
        });
    } else {
        lyricsText.innerHTML = '<p class="no-lyrics">No lyrics available for this song.</p>';
    }
}

//Toogle Like Status
function toggleLike(songId) {
    const songIndex = songs.findIndex(song => song.id === songId);

    if(songIndex !== -1) {
        songs[songIndex].liked = !songs[songIndex].liked;
        renderPlaylist();
    }
}

//Show VIew
function showView(viewId) {
    //Hide all views
    nowPlayingView.classList.remove('active');
    lyricsView.classList.remove('active');
    playlistView.classList.remove('active');

    //Show requested view
    document.getElementById(viewId).classList.add('active');
}

//Setup Event Listeners
function setupEventListeners() {
    // Play/Pause buttons
    playPauseBtn.addEventListener('click', togglePlayPause);
    lyricsPlayPauseBtn.addEventListener('click', togglePlayPause);
    miniPlayPauseBtn.addEventListener('click', togglePlayPause);
    volumeSlider.addEventListener('input', () => {
        audioPlayer.volume = parseFloat(volumeSlider.value);
    })

    //Navigation buttons
    prevBtn.addEventListener('click', prevSong);
    nextBtn.addEventListener('click', nextSong);
    lyricsPrevBtn.addEventListener('click', prevSong);
    lyricsNextBtn.addEventListener('click', nextSong);

    //View Switching
    showPlaylistBtn.addEventListener('click', () => showView('playlistView'));
    showLyricsBtn.addEventListener('click', () => showView('lyricsView'));
    backToNowPlayingBtn.addEventListener('click', () => showView('nowPlayingView'));
    backToPlayerBtn.addEventListener('click', () => showView('nowPlayingView'));

    //Progress bars
    progressBar.addEventListener('input', handleProgressChange);
    lyricsProgressBar.addEventListener('input', handleProgressChange);

    //Shuffle and repeat buttons
    shuffleBtn.addEventListener('click', toggleShuffle);
    repeatBtn.addEventListener('click', toggleRepeat);
}

//Play song
export function playSong() {
    isPlaying = true;
    getAudioPlayer().play();
    updatePlayPauseButtons();

    //Clear existing interval
    clearInterval();

    //Start new interval to update progress
    playerInterval = setInterval(() => {
        if(currentTimeValue < songs[currentSongIndex].duration) {
            currentTimeValue++;
            updateProgressBars();
        }else{
            if(isRepeating) {
                currentTimeValue = 0;
                updateProgressBars();
            } else {
                nextSong();
            }
        }
    }, 1000)
}

//Pause Song
export function pauseSong() {
    isPlaying = false;
    getAudioPlayer().pause();
    updatePlayPauseButtons();
    clearInterval(playerInterval);
}

//Next Song
export function nextSong() {
    if(isShuffling) {
        let nextIndex;
        do {
            nextIndex = Math.floor(Math.random() * songs.length);
        }while (nextIndex === currentSongIndex && songs.length > 1);
        currentSongIndex = nextIndex;
    } else {
        currentSongIndex = (currentSongIndex + 1) % songs.length;
    }

    currentTimeValue = 0;
    loadCurrentSong();
    if (isPlaying) playSong();
}

//Previous Song 
export function prevSong() {
    if (currentTimeValue > 3) {
        //If more than 3 seconds have played, restart the song
        currentTimeValue = 0;
    } else {
        //Go to previous
        currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
    }

    loadCurrentSong();
    if (isPlaying) playSong();
}

// Update Play/Pause Buttons
export function updatePlayPauseButtons() {
    const playIcon = '<i class="ri-play-fill"></i>';
    const pauseIcon = '<i class="ri-pause-fill"></i>';

    playPauseBtn.innerHTML = isPlaying ? pauseIcon : playIcon;
    lyricsPlayPauseBtn.innerHTML = isPlaying ? pauseIcon : playIcon;
    miniPlayPauseBtn.innerHTML = isPlaying ? pauseIcon : playIcon;
}

//Update Progress Bars
export function updateProgressBars() {
    progressBar.value = currentTimeValue;
    lyricsProgressBar.value = currentTimeValue;
    currentTime.textContent = formatTime(currentTimeValue);
    lyricsCurrentTime.textContent = formatTime(currentTimeValue);
}

//Format Time (seconds to MM:SS)
export function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0': ''}${secs}`
}


//Toggle Play/Pause
function togglePlayPause() {
    if(isPlaying) {
        pauseSong();
    } else {
        playSong();
    }
}

//Handle Progress Change
function handleProgressChange(e) {
    currentTimeValue = parseInt(e.target.value);
    updateProgressBars();
}

//Toggle Shuffle
function toggleShuffle() {
    isShuffling = !isShuffling;
    shuffleBtn.style.color = isShuffling ? '#000000' : '#CCCCCC';
}

//Toggle Repeat
function toggleRepeat() {
    isRepeating = !isRepeating;
    repeatBtn.style.color = isRepeating ? '#000000' : '#CCCCCC';
}

function setSongs(newSongs) {
    songs = newSongs;
}



//Initialize the player when the page loads
window.addEventListener('DOMContentLoaded', initPlayer);
