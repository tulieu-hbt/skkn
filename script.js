let net, knnClassifier, webcamElement;

// Hàm khởi tạo ứng dụng
async function init() {
  try {
    console.log("Khởi tạo TensorFlow và các thành phần...");

    // Đảm bảo TensorFlow.js đã sẵn sàng và thiết lập backend CPU
    await tf.ready();
    await tf.setBackend('cpu'); // Hoặc 'webgl' nếu 'cpu' không khả dụng
    console.log("TensorFlow.js đã sẵn sàng với backend:", tf.getBackend());

    // Tải mô hình MobileNet
    net = await mobilenet.load();
    console.log("MobileNet đã được tải thành công.");

    // Tạo KNN Classifier
    knnClassifier = ml5.KNNClassifier();

    // Khởi tạo webcam
    webcamElement = document.createElement("video");
    webcamElement.setAttribute("autoplay", "");
    webcamElement.setAttribute("playsinline", "");
    webcamElement.setAttribute("width", 640);
    webcamElement.setAttribute("height", 480);
    document.getElementById("webcam-container").appendChild(webcamElement);

    // Khởi chạy webcam
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      webcamElement.srcObject = stream;
      await new Promise((resolve) => (webcamElement.onloadedmetadata = resolve));
      console.log("Webcam đã sẵn sàng.");
    } else {
      alert("Trình duyệt không hỗ trợ webcam");
      return;
    }

    // Bắt đầu vòng lặp dự đoán sau khi khởi tạo thành công
    startPredictionLoop();
  } catch (error) {
    console.error("Lỗi khi khởi tạo ứng dụng:", error);
    alert("Lỗi khi khởi tạo ứng dụng: " + error.message);
  }
}

// Hàm thêm dữ liệu huấn luyện cho từng nhãn
async function addExample(label) {
  try {
    const activation = net.infer(webcamElement, true);
    knnClassifier.addExample(activation, label);
    console.log(`Đã thêm dữ liệu cho nhãn: ${label}`);
  } catch (error) {
    console.error("Lỗi khi thêm dữ liệu:", error);
    alert("Lỗi khi thêm dữ liệu huấn luyện: " + error.message);
  }
}

// Hàm vòng lặp để thực hiện nhận diện liên tục
async function startPredictionLoop() {
  while (true) {
    if (knnClassifier.getNumClasses() > 0) {
      const activation = net.infer(webcamElement, "conv_preds");
      const result = await knnClassifier.classify(activation);

      // Hiển thị kết quả dự đoán
      document.getElementById("label-container").innerText = `
        Nhãn dự đoán: ${result.label} với độ chính xác: ${(result.confidencesByLabel[result.label] * 100).toFixed(2)}%
      `;
    }
    await new Promise((resolve) => setTimeout(resolve, 100)); // Đợi một thời gian ngắn trước khi lặp lại
  }
}

// Khởi động ứng dụng khi nhấn nút "Bắt đầu"
document.getElementById("startButton").addEventListener("click", () => {
  init();
  document.getElementById("startButton").style.display = "none";
});

// Gán sự kiện cho các nút để thêm dữ liệu huấn luyện cho từng nhãn
document.getElementById("btn-apple").addEventListener("click", () => addExample("Apple"));
document.getElementById("btn-banana").addEventListener("click", () => addExample("Banana"));
document.getElementById("btn-orange").addEventListener("click", () => addExample("Orange"));
