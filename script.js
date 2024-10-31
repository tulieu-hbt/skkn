let model, webcam, labelContainer;

// Hàm khởi tạo (Chỉ tải mô hình trước, chưa bật webcam)
async function init() {
    try {
        console.log("Bắt đầu khởi tạo ứng dụng...");

        // Đợi TensorFlow sẵn sàng
        await tf.ready();
        console.log("TensorFlow đã sẵn sàng.");

        // Load mô hình MobileNet
        console.log("Đang tải mô hình MobileNet...");
        model = await mobilenet.load();
        console.log("Mô hình MobileNet đã được tải.");

        // Tạo container để hiển thị nhãn dự đoán
        labelContainer = document.getElementById("label-container");
        console.log("Ứng dụng đã được khởi tạo thành công.");
    } catch (error) {
        console.error("Lỗi khởi tạo:", error);
        alert("Đã xảy ra lỗi khi khởi tạo ứng dụng: " + error.message);
    }
}

// Khởi động webcam và nhận dạng khi nhấn nút "Bắt đầu"
async function start() {
    try {
        console.log("Bắt đầu khởi động webcam...");

        // Khởi tạo webcam
        webcam = document.createElement("video");
        webcam.setAttribute("autoplay", "");
        webcam.setAttribute("playsinline", "");
        webcam.setAttribute("width", 320); // Kích thước nhỏ hơn
        webcam.setAttribute("height", 240);
        document.getElementById("webcam-container").appendChild(webcam);
        document.getElementById("webcam-container").classList.remove("hidden");

        // Yêu cầu truy cập webcam
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            webcam.srcObject = stream;
            await new Promise((resolve) => (webcam.onloadedmetadata = resolve));
            console.log("Webcam đã sẵn sàng.");

            // Bắt đầu vòng lặp nhận dạng
            loop();
        } else {
            alert("Trình duyệt không hỗ trợ webcam");
            return;
        }
    } catch (error) {
        console.error("Lỗi khi khởi động webcam:", error);
        alert("Đã xảy ra lỗi khi khởi động webcam: " + error.message);
    }
}

// Vòng lặp cập nhật webcam và nhận dạng
async function loop() {
    await predict(); // Gọi hàm nhận dạng
    requestAnimationFrame(loop); // Lặp lại vòng lặp
}

// Hàm nhận dạng
async function predict() {
    try {
        // Kiểm tra nếu webcam có kích thước hợp lệ
        if (webcam.videoWidth > 0 && webcam.videoHeight > 0) {
            const image = tf.browser.fromPixels(webcam);
            const predictions = await model.classify(image); // Dự đoán từ ảnh

            // Xóa nội dung cũ
            labelContainer.innerHTML = "";

            // Hiển thị kết quả dự đoán
            predictions.forEach((prediction) => {
                const classPrediction = `${prediction.className}: ${(
                    prediction.probability * 100
                ).toFixed(2)}%`;
                const div = document.createElement("div");
                div.innerText = classPrediction;
                labelContainer.appendChild(div);
            });

            console.log("Kết quả dự đoán:", predictions);

            // Giải phóng bộ nhớ sau khi hoàn thành dự đoán
            image.dispose();
        }
    } catch (error) {
        console.error("Lỗi khi nhận dạng:", error);
        alert("Đã xảy ra lỗi khi nhận dạng: " + error.message);
    }
}

// Gắn sự kiện khởi chạy
document.getElementById("startButton").addEventListener("click", start);

// Khởi tạo ứng dụng
init();
