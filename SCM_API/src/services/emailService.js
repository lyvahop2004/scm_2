require("dotenv").config();
const nodemailer = require("nodemailer");

let sendSimpleEmail = async (dataSend) => {
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_APP,
      pass: process.env.EMAIL_APP_PASSWORD,
    },
  });
  if (dataSend.type === "verifyEmail") {
    let info = await transporter.sendMail({
      from: '"lyvanhop 👻" <lyhop2004g@gmail.com>', // sender address
      to: dataSend.email, // list of receivers
      subject: "Xác thực email | SCMSHOP", // Subject line
      html: getBodyHTMLEmailVerify(dataSend),
    });
  }
  if (dataSend.type === "forgotpassword") {
    let info = await transporter.sendMail({
      from: '"lyvanhop 👻" <lyhop2004g@gmail.com>', // sender address
      to: dataSend.email, // list of receivers
      subject: "Xác nhận quên mật khẩu | SCMSHOP", // Subject line
      html: getBodyHTMLEmailForgotPassword(dataSend),
    });
  }
  if (dataSend.type === "guiemaildonhang") {
    let info = await transporter.sendMail({
      from: '"lyvanhop 👻" <lyhop2004g@gmail.com>', // sender address
      to: dataSend.email, // list of receivers
      subject: "Xác nhận đơn hàng| SCMSHOP", // Subject line
      html: getBodyHTMLEmailPurchase(dataSend),
    });
  }
};

let sendSimpleEmaill = async (dataSend) => {
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_APP,
      pass: process.env.EMAIL_APP_PASSWORD,
    },
  });
  if (dataSend.type === "guiemaildonhang") {
    let info = await transporter.sendMail({
      from: '"lyvanhop 👻" <lyhop2004g@gmail.com>', // sender address
      to: dataSend.email, // list of receivers
      subject: "Xác nhận đơn hàng | SCMSHOP", // Subject line
      html: getBodyHTMLEmailPurchase(dataSend),
    });
  }
};

let getBodyHTMLEmailVerify = (dataSend) => {
  let fullname = `${dataSend.firstName} ${dataSend.lastName}`;
  let result = `<h3>Xin chào ${fullname}!</h3>
        <p>Bạn nhận được email này vì đã thực hiện lệnh xác thực email!</p>
        <p>Bui lòng click vào đường link bên dưới để xác nhận và hoàn tất thủ tục xác minh email của bạn</p>
        <div>
            <a href="${dataSend.redirectLink}" target=""_blank>Click here</a>
        </div>
        <div>Xin cảm ơn !</div>
    `;

  return result;
};
let getBodyHTMLEmailForgotPassword = (dataSend) => {
  let fullname = `${dataSend.firstName} ${dataSend.lastName}`;
  let result = `<h3>Xin chào ${fullname}!</h3>
        <p>Bạn nhận được email này vì đã thực hiện lệnh quên mật khẩu!</p>
        <p>Bui lòng click vào đường link bên dưới để xác nhận quên mật khẩu và lấy lại mật khẩu của bạn</p>
        <div>
            <a href="${dataSend.redirectLink}" target=""_blank>Click here</a>
        </div>
        <div>Xin cảm ơn !</div>
    `;

  return result;
};
// Hàm tạo nội dung email khi khách hàng mua hàng
let getBodyHTMLEmailPurchase = (dataSend) => {
  let fullname = `${dataSend.firstName} ${dataSend.lastName}`;
  let result = `
  
        <h3>Xin chào ${fullname}!</h3>
        <p>Cảm ơn bạn đã mua hàng tại SCMSHOP!</p>
        <p>Đơn hàng của bạn đã được xác nhận và sẽ được xử lý sớm. Dưới đây là chi tiết đơn hàng của bạn:</p>
        
        <h4>Thông tin đơn hàng: </h4>
        <p><strong>Mã đơn hàng:</strong></p>
        <p><strong>Tổng giá trị đơn hàng:</strong>VNĐ</p>
        
        <h4>Sản phẩm đã mua:</h4>
        
        
        <h4>Thông tin giao hàng:</h4>
        <p><strong>Địa chỉ giao hàng:</strong></p>

        <p>Chúng tôi sẽ gửi thông báo đến bạn khi đơn hàng được giao thành công!</p>
        <div>Cảm ơn bạn đã mua hàng tại PTITSHOP!</div>
    `;
  return result;
};
// let sendAttachment = async (dataSend) => {
//     return new Promise(async (resolve, reject) => {
//         try {
//             let transporter = nodemailer.createTransport({
//                 host: "smtp.gmail.com",
//                 port: 587,
//                 secure: false, // true for 465, false for other ports
//                 auth: {
//                     user: process.env.EMAIL_APP,
//                     pass: process.env.EMAIL_APP_PASSWORD,
//                 },
//             });

//             let info = await transporter.sendMail({
//                 from: '"BiNgo2706 👻" <dotanthanhvlog@gmail.com>', // sender address
//                 to: dataSend.email, // list of receivers
//                 subject: "Thông tin đặt lịch khám bệnh", // Subject line
//                 html: getBodyHTMLEmailRemedy(dataSend),
//                 attachments: [
//                     {
//                         filename: `remedy-${dataSend.patientId}-${new Date().getTime()}.${dataSend.filename}`,
//                         content: dataSend.imgBase64.split("base64,")[1],
//                         encoding: 'base64'
//                     }
//                 ]
//             });
//             resolve()
//         } catch (error) {
//             reject(error)
//         }
//     })
// }
module.exports = {
  sendSimpleEmail: sendSimpleEmail,
  sendSimpleEmaill: sendSimpleEmaill,
};
