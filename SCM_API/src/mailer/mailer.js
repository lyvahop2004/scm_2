const nodemailer = require("nodemailer");
require("dotenv").config();

// Cấu hình dịch vụ email (ví dụ sử dụng Gmail)
const transporter = nodemailer.createTransport({
  service: "gmail", // Bạn có thể thay đổi dịch vụ nếu muốn (ví dụ: Yahoo, Outlook, v.v.)
  auth: {
    // user: "haidongduong26@gmail.com", // Thay bằng email của bạn
    // pass: "akrt vhlg oieb ftuu", // Thay bằng mật khẩu hoặc app password
    user: process.env.EMAIL_APP,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
});

const sendOrderEmail = async (userEmail, orderDetails) => {
  // Chuyển đổi orderDetails thành HTML
  const orderDate = new Date(orderDetails.orderdate).toLocaleString();
  const typeShipId = orderDetails.typeShipId;
  const note = orderDetails.note || "Không có ghi chú";

  // Phương thức vận chuyển
  let shippingMethod = "";
  let shippingFee = 0;

  switch (typeShipId) {
    case 2:
      shippingMethod = "Hỏa tốc";
      shippingFee = 50000; // Phí vận chuyển hỏa tốc
      break;
    case 3:
      shippingMethod = "Giao hàng tiết kiệm";
      shippingFee = 20000; // Phí vận chuyển hỏa tốc
      break;
    case 4:
      shippingMethod = "Giao hàng nhanh";
      shippingFee = 30000; // Phí vận chuyển hỏa tốc
      break;
    default:
      shippingMethod = "Chưa xác định";
  }

  // Giả sử lấy dữ liệu địa chỉ từ API hoặc cơ sở dữ liệu
  // Nếu cần sử dụng API để lấy địa chỉ người nhận, mở lại phần này
  // try {
  //   const response = await axios.get(
  //     `http://localhost:8003/api/get-detail-address-user`,
  //     { params: { id: addressUserId } }
  //   );
  //   if (response.data.errCode === 0) {
  //     const address = response.data.data[0];
  //     addressText = `${address.shipName}, ${address.shipAddress}, ${address.shipPhonenumber}`;
  //   } else {
  //     addressText = "Không tìm thấy địa chỉ người nhận";
  //   }
  // } catch (error) {
  //   addressText = "Lỗi khi lấy địa chỉ";
  // }

  // Tính tổng tiền đơn hàng
  let totalAmount = 0;
  orderDetails.arrDataShopCart.forEach((item) => {
    const itemTotal = item.realPrice * item.quantity;
    totalAmount += itemTotal;
  });

  // Tính tổng tiền bao gồm phí vận chuyển
  const finalAmount = totalAmount + shippingFee;

  // Tạo nội dung HTML cho email
  const htmlContent = `
      <html>
        <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
          <table style="width: 100%; background-color: #ffffff; border-radius: 8px; padding: 20px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
            <tr>
              <td style="text-align: center; background-color: #4CAF50; color: white; padding: 20px; font-size: 24px;" colspan="2">
                Xác nhận đơn hàng
              </td>
            </tr>
            <tr>
              <td colspan="2" style="padding: 15px;">
                <h3>Thông tin đơn hàng:</h3>
                <p><strong>Ngày đặt:</strong> ${orderDate}</p>
                <p><strong>Phương thức vận chuyển:</strong> ${shippingMethod} </p>
                <p><strong>Ghi chú:</strong> ${note}</p>
              </td>
            </tr>
            <tr>
            <td colspan="2" style="padding: 15px;">
                <p><strong>Tổng tiền sản phẩm:</strong> ${totalAmount.toLocaleString()} VND</p>
                <p><strong>Phí vận chuyển:</strong> ${shippingFee.toLocaleString()} VND</p>
              </td>
            </tr>
            <tr>
              <td colspan="2" style="padding: 15px;">
                <h2>Tổng tiền:${finalAmount.toLocaleString()} VND</h3>
              </td>
            </tr>
            <tr>
              <td colspan="2" style="text-align: center; padding: 15px;">
                <a href="http://scmshop.online" style="text-decoration: none; padding: 10px 20px; background-color: #4CAF50; color: white; border-radius: 5px;">Quay về shop</a>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `;

  const mailOptions = {
    from: "SCM SHOP", // Email gửi
    to: userEmail, // Email người nhận
    subject: "Thông Báo Đơn Hàng Từ SCM SHOP", // Tiêu đề email
    html: htmlContent, // Nội dung email là HTML
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email đã được gửi thành công!");
  } catch (error) {
    throw new Error("Lỗi khi gửi email: " + error.message);
  }
};

module.exports = {
  sendOrderEmail, // Đảm bảo gửi hàm này ra ngoài
};
