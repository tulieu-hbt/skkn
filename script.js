let webcamElement;

// Hàm khởi tạo webcam
async function startWebcam() {
    try {
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
            alert("Trình duyệt không hỗ trợ webcam");
            return;
        }
    } catch (error) {
        console.error("Lỗi khi khởi chạy webcam:", error);
        alert("Đã xảy ra lỗi khi khởi chạy webcam: " + error.message);
    }
}

// Khởi động ứng dụng khi nhấn nút "Bắt đầu"
document.getElementById("startButton").addEventListener("click", async () => {
    await startWebcam();
    document.getElementById("startButton").style.display = "none";
});
