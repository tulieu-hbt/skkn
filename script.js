// Import các thư viện cần thiết
let net, knnClassifier, webcamElement;

async function init() {
  console.log("Bắt đầu khởi tạo mô hình...");

  // Tải mô hình MobileNet
  net = await mobilenet.load();
  console.log("Đã tải xong MobileNet.");

  // Tạo KNN Classifier
  knnClassifier = knnClassifier || ml5.KNNClassifier();
  
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
  } else {
    alert("Trình duyệt không hỗ trợ webcam");
    return;
  }

  // Bắt đầu nhận diện sau khi khởi tạo thành công
  startPredictionLoop();
}

// Hàm thêm dữ liệu huấn luyện cho từng nhãn
async function addExample(label) {
  const activation = net.infer(webcamElement, true);
  knnClassifier.addExample(activation, label);
  console.log(`Đã thêm dữ liệu cho nhãn: ${label}`);
}

// Hàm vòng lặp để thực hiện nhận diện liên tục
async function startPredictionLoop() {
  while (true) {
    if (knnClassifier.getNumClasses() > 0) {
      const activation = net.infer(webcamElement, "conv_preds");
      const result = await knnClassifier.predictClass(activation);

      document.getElementById("label-container").innerText = `
        Nhãn dự đoán: ${result.label} với độ chính xác: ${(result.confidences[result.label] * 100).toFixed(2)}%
      `;
    }
    await tf.nextFrame();
  }
}

// Gán sự kiện cho các nút để thêm dữ liệu huấn luyện cho từng nhãn
document.getElementById("btn-apple").addEventListener("click", () => addExample("Apple"));
document.getElementById("btn-banana").addEventListener("click", () => addExample("Banana"));
document.getElementById("btn-orange").addEventListener("click", () => addExample("Orange"));

// Khởi tạo mô hình và webcam
init();
