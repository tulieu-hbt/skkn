let net, knnClassifier, webcamElement;

// Hàm khởi tạo ứng dụng
async function init() {
  try {
    console.log("Khởi tạo TensorFlow và các thành phần...");

    // Đảm bảo TensorFlow.js đã sẵn sàng và sử dụng backend 'webgl'
    await tf.setBackend('webgl');
    await tf.ready();
    console.log("TensorFlow.js đã sẵn sàng với backend 'webgl'.");

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
