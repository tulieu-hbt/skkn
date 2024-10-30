// Đường dẫn URL của mô hình Teachable Machine
const URL = "https://teachablemachine.withgoogle.com/models/YOUR_MODEL_ID/"; // Thay YOUR_MODEL_ID bằng ID của bạn

let model, webcam, labelContainer, maxPredictions;

// Hàm khởi tạo
async function init() {
  const modelURL = URL + "model.json";
  const metadataURL = URL + "metadata.json";

  // Load mô hình
  model = await tmImage.load(modelURL, metadataURL);
  maxPredictions = model.getTotalClasses();

  // Khởi tạo webcam
  const flip = true; // Lật ảnh từ webcam
  webcam = new tmImage.Webcam(640, 480, flip); // width, height, flip
  await webcam.setup(); // Yêu cầu truy cập webcam

  // Lấy các element HTML
  document.getElementById("startButton").addEventListener("click", start);
  labelContainer = document.getElementById("label-container");
  for (let i = 0; i < maxPredictions; i++) { 
    labelContainer.appendChild(document.createElement("div"));   

  }
}

async function start() {
  await webcam.play();
  window.requestAnimationFrame(loop);
  document.getElementById("startButton").style.display = "none";
  document.getElementById("webcam").style.display = "block";
}

// Vòng lặp cập nhật webcam và nhận dạng
async function loop() {
  webcam.update(); // Cập nhật khung hình webcam
  await predict();
  window.requestAnimationFrame(loop);
}

// Hàm nhận dạng
async function predict() {
  const prediction = await model.predict(webcam.canvas);
  for (let i = 0; i < maxPredictions; i++) {
    const classPrediction =
      prediction[i].className   
 + ": " + prediction[i].probability.toFixed(2);
    labelContainer.childNodes[i].innerHTML = classPrediction;   

  }
}

// Khởi tạo
init();
