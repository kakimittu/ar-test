const mediaList = [
  { type: "image", src: "assets/images/img1.jpg" },
  { type: "image", src: "assets/images/img2.jpg" },
  { type: "video", src: "assets/videos/video1.mp4" },
  { type: "image", src: "assets/images/img3.jpg" }
];

let currentIndex = 0;
let autoTimer = null;

const img = document.getElementById("image");
const video = document.getElementById("video");

function showMedia(index) {
  img.style.display = "none";
  video.style.display = "none";
  video.pause();

  const media = mediaList[index];

  if (media.type === "image") {
    img.src = media.src;
    img.style.display = "block";
  } else {
    video.src = media.src;
    video.style.display = "block";
  }
}

function next() {
  currentIndex = (currentIndex + 1) % mediaList.length;
  showMedia(currentIndex);
}

function prev() {
  currentIndex =
    (currentIndex - 1 + mediaList.length) % mediaList.length;
  showMedia(currentIndex);
}

/* ボタンイベント */
document.getElementById("nextBtn").addEventListener("click", (e) => {
  e.preventDefault();
  next();
});

document.getElementById("prevBtn").addEventListener("click", (e) => {
  e.preventDefault();
  prev();
});

/* 自動スライド（5秒） */
function startAutoSlide() {
  autoTimer = setInterval(next, 5000);
}

showMedia(currentIndex);
startAutoSlide();
