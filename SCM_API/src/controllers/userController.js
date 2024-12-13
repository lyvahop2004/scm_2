import emailService from "../services/emailService";
import userService from "../services/userService";

let handleCreateNewUser = async (req, res) => {
  try {
    let data = await userService.handleCreateNewUser(req.body);
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from server",
    });
  }
};
let handleUpdateUser = async (req, res) => {
  try {
    let data = await userService.updateUserData(req.body);
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from server",
    });
  }
};
let handleDeleteUser = async (req, res) => {
  try {
    let data = await userService.deleteUser(req.body.id);
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from server",
    });
  }
};
let handleLogin = async (req, res) => {
  try {
    let data = await userService.handleLogin(req.body);
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from server",
    });
  }
};
let handleChangePassword = async (req, res) => {
  try {
    let data = await userService.handleChangePassword(req.body);
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from server",
    });
  }
};
let getAllUser = async (req, res) => {
  try {
    let data = await userService.getAllUser(req.query);
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from server",
    });
  }
};
let getDetailUserById = async (req, res) => {
  try {
    let data = await userService.getDetailUserById(req.query.id);
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from server",
    });
  }
};
let getDetailUserByEmail = async (req, res) => {
  try {
    let data = await userService.getDetailUserByEmail(req.query.email);
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from server",
    });
  }
};
let handleSendVerifyEmailUser = async (req, res) => {
  try {
    let data = await userService.handleSendVerifyEmailUser(req.body);
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from server",
    });
  }
};
let handleVerifyEmailUser = async (req, res) => {
  try {
    let data = await userService.handleVerifyEmailUser(req.body);
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from server",
    });
  }
};
let handleSendEmailForgotPassword = async (req, res) => {
  try {
    let data = await userService.handleSendEmailForgotPassword(req.body.email);
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from server",
    });
  }
};
let handleForgotPassword = async (req, res) => {
  try {
    let data = await userService.handleForgotPassword(req.body);
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from server",
    });
  }
};
let checkPhonenumberEmail = async (req, res) => {
  try {
    let data = await userService.checkPhonenumberEmail(req.query);
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from server",
    });
  }
};

//hàm gửi email xác nhận đonehnagf
let handleSendOrderConfirmation = async (req, res) => {
  try {
    let orderData = req.body; // Nhận dữ liệu đơn hàng từ client
    console.log("Received order data:", orderData);
    let result = await userService.sendOrderEmail(orderData);

    if (result.errCode === 0) {
      return res.status(200).json({ message: result.errMessage });
    } else {
      return res.status(400).json({ message: result.errMessage });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Lỗi từ server",
    });
  }
};

module.exports = {
  handleCreateNewUser: handleCreateNewUser,
  handleUpdateUser: handleUpdateUser,
  handleDeleteUser: handleDeleteUser,
  handleLogin: handleLogin,
  handleChangePassword: handleChangePassword,
  getAllUser: getAllUser,
  getDetailUserById: getDetailUserById,
  handleSendVerifyEmailUser: handleSendVerifyEmailUser,
  handleVerifyEmailUser: handleVerifyEmailUser,
  handleSendEmailForgotPassword: handleSendEmailForgotPassword,
  handleForgotPassword: handleForgotPassword,
  checkPhonenumberEmail: checkPhonenumberEmail,
  // hopthem
  handleSendOrderConfirmation: handleSendOrderConfirmation,
  getDetailUserByEmail: getDetailUserByEmail,
};
