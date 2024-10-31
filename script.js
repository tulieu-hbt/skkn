let net, knnClassifier, webcamElement;

// Hàm khởi tạo ứng dụng
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
        console.log("Webcam đã sẵn sàng.");
    } else {
        alert("Trình duyệt không hỗ trợ webcam");
        return;
    }
}

// Hàm thêm dữ liệu huấn luyện cho từng nhãn
async function addExample(label) {
    try {
        if (!webcamElement) {
            throw new Error("Webcam chưa sẵn sàng");
        }

        const activation = net.infer(webcamElement, true);
        knnClassifier.addExample(activation, label);
        console.log(`Đã thêm dữ liệu cho nhãn: ${label}`);
    } catch (error) {
        console.error("Lỗi khi thêm dữ liệu:", error);
        alert("Lỗi khi thêm dữ liệu huấn luyện: " + error.message);
    }
}

// Khởi động ứng dụng khi nhấn nút "Bắt đầu"
document.getElementById("startButton").addEventListener("click", async () => {
    await init();
    document.getElementById("startButton").style.display = "none";
});

// Gán sự kiện cho các nút để thêm dữ liệu huấn luyện cho từng nhãn
document.getElementById("btn-apple").addEventListener("click", () => addExample("Apple"));
document.getElementById("btn-banana").addEventListener("click", () => addExample("Banana"));
document.getElementById("btn-orange").addEventListener("click", () => addExample("Orange"));
