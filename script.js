// Đường dẫn URL của mô hình Teachable Machine
const URL = "https://teachablemachine.withgoogle.com/models/YOUR_MODEL_ID/"; // Thay YOUR_MODEL_ID bằng ID của bạn

let model, webcam, labelContainer, maxPredictions;

// Hàm khởi tạo
async function init() {
  try {
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
  } catch (error) {
    console.error("Lỗi khởi tạo:", error);
    alert("Đã xảy ra lỗi khi khởi tạo ứng dụng. Vui lòng thử lại sau.");
  }
}

// Hàm bắt đầu nhận dạng
async function start() {
  try {
    // Ẩn nút "Bắt đầu"
    document.getElementById("startButton").style.display = "none";

    // Hiển thị video webcam
    await webcam.play();
    document.getElementById("webcam").style.display = "block";

    // Bắt đầu nhận dạng và hiển thị kết quả
    loop();
  } catch (error) {
    console.error("Lỗi khi bắt đầu nhận dạng:", error);
    alert("Đã xảy ra lỗi khi bắt đầu nhận dạng. Vui lòng kiểm tra webcam và thử lại.");
  }
}

// Vòng lặp cập nhật webcam và nhận dạng
async function loop() {
  webcam.update(); // Cập nhật khung hình webcam
  await predict(); // Gọi hàm nhận dạng
  requestAnimationFrame(loop); // Lặp lại vòng lặp
}

// Hàm nhận dạng
async function predict() {
  try {
    const prediction = await model.predict(webcam.canvas);
    for (let i = 0; i < maxPredictions; i++) {
      const classPrediction =
        prediction[i].className + ": " + prediction[i].probability.toFixed(2);
      labelContainer.childNodes[i].innerHTML   
 = classPrediction;   

    }
  } catch (error) {
    console.error("Lỗi khi nhận dạng:", error);
    alert("Đã xảy ra lỗi khi nhận dạng. Vui lòng thử lại.");
  }
}

// Khởi tạo
init();
