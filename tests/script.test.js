/**
 * @jest-environment jsdom
 */


import { playerState,setSongs, loadCurrentSong, playSong,pauseSong, togglePlayPause, nextSong, prevSong } from '../scripts.js';



beforeEach(() => {
   const songs = [
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
            audioSrc: 'assets/audio/summer-paradise.mp3',
            duration: 210,
            liked: true,
            lyrics: [
                "Someday",
                "I will find my way back to where your name is written in the sand",
                "Yeah, yeah, yeah, let's go",
            ]
        }
    ];

    setSongs(songs);
    
    
    // Reset button and states
    document.body.innerHTML = `
    <button id="playBtn"><i class="ri-play-line"></i></button>
    <input type="range" id="progressBar" value="0">
    <input type="range" id="lyricsProgressBar" value="0">
    <span id="currentTime">0:00</span>
    <span id="lyricsCurrentTime">0:00</span>
    <span id="duration">0:00</span>
    <span id="totalTime">0:00</span>
    <span id="lyricsTotalTime">0:00</span>
    <img id="albumCover">
    <img id="miniCover" src=""/>
    <span id="songTitle"></span>
    <span id="lyricsSongTitle"></span>
    <span id="artistName"></span>
    <span id="lyricsArtistName"></span>
    <div id="lyricsText"></div>
    <div id="songList"></div>
    <audio id="audioPlayer"></audio>
    <button id="playPauseBtn" class="play-btn"><i class="ri-play-fill"></i></button>
    <button id="lyricsPlayPauseBtn" class="play-btn"><i class="ri-play-fill"></i></button>
    <button id="miniPlayPauseBtn" class="mini-play-btn"><i class="ri-pause-fill"></i></button>
`;

    //Add play/pause mocks to audio element
    const audio = document.getElementById('audioPlayer');
    audio.play = jest.fn();
    audio.pause = jest.fn();

    playerState.isPlaying = false;
    playerState.currentSongIndex = 0;
    playerState.currentTimeValue = 0
});

describe('Playback logic', () => {
    test('Toggle from pause to play', () => {
        playSong();
        expect(playerState.isPlaying).toBe(true);
        // expect(document.getElementById('playBtn').innerHTML).toContain('');
    });

    test('Toggle from play to pause', () => {
        playerState.isPlaying = true;
        pauseSong();
        expect(playerState.isPlaying).toBe(false);
        // expect(document.getElementById('playBtn').innerHTML).toContain('');
    });
});

describe('Track navigation', () => {
    test('Next track loops correctly', () => {
        loadCurrentSong();
        nextSong();
        expect(playerState.currentSongIndex).toBe(0);
    });

    test('Previous track resets orloops correctly', () => {
        loadCurrentSong();
        playerState.currentTimeValue = 5;
        prevSong();
        expect(playerState.currentTimeValue).toBe(0);
    });
});

describe('Progress bar updates', () => {
    test('Progress bar reflects current time', () => {
        const progressBar = document.getElementById('progressBar');
        playerState.currentTimeValue = 45;
        progressBar.value = playerState.currentTimeValue;

        expect(progressBar.value).toBe("45")
    })
})
