const container = document.querySelector('.container'),
	mainVideo = container.querySelector('.main-video'),
	progressBar = container.querySelector('.progress-bar'),
	videoTimeline = container.querySelector('.video-timeline'),
	currentVTime = container.querySelector('.video-timer__current'),
	videoDuration = container.querySelector('.video-timer__duration'),
	volumeBtn = container.querySelector('.volume i'),
	volumeSlider = container.querySelector('.left input'),
	skipBackward = container.querySelector('.skip-backward i'),
	skipForward = container.querySelector('.skip-forward i'),
	playPauseBtn = container.querySelector('.play-pause i'),
	speedBtn = container.querySelector('.video-controls__speed span'),
	speedOptions = container.querySelector('.speed-options'),
	picInPicBtn = container.querySelector('.video-controls__pic .material-icons'),
	fullScreenBtn = container.querySelector('.video-controls__fullscreen i');

let timer;

const hideControls = () => {
	if(mainVideo.paused) return; // if video is pause return
	timer = setTimeout(() => { // remove show-controls class after 3 seconds
		container.classList.remove('show-controls');
	}, 3000);
}
hideControls();

container.addEventListener('mousemove', () => {
	container.classList.add('show-controls'); // add show-controls class on mousemove
	clearTimeout(timer); // clear timer
	hideControls(); // calling hideControls
});

const formatTime = time => {
	// getting seconds, minutes, hours
	let seconds = Math.floor(time % 60),
		minutes = Math.floor(time / 60) % 60,
		hours = Math.floor(time / 3600);
	// adding 0 at the beginning if the particular value is less than 10
	seconds = seconds < 10 ? `0${seconds}` : seconds;
	minutes = minutes < 10 ? `0${minutes}` : minutes;
	hours = hours < 10 ? `0${hours}` : hours;

	if(hours == 0){ // if hours is 0 return minutes & seconds only else return all
		return `${minutes}:${seconds}`;
	}
	return `${hours}:${minutes}:${seconds}`;
}

mainVideo.addEventListener('timeupdate', e => {
	// Update progress bar
	let { currentTime, duration } = e.target; // getting currentTime & duration of the video
	let percent = (currentTime / duration) * 100; // getting percent
	progressBar.style.width = `${percent}%`; // passing percent as progressbar width
	currentVTime.innerText = formatTime(currentTime);
});

mainVideo.addEventListener('loadeddata', e => {
	videoDuration.innerText = formatTime(e.target.duration); // passing video duration as VideoDuration innerText
});

playPauseBtn.addEventListener('click', () => {
	// If video is paused, play the video else pause the video
	mainVideo.paused ? mainVideo.play() : mainVideo.pause();
});

mainVideo.addEventListener('play', () => {
	// If video is play, change icon to pause
	playPauseBtn.classList.replace('fa-play', 'fa-pause');
});

mainVideo.addEventListener('pause', () => {
	// If video is pause, change icon to play
	playPauseBtn.classList.replace('fa-pause', 'fa-play');
});

skipBackward.addEventListener('click', () => {
	mainVideo.currentTime -= 5; // subtract 5 seconds from the current video time
});

skipForward.addEventListener('click', () => {
	mainVideo.currentTime += 5; // add 5 seconds to the current video time
});

volumeBtn.addEventListener('click', () => {
	if(!volumeBtn.classList.contains('fa-volume-high')){ //if volume icon isn't volume high icon
		mainVideo.volume = 0.5; // passing 0.5 value as video volume
		volumeBtn.classList.replace('fa-volume-xmark', 'fa-volume-high');
	} else {
		mainVideo.volume = 0.0; // passing 0.0 value as video volume, so the video mute
		volumeBtn.classList.replace('fa-volume-high', 'fa-volume-xmark');
	}
	volumeSlider.value = mainVideo.volume; // update slider value according to the video volume
});

volumeSlider.addEventListener('input', e => {
	mainVideo.volume = e.target.value; // passing slider value as video volume
	if(e.target.value == 0){ // if slider value is 0, change icon to mute icon
		volumeBtn.classList.replace('fa-volume-high', 'fa-volume-xmark');
	} else {
		volumeBtn.classList.replace('fa-volume-xmark', 'fa-volume-high');
	}
});

speedBtn.addEventListener('click', () => {
	speedOptions.classList.toggle('show'); // toggle show class
});

document.addEventListener('click', e => {
	if(e.target.tagName !== 'SPAN' || e.target.className !== 'material-symbols-rounded'){
		speedOptions.classList.remove('show');
	}
});

speedOptions.querySelectorAll('li').forEach(option => {
	option.addEventListener('click', () => { // adding click event on all speed option
		mainVideo.playbackRate = option.dataset.speed; // passing option dataset value as video playback value
		speedOptions.querySelector('.active').classList.remove('active'); // remove active class
		option.classList.add('active'); // adding active class on the selected option
	});
});

picInPicBtn.addEventListener('click', () => {
	mainVideo.requestPictureInPicture(); // changing video mode to picture in picture
});

fullScreenBtn.addEventListener('click', () => {
	container.classList.toggle('fullscreen'); // toggle fullscreen class
	if(document.fullscreenElement){ // if video is already in fullscreen mode
		fullScreenBtn.classList.replace('fa-compress', 'fa-expand');
		return document.exitFullscreen(); // exit from fullscreen mode and return
	}
	fullScreenBtn.classList.replace('fa-expand', 'fa-compress');
	container.requestFullscreen(); // go to fullscreen mode
});

document.addEventListener('keydown', e => {
	if(e.key === "Escape"){
		container.classList.remove('fullscreen');
		fullScreenBtn.classList.replace('fa-compress', 'fa-expand');
	}
});

videoTimeline.addEventListener('click', e => {
	let timelineWidth = videoTimeline.clientWidth; // getting videoTimeline width
	mainVideo.currentTime = (e.offsetX / timelineWidth) * mainVideo.duration; // updating video currentTime
});

const draggableProgressBar = e => {
	let timelineWidth = videoTimeline.clientWidth; // getting videoTimeline width
	progressBar.style.width = `${e.offsetX}px`; // passing offsetX value as progressbar width
	mainVideo.currentTime = (e.offsetX / timelineWidth) * mainVideo.duration; // update video currentTime
	currentVTime.innerText = formatTime(mainVideo.currentTime); // passing video current time as currentVTime video
}

videoTimeline.addEventListener('mousedown', () => { // calling draggableProgressBar function on mousemove event
	videoTimeline.addEventListener('mousemove', draggableProgressBar);
});

videoTimeline.addEventListener('mousemove', e => {
	const progressTime = videoTimeline.querySelector('span');
	let offsetX = e.offsetX; // getting mouseX position
	let timelineWidth = videoTimeline.clientWidth; // getting videoTimeline width
	let percent = (e.offsetX / timelineWidth) * mainVideo.duration; // getting percent
	progressTime.style.left = `${offsetX}px`; // passing offsetX value as progressTime left value
	progressTime.innerText = formatTime(percent); // passing percent as progressTime innerText
});

container.addEventListener('mouseup', () => { // removing mousemove listener on mouseup event
	videoTimeline.removeEventListener('mousemove', draggableProgressBar);
});