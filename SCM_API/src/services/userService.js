import db from "../models/index";
import bcrypt from "bcryptjs";
import emailService from "./emailService";
import { v4 as uuidv4 } from "uuid";
import CommonUtils from "../utils/CommonUtils";
const { Op } = require("sequelize");
require("dotenv").config();
const salt = bcrypt.genSaltSync(10);

let buildUrlEmail = (token, userId) => {
  let result = `${process.env.URL_REACT}/verify-email?token=${token}&userId=${userId}`;
  return result;
};

let hashUserPasswordFromBcrypt = (password) => {
  return new Promise(async (resolve, reject) => {
    try {
      let hashPassword = await bcrypt.hashSync(password, salt);
      resolve(hashPassword);
    } catch (error) {
      reject(error);
    }
  });
};
let checkUserEmail = (userEmail) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await db.User.findOne({
        where: { email: userEmail },
      });
      if (user) {
        resolve(true);
      } else {
        resolve(false);
      }
    } catch (error) {
      reject(error);
    }
  });
};
let checkUserPhoneNumber = (phoneNumber) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await db.User.findOne({
        where: { phonenumber: phoneNumber },
      });
      if (user) {
        resolve(true); // Số điện thoại đã tồn tại
      } else {
        resolve(false); // Số điện thoại chưa tồn tại
      }
    } catch (error) {
      reject(error); // Bắt lỗi và trả về nếu có lỗi xảy ra
    }
  });
};
let handleCreateNewUser = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Kiểm tra các tham số bắt buộc
      if (!data.email || !data.lastName || !data.phonenumber) {
        resolve({
          errCode: 2,
          errMessage: "Missing required parameters!",
        });
      } else {
        // Kiểm tra email đã tồn tại chưa
        let isEmailExists = await checkUserEmail(data.email);
        if (isEmailExists === true) {
          resolve({
            errCode: 1,
            errMessage:
              "Email của bạn đã được sử dụng, vui lòng thử email khác",
          });
        } else {
          // Kiểm tra số điện thoại đã tồn tại chưa
          let isPhoneExists = await checkUserPhoneNumber(data.phonenumber);
          if (isPhoneExists === true) {
            resolve({
              errCode: 1,
              errMessage:
                "Số điện thoại đã được sử dụng, vui lòng thử số khác!",
            });
          } else {
            // Mã hóa mật khẩu
            let hashPassword = await hashUserPasswordFromBcrypt(data.password);

            // Tạo người dùng mới trong cơ sở dữ liệu
            await db.User.create({
              email: data.email,
              password: hashPassword,
              firstName: data.firstName,
              lastName: data.lastName,
              address: data.address,
              roleId: data.roleId,
              genderId: data.genderId,
              phonenumber: data.phonenumber,
              image: data.avatar,
              dob: data.dob,
              isActiveEmail: 0, // Email chưa kích hoạt
              statusId: "S1", // Trạng thái mặc định
              usertoken: "", // Token ban đầu rỗng
            });

            // Trả về kết quả thành công
            resolve({
              errCode: 0,
              message: "OK",
            });
          }
        }
      }
    } catch (error) {
      reject(error);
    }
  });
};

let deleteUser = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!userId) {
        resolve({
          errCode: 1,
          errMessage: `Missing required parameters !`,
        });
      } else {
        let foundUser = await db.User.findOne({
          where: { id: userId },
        });
        if (!foundUser) {
          resolve({
            errCode: 2,
            errMessage: `The user isn't exist`,
          });
        }
        await db.User.destroy({
          where: { id: userId },
        });
        resolve({
          errCode: 0,
          message: `The user is deleted`,
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};
let updateUserData = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.id || !data.genderId) {
        resolve({
          errCode: 2,
          errMessage: `Missing required parameters`,
        });
      } else {
        let user = await db.User.findOne({
          where: { id: data.id },
          raw: false,
        });
        if (user) {
          user.firstName = data.firstName;
          user.lastName = data.lastName;
          user.address = data.address;
          user.roleId = data.roleId;
          user.genderId = data.genderId;
          user.phonenumber = data.phonenumber;
          user.dob = data.dob;
          if (data.image) {
            user.image = data.image;
          }
          await user.save();
          resolve({
            errCode: 0,
            errMessage: "Update the user succeeds!",
          });
        } else {
          resolve({
            errCode: 1,
            errMessage: "User not found!",
          });
        }
      }
    } catch (error) {
      reject(error);
    }
  });
};
let handleLogin = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.email || !data.password) {
        resolve({
          errCode: 4,
          errMessage: "Missing required parameters!",
        });
      } else {
        let userData = {};

        let isExist = await checkUserEmail(data.email);

        if (isExist === true) {
          let user = await db.User.findOne({
            attributes: [
              "email",
              "roleId",
              "password",
              "firstName",
              "lastName",
              "id",
            ],
            where: { email: data.email, statusId: "S1" },
            raw: true,
          });
          if (user) {
            let check = await bcrypt.compareSync(data.password, user.password);
            if (check) {
              userData.errCode = 0;
              userData.errMessage = "Ok";

              delete user.password;

              userData.user = user;
              userData.accessToken = CommonUtils.encodeToken(user.id);
            } else {
              userData.errCode = 3;

              userData.errMessage = "Wrong password";
            }
          } else {
            userData.errCode = 2;
            userData.errMessage = "User not found!";
          }
        } else {
          userData.errCode = 1;
          userData.errMessage = `Your's email isn't exist in your system. plz try other email`;
        }
        resolve(userData);
      }
    } catch (error) {
      reject(error);
    }
  });
};
let handleChangePassword = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.id || !data.password || !data.oldpassword) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameter!",
        });
      } else {
        let user = await db.User.findOne({
          where: { id: data.id },
          raw: false,
        });
        if (await bcrypt.compareSync(data.oldpassword, user.password)) {
          if (user) {
            user.password = await hashUserPasswordFromBcrypt(data.password);
            await user.save();
          }
          resolve({
            errCode: 0,
            errMessage: "ok",
          });
        } else {
          resolve({
            errCode: 2,
            errMessage: "Mật khẩu cũ không chính xác",
          });
        }
      }
    } catch (error) {
      reject(error);
    }
  });
};
let getAllUser = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let objectFilter = {
        where: { statusId: "S1" },
        attributes: {
          exclude: ["password", "image"],
        },
        include: [
          { model: db.Allcode, as: "roleData", attributes: ["value", "code"] },
          {
            model: db.Allcode,
            as: "genderData",
            attributes: ["value", "code"],
          },
        ],
        raw: true,
        nest: true,
      };
      if (data.limit && data.offset) {
        objectFilter.limit = +data.limit;
        objectFilter.offset = +data.offset;
      }
      if (data.keyword !== "")
        objectFilter.where = {
          ...objectFilter.where,
          phonenumber: { [Op.substring]: data.keyword },
        };
      let res = await db.User.findAndCountAll(objectFilter);
      resolve({
        errCode: 0,
        data: res.rows,
        count: res.count,
      });
    } catch (error) {
      reject(error);
    }
  });
};
let getDetailUserById = (userid) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!userid) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameters!",
        });
      } else {
        let res = await db.User.findOne({
          where: { id: userid, statusId: "S1" },
          attributes: {
            exclude: ["password"],
          },
          include: [
            {
              model: db.Allcode,
              as: "roleData",
              attributes: ["value", "code"],
            },
            {
              model: db.Allcode,
              as: "genderData",
              attributes: ["value", "code"],
            },
          ],
          raw: true,
          nest: true,
        });
        if (res.image) {
          res.image = new Buffer(res.image, "base64").toString("binary");
        }
        resolve({
          errCode: 0,
          data: res,
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};
let getDetailUserByEmail = (email) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!email) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameters!",
        });
      } else {
        let res = await db.User.findOne({
          where: { id: userid, statusId: "S1" },
          attributes: ["password"],
        });
        resolve({
          errCode: 0,
          data: res,
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};
let handleSendVerifyEmailUser = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.id) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameter!",
        });
      } else {
        let user = await db.User.findOne({
          where: { id: data.id },
          attributes: {
            exclude: ["password"],
          },
          raw: false,
        });

        if (user) {
          let token = uuidv4();
          user.usertoken = token;
          await emailService.sendSimpleEmail({
            firstName: user.firstName,
            lastName: user.lastName,
            redirectLink: buildUrlEmail(token, user.id),
            email: user.email,
            type: "verifyEmail",
          });
          await user.save();
        }
        resolve({
          errCode: 0,
          errMessage: "ok",
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};
let handleVerifyEmailUser = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.id || !data.token) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameter!",
        });
      } else {
        let user = await db.User.findOne({
          where: {
            id: data.id,
            usertoken: data.token,
          },
          attributes: {
            exclude: ["password"],
          },
          raw: false,
        });

        if (user) {
          user.isActiveEmail = 1;
          user.usertoken = "";

          await user.save();
          resolve({
            errCode: 0,
            errMessage: "ok",
          });
        } else {
          resolve({
            errCode: 2,
            errMessage: "User not found!",
          });
        }
      }
    } catch (error) {
      reject(error);
    }
  });
};
let handleSendEmailForgotPassword = (email) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!email) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameter!",
        });
      } else {
        let check = await checkUserEmail(email);
        if (check === true) {
          let user = await db.User.findOne({
            where: { email: email },
            attributes: {
              exclude: ["password"],
            },
            raw: false,
          });

          if (user) {
            let token = uuidv4();
            user.usertoken = token;
            await emailService.sendSimpleEmail({
              firstName: user.firstName,
              lastName: user.lastName,
              redirectLink: `${process.env.URL_REACT}/verify-forgotpassword?token=${token}&userId=${user.id}`,
              email: user.email,
              type: "forgotpassword",
            });
            await user.save();
          }
          resolve({
            errCode: 0,
            errMessage: "ok",
          });
        } else {
          resolve({
            errCode: 2,
            errMessage: `Your's email isn't exist in your system. plz try other email`,
          });
        }
      }
    } catch (error) {
      reject(error);
    }
  });
};
let handleForgotPassword = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.id || !data.token || !data.password) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameter!",
        });
      } else {
        let user = await db.User.findOne({
          where: {
            id: data.id,
            usertoken: data.token,
          },
          attributes: {
            exclude: ["password"],
          },
          raw: false,
        });

        if (user) {
          user.password = await hashUserPasswordFromBcrypt(data.password);
          user.usertoken = "";

          await user.save();
        }
        resolve({
          errCode: 0,
          errMessage: "ok",
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};
let checkPhonenumberEmail = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let phone = await db.User.findOne({
        where: { phonenumber: data.phonenumber },
      });
      let email = await db.User.findOne({
        where: { email: data.email },
      });
      if (phone) {
        resolve({
          isCheck: true,
          errMessage: "Số điện thoại đã tồn tại",
        });
      }
      if (email) {
        resolve({
          isCheck: true,
          errMessage: "Email đã tồn tại",
        });
      }

      resolve({
        isCheck: false,
        errMessage: "Hợp lệ",
      });
    } catch (error) {
      reject(error);
    }
  });
};
// hợp thêm
let sendOrderEmail = async (orderData) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Kiểm tra nếu dữ liệu đơn hàng không đầy đủ
      if (!orderData || !orderData.email) {
        resolve({
          errCode: 1,
          errMessage:
            "Thiếu tham số bắt buộc (dữ liệu email hoặc đơn đặt hàng)!",
        });
      } else {
        // Gửi email xác nhận đơn hàng
        await emailService.sendSimpleEmaill({
          firstName: orderData.firstName,
          lastName: orderData.lastName,
          email: orderData.email,
          type: "guiemaildonhang",
          redirectLink: `${process.env.URL_REACT}/xacnhandonhang-email?orderId=${orderData.orderId}`,
          // email: orderData.email,
          // type: "verifyEmail",
          // type: "guiemaildonhang", // Loại email xác nhận đơn hàng
          // content: emailContent, // Nội dung email xác nhận đơn hàng
        });

        resolve({
          errCode: 0,
          errMessage: "Email xác nhận đã được gửi thành công!",
        });
      }
    } catch (error) {
      console.error("Error sending order email:", error);
      reject({
        errCode: 3,
        errMessage: "An error occurred while sending the email.",
      });
    }
  });
};

// hợp thêm
module.exports = {
  handleCreateNewUser: handleCreateNewUser,
  deleteUser: deleteUser,
  updateUserData: updateUserData,
  handleLogin: handleLogin,
  handleChangePassword: handleChangePassword,
  getAllUser: getAllUser,
  getDetailUserById: getDetailUserById,
  handleSendVerifyEmailUser: handleSendVerifyEmailUser,
  handleVerifyEmailUser: handleVerifyEmailUser,
  handleSendEmailForgotPassword: handleSendEmailForgotPassword,
  handleForgotPassword: handleForgotPassword,
  checkPhonenumberEmail: checkPhonenumberEmail,
  sendOrderEmail: sendOrderEmail,
};
