let featureExtractor, knnClassifier, webcamElement;

// Hàm chờ ml5.js sẵn sàng
async function waitForMl5() {
    if (typeof ml5 === 'undefined') {
        throw new Error("ml5 library chưa được tải. Vui lòng kiểm tra liên kết ml5.js trong HTML.");
    }
    console.log("ml5 đã sẵn sàng.");
}

// Hàm khởi tạo ứng dụng
async function init() {
    try {
        console.log("Chờ ml5 sẵn sàng...");
        await waitForMl5();  // Chờ cho đến khi ml5 được tải

        console.log("Khởi tạo TensorFlow và các thành phần...");

        // Thiết lập backend TensorFlow và đảm bảo sẵn sàng
        await tf.setBackend('webgl');
        await tf.ready();
        console.log("TensorFlow.js đã sẵn sàng.");

        // Sử dụng ml5.featureExtractor để tải MobileNet
        featureExtractor = ml5.featureExtractor('MobileNet', modelLoaded);
        knnClassifier = ml5.KNNClassifier(); // Sử dụng KNN Classifier mới từ ml5

        function modelLoaded() {
            console.log("MobileNet đã được tải thành công.");
        }

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
            await new Promise((resolve) => {
                webcamElement.onloadedmetadata = () => {
                    webcamElement.play();
                    resolve();
                };
            });
            console.log("Webcam đã sẵn sàng.");
        } else {
            throw new Error("Trình duyệt không hỗ trợ webcam");
        }

        // Bắt đầu vòng lặp dự đoán sau khi khởi tạo thành công
        startPredictionLoop();
    } catch (error) {
        console.error("Lỗi khi khởi tạo ứng dụng:", error);
        alert("Đã xảy ra lỗi khi khởi tạo ứng dụng: " + error.message);
    }
}

// Hàm thêm dữ liệu huấn luyện cho từng nhãn
async function addExample(label) {
    try {
        if (!webcamElement) {
            throw new Error("Webcam chưa sẵn sàng");
        }

        const activation = featureExtractor.infer(webcamElement);
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
        try {
            if (knnClassifier.getNumClasses() > 0) {
                const activation = featureExtractor.infer(webcamElement);
                knnClassifier.classify(activation, (error, result) => {
                    if (error) {
                        console.error("Lỗi khi nhận diện:", error);
                        return;
                    }

                    // Hiển thị kết quả dự đoán
                    document.getElementById("label-container").innerText = `
                        Nhãn dự đoán: ${result.label} với độ chính xác: ${(result.confidencesByLabel[result.label] * 100).toFixed(2)}%
                    `;
                });
            }
            await new Promise((resolve) => setTimeout(resolve, 100)); // Đợi một thời gian ngắn trước khi lặp lại
        } catch (error) {
            console.error("Lỗi trong vòng lặp dự đoán:", error);
        }
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

