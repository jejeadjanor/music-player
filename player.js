import {
    loadCurrentSong
} from './scripts.js';

let songs = [];

export function setSongs(newSongs) {
    songs = newSongs;
}

function getAudioPlayer() {
    return document.getElementById('audioPlayer');
}

// App State
let isPlaying = false;
let playerInterval;
let currentTimeValue = 0;
let currentSongIndex = 0;
let isShuffling = false;
let isRepeating = false;

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


export const playerState = {
    currentSongIndex : 0,
    currentTimeValue: 0,
    isPlaying: false,
}