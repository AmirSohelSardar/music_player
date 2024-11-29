const songs = [
    { title: "Aaj Ki Raat", artist: "Madhubanti Bagchi", src: "songs/Aaj Ki Raat.mp3", cover: "images/Aaj Ki Raat.jpg" },
    { title: "Gulabi Aankhen", artist: "Sanam Puri", src: "songs/Gulabi Aankhen.mp3", cover: "images/Gulabi Aankhen.jpg" },
    { title: "Hamari Adhuri Kahani", artist: "Arijit Singh", src: "songs/Hamari Adhuri Kahani.mp3", cover: "images/Hamari Adhuri Kahani.jpg" },
    { title: "Humein Tumse Pyaar", artist: "Arman Malik", src: "songs/Humein Tumse Pyaar.mp3", cover: "images/Humein Tumse Pyaar.jpg" },
    { title: "Jamal-Jamaloo-Animal", artist: "Shahnaaz Randhawa", src: "songs/Jamal-Jamaloo-Animal.mp3", cover: "images/Jamal-Jamaloo-Animal.jpg" },
    { title: "Lag Ja Gale", artist: "Siddharth Slathia", src: "songs/Lag Ja Gale.mp3", cover: "images/Lag Ja Gale.jpg" },
    { title: "Likhe Jo Khat Tujhe", artist: "Sanam Puri", src: "songs/Likhe Jo Khat Tujhe.mp3", cover: "images/Likhe Jo Khat Tujhe.jpg" },
    { title: "Nabz Mein Tu Hain", artist: "Shaan", src: "songs/Nabz Mein Tu Hain.mp3", cover: "images/Nabz Mein Tu Hain.jpg" },
    { title: "Phir Aur Kya Chahiye", artist: "Arijit Singh", src: "songs/Phir Aur Kya Chahiye.mp3", cover: "images/Phir Aur Kya Chahiye.jpg" },
    { title: "Raat Kali Ek Khwaab Mein Aai", artist: "Sanam Puri", src: "songs/Raat Kali Ek Khwaab Mein Aai.mp3", cover: "images/Raat Kali Ek Khwaab Mein Aai.jpg" },
    { title: "Sach Keh Raha Hai", artist: "B PRAAK", src: "songs/Sach Keh Raha Hai.mp3", cover: "images/Sach Keh Raha Hai.jpg" },
];

let currentSongIndex = 0;
const audio = new Audio();
const playBtn = document.getElementById("play-btn");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const songTitle = document.getElementById("song-title");
const artistName = document.getElementById("artist-name");
const albumCover = document.getElementById("album-cover");
const seekBar = document.getElementById("seek-bar");
const currentTimeDisplay = document.getElementById("current-time");
const durationDisplay = document.getElementById("duration");
const songListContainer = document.getElementById("song-list");

function loadSong(song) {
    songTitle.textContent = song.title;
    artistName.textContent = song.artist;
    albumCover.src = song.cover;
    audio.src = song.src;

    audio.load();
    audio.addEventListener("loadedmetadata", () => {
        durationDisplay.textContent = formatTime(audio.duration);
    });

    audio.currentTime = 0;
    seekBar.value = 0;
    updateHighlight();
}

function togglePlay() {
    if (audio.paused) {
        audio.play();
        playBtn.textContent = "⏸";
    } else {
        audio.pause();
        playBtn.textContent = "▶️";
    }
}

function prevSong() {
    currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
    loadSong(songs[currentSongIndex]);
    audio.play();
    playBtn.textContent = "⏸";
}

function nextSong() {
    currentSongIndex = (currentSongIndex + 1) % songs.length;
    loadSong(songs[currentSongIndex]);
    audio.play();
    playBtn.textContent = "⏸";
}

function updateHighlight() {
    const songItems = document.querySelectorAll(".song-item");
    songItems.forEach((item, index) => {
        if (index === currentSongIndex) {
            item.classList.add("active");
        } else {
            item.classList.remove("active");
        }
    });
}

function renderSongList() {
    songListContainer.innerHTML = ""; // Clear the list before rendering
    songs.forEach((song, index) => {
        const songItem = document.createElement("li");
        songItem.classList.add("song-item");

        // Create an audio object to get the duration of the song
        const tempAudio = new Audio(song.src);
        
        // Event listener to get the song's duration once it's loaded
        tempAudio.addEventListener("loadedmetadata", () => {
            const duration = formatTime(tempAudio.duration); // Format duration
            songItem.innerHTML = `
                <div class="song-details">
                    <img src="${song.cover}" alt="${song.title} Cover">
                    <span>${index + 1}. ${song.title} - ${song.artist}</span>
                </div>
                <div class="song-duration">${duration}</div>  <!-- Show duration -->
            `;
        });

        // Handle the case where the song fails to load (duration unavailable)
        tempAudio.addEventListener("error", () => {
            songItem.innerHTML = `
                <div class="song-details">
                    <img src="${song.cover}" alt="${song.title} Cover">
                    <span>${index + 1}. ${song.title} - ${song.artist}</span>
                </div>
                <div class="song-duration">Unknown</div>
            `;
        });

        // Add event listener to play the song when clicked
        songItem.addEventListener("click", () => {
            currentSongIndex = index;
            loadSong(songs[currentSongIndex]);
            audio.play();
            playBtn.textContent = "⏸";
        });

        songListContainer.appendChild(songItem);
    });
}

function formatTime(seconds) {
    if (isNaN(seconds)) return "0:00";
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
}

// Event listeners
audio.addEventListener("timeupdate", () => {
    if (audio.duration) {
        seekBar.value = (audio.currentTime / audio.duration) * 100;
        currentTimeDisplay.textContent = formatTime(audio.currentTime);
    }
});

audio.addEventListener("ended", nextSong);

seekBar.addEventListener("input", () => {
    if (audio.duration) {
        audio.currentTime = (seekBar.value / 100) * audio.duration;
    }
});

// Initial setup
renderSongList();
loadSong(songs[currentSongIndex]);
playBtn.addEventListener("click", togglePlay);
prevBtn.addEventListener("click", prevSong);
nextBtn.addEventListener("click", nextSong);
