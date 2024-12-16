import orderService from "../services/orderService";
const { sendOrderEmail } = require("../mailer/mailer");
let createNewOrder = async (req, res) => {
  try {
    let data = await orderService.createNewOrder(req.body);
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from server",
    });
  }
};
let getAllOrders = async (req, res) => {
  try {
    let data = await orderService.getAllOrders(req.query);
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from server",
    });
  }
};
let getDetailOrderById = async (req, res) => {
  try {
    let data = await orderService.getDetailOrderById(req.query.id);
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from server",
    });
  }
};
let updateStatusOrder = async (req, res) => {
  try {
    let data = await orderService.updateStatusOrder(req.body);
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from server",
    });
  }
};
let getAllOrdersByUser = async (req, res) => {
  try {
    let data = await orderService.getAllOrdersByUser(req.query.userId);
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from server",
    });
  }
};
let paymentOrder = async (req, res) => {
  try {
    let data = await orderService.paymentOrder(req.body);
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from server",
    });
  }
};
let paymentOrderSuccess = async (req, res) => {
  try {
    let data = await orderService.paymentOrderSuccess(req.body);
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from server",
    });
  }
};
let paymentOrderVnpaySuccess = async (req, res) => {
  try {
    let data = await orderService.paymentOrderVnpaySuccess(req.body);
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from server",
    });
  }
};
let confirmOrder = async (req, res) => {
  try {
    let data = await orderService.confirmOrder(req.body);
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from server",
    });
  }
};
let getAllOrdersByShipper = async (req, res) => {
  try {
    let data = await orderService.getAllOrdersByShipper(req.query);
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from server",
    });
  }
};
let paymentOrderVnpay = async (req, res) => {
  try {
    let data = await orderService.paymentOrderVnpay(req);
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from server",
    });
  }
};
let confirmOrderVnpay = async (req, res) => {
  try {
    let data = await orderService.confirmOrderVnpay(req.body);
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from server",
    });
  }
};
let updateImageOrder = async (req, res) => {
  try {
    let data = await orderService.updateImageOrder(req.body);
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from server",
    });
  }
};
// API nhận thông tin đơn hàng và gửi email
// let sendOrderEmailToUser = async (req, res) => {
//   const { userEmail, orderDetails } = req.body; // Nhận dữ liệu từ frontend

//   try {
//     // Gửi email với dữ liệu đơn hàng
//     await sendOrderEmail(userEmail, orderDetails);
//     return res.status(200).json({
//       errCode: 0,
//       errMessage: "Email đã được gửi thành công",
//     });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({
//       errCode: -1,
//       errMessage: "Lỗi khi gửi email: " + error.message,
//     });
//   }
// };
let sendOrderConfirmationEmail = async (req, res) => {
  const { userEmail, orderDetails } = req.body; // Nhận dữ liệu từ frontend

  try {
    await sendOrderEmail(userEmail, orderDetails); // Gửi email
    res.status(200).send("Email đã được gửi thành công");
  } catch (error) {
    console.log(error);
    res.status(500).send("Lỗi khi gửi email: " + error.message);
  }
};

// async function sendOrderEmail(userEmail, orderDetails) {
//   try {
//     const mailOptions = {
//       from: "Your Name <your_email@gmail.com>",
//       to: userEmail,
//       subject: "Xác nhận đơn hàng",
//       text: `Xin chào ${userEmail}, đơn hàng của bạn đã được đặt thành công. \n\n Chi tiết đơn hàng: ${JSON.stringify(
//         orderDetails
//       )}`,
//     };

//     await transporter.sendMail(mailOptions);
//     console.log("Email gửi thành công!");
//   } catch (error) {
//     console.error("Lỗi khi gửi email:", error);
//   }
// }

module.exports = {
  createNewOrder: createNewOrder,
  getAllOrders: getAllOrders,
  getDetailOrderById: getDetailOrderById,
  updateStatusOrder: updateStatusOrder,
  getAllOrdersByUser: getAllOrdersByUser,
  paymentOrder: paymentOrder,
  paymentOrderSuccess: paymentOrderSuccess,
  confirmOrder: confirmOrder,
  getAllOrdersByShipper: getAllOrdersByShipper,
  paymentOrderVnpay: paymentOrderVnpay,
  confirmOrderVnpay: confirmOrderVnpay,
  paymentOrderVnpaySuccess: paymentOrderVnpaySuccess,
  updateImageOrder: updateImageOrder,
  sendOrderConfirmationEmail: sendOrderConfirmationEmail,
};
