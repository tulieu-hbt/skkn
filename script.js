async function init() {
  console.log("Bắt đầu khởi tạo mô hình...");

  // Tải mô hình MobileNet
  net = await mobilenet.load();
  console.log("Đã tải xong MobileNet.");

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
  } else {
    alert("Trình duyệt không hỗ trợ webcam");
    return;
  }

  // Bắt đầu nhận diện sau khi khởi tạo thành công
  startPredictionLoop();
}
init();
