const nodemailer = require("nodemailer");

// Cấu hình dịch vụ email (ví dụ sử dụng Gmail)
const transporter = nodemailer.createTransport({
  service: "gmail", // Bạn có thể thay đổi dịch vụ nếu muốn (ví dụ: Yahoo, Outlook, v.v.)
  auth: {
    user: "haidongduong26@gmail.com", // Thay bằng email của bạn
    pass: "akrt vhlg oieb ftuu", // Thay bằng mật khẩu hoặc app password
  },
});

// Cấu hình email bạn muốn gửi
const mailOptions = {
  from: "haidongduong26@gmail.com", // Địa chỉ email người gửi
  to: `${userEmail}`, // Địa chỉ email người nhận
  subject: "Bạn có đơn hàng mới từ SCM STORE", // Tiêu đề email
  text: `Chào bạn! Đây là thông tin đơn hàng của bạn: ${orderDetails}`,
  // Nếu bạn muốn gửi email dưới dạng HTML, sử dụng `html` thay vì `text`
  // html: '<h1>This is a test email</h1>'
  html: "<h1>This is a test email</h1>",
  //   attachments: [
  //     {
  //       filename: 'test.txt',  // Tên tệp đính kèm
  //       path: './test.txt'     // Đường dẫn đến tệp
  //     }
  //   ]
};

// Gửi email
transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.log("Error: ", error);
  } else {
    console.log("Email sent: " + info.response);
  }
});
