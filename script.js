let model, webcam, labelContainer;

// Hàm khởi tạo
async function init() {
    try {
        console.log("Bắt đầu khởi tạo ứng dụng...");

        // Load mô hình MobileNet
        console.log("Đang tải mô hình MobileNet...");
        model = await mobilenet.load();
        console.log("Mô hình MobileNet đã được tải.");

        // Khởi tạo webcam
        console.log("Đang khởi tạo webcam...");
        const flip = true; // Lật ảnh từ webcam
        webcam = document.createElement("video");
        webcam.setAttribute("autoplay", "");
        webcam.setAttribute("playsinline", "");
        webcam.setAttribute("width", 640);
        webcam.setAttribute("height", 480);
        document.getElementById("webcam-container").appendChild(webcam);

        // Yêu cầu truy cập webcam
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            webcam.srcObject = stream;
            await new Promise((resolve) => (webcam.onloadedmetadata = resolve));
            console.log("Webcam đã sẵn sàng.");
        } else {
            alert("Trình duyệt không hỗ trợ webcam");
            return;
        }

        // Tạo container để hiển thị nhãn dự đoán
        labelContainer = document.getElementById("label-container");
        console.log("Ứng dụng đã được khởi tạo thành công.");
    } catch (error) {
        console.error("Lỗi khởi tạo:", error);
        alert("Đã xảy ra lỗi khi khởi tạo ứng dụng: " + error.message);
    }
}

// Hàm bắt đầu nhận dạng
function start() {
    try {
        console.log("Bắt đầu nhận dạng...");
        document.getElementById("startButton").style.display = "none";
        loop();
    } catch (error) {
        console.error("Lỗi khi bắt đầu nhận dạng:", error);
        alert("Đã xảy ra lỗi khi bắt đầu nhận dạng: " + error.message);
    }
}

// Vòng lặp cập nhật webcam và nhận dạng
async function loop() {
    // Đảm bảo webcam đã sẵn sàng
    if (webcam && webcam.readyState === 4) {
        await predict(); // Gọi hàm nhận dạng
    }
    requestAnimationFrame(loop); // Lặp lại vòng lặp
}

// Hàm nhận dạng
async function predict() {
    try {
        const predictions = await model.classify(webcam); // Dự đoán từ webcam

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
    } catch (error) {
        console.error("Lỗi khi nhận dạng:", error);
        alert("Đã xảy ra lỗi khi nhận dạng: " + error.message);
    }
}

// Gắn sự kiện khởi chạy
document.getElementById("startButton").addEventListener("click", start);

// Khởi tạo ứng dụng
init();
