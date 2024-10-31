// Đường dẫn URL của mô hình Teachable Machine (sẽ được sử dụng sau)
const URL = "https://teachablemachine.withgoogle.com/models/YOUR_MODEL_ID/"; // Thay YOUR_MODEL_ID bằng ID của bạn

let model, webcam, labelContainer, maxPredictions;

// Hàm khởi tạo
async function init() {
  try {
    console.log("Bắt đầu khởi tạo ứng dụng...");

    // Load mô hình MobileNet
    console.log("Đang tải mô hình MobileNet...");
    model = await mobilenet.load();
    console.log("Mô hình MobileNet đã được tải.");

    maxPredictions = model.getTotalClasses(); // MobileNet có 1000 classes
    console.log("Số lượng classes:", maxPredictions);

    // Khởi tạo webcam
    console.log("Đang khởi tạo webcam...");
    const flip = true; // Lật ảnh từ webcam
    webcam = new tmImage.Webcam(640, 480, flip); // width, height, flip
    await webcam.setup(); // Yêu cầu truy cập webcam
    console.log("Webcam đã được khởi tạo:", webcam);

    // Lấy các element HTML
    document.getElementById("startButton").addEventListener("click", start);
    labelContainer = document.getElementById("label-container");

    // Tạo 5 div để hiển thị kết quả
    for (let i = 0; i < 5; i++) {
      labelContainer.appendChild(document.createElement("div"));
    }

    console.log("Ứng dụng đã được khởi tạo thành công.");
  } catch (error) {
    console.error("Lỗi khởi tạo:", error);
    alert("Đã xảy ra lỗi khi khởi tạo ứng dụng: " + error.message);
  }
}

// Hàm bắt đầu nhận dạng
async function start() {
  try {
    console.log("Bắt đầu nhận dạng...");

    // Ẩn nút "Bắt đầu"
    document.getElementById("startButton").style.display = "none";

    // Hiển thị video webcam
    await webcam.play();
    document.getElementById("webcam").style.display = "block";

    // Bắt đầu vòng lặp nhận dạng
    loop();

    console.log("Nhận dạng đã bắt đầu.");
  } catch (error) {
    console.error("Lỗi khi bắt đầu nhận dạng:", error);
    alert("Đã xảy ra lỗi khi bắt đầu nhận dạng: " + error.message);
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

    // Hiển thị 5 kết quả có xác suất cao nhất
    prediction.sort((a, b) => b.probability - a.probability);
    for (let i = 0; i < 5; i++) {
      const classPrediction =
        prediction[i].className + ": " + prediction[i].probability.toFixed(2);
      labelContainer.childNodes[i].innerHTML = classPrediction;   
 // Cập nhật nội dung của 5 div đầu tiên
    }

    console.log("Kết quả dự đoán:", prediction);
  } catch (error) {
    console.error("Lỗi khi nhận dạng:", error);
    alert("Đã xảy ra lỗi khi nhận dạng: " + error.message);
  }
}

// Khởi tạo
init();
