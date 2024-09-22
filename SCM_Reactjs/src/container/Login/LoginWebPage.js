import { FacebookAuthProvider, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import React, { useState } from "react";
import { useHistory } from "react-router";
import { FacebookLoginButton, GoogleLoginButton } from "react-social-login-buttons";
import { toast } from 'react-toastify';
import { checkPhonenumberEmail, createNewUser, handleLoginService } from '../../services/userService';
import { authentication } from "../../utils/firebase";
import './LoginWebPage.css';
import Otp from "./Otp";
const LoginWebPage = () => {

    const [inputValues, setInputValues] = useState({
        email: '', password: 'passwordsecrect', lastName: '', phonenumber: '', isOpen: false, dataUser: {}
    });
    let history = useHistory()
    const handleOnChange = event => {
        const { name, value } = event.target;
        setInputValues({ ...inputValues, [name]: value });

    };
    let handleLogin = async () => {
        const element = document.querySelector('form');
        element.addEventListener('submit', event => {
            event.preventDefault();

        });
        let res = await handleLoginService({
            email: inputValues.email,
            password: inputValues.password
        })


        if (res && res.errCode === 0) {


            localStorage.setItem("userData", JSON.stringify(res.user))
            localStorage.setItem("token", JSON.stringify(res.accessToken))
            if (res.user.roleId === "R1" || res.user.roleId === "R4") {
                window.location.href = "/admin"

            }
            else {
                window.location.href = "/"
            }
        }
        else {
            toast.error(res.errMessage)
        }
    }
    let handleLoginSocial = async (email) => {
        const element = document.querySelector('form');
        element.addEventListener('submit', event => {
            event.preventDefault();

        });
        let res = await handleLoginService({
            email: email,
            password: inputValues.password
        })


        if (res && res.errCode === 0) {


            localStorage.setItem("userData", JSON.stringify(res.user))
            localStorage.setItem("token", JSON.stringify(res.accessToken))
            if (res.user.roleId === "R1" || res.user.roleId === "R4") {
                window.location.href = "/admin"

            }
            else {
                window.location.href = "/"
            }
        }
        else {
            toast.error(res.errMessage)
        }
    }

    let handleSaveUser = async () => {
        const element = document.querySelector('form');
        element.addEventListener('submit', event => {
            event.preventDefault();

        });
        let res = await checkPhonenumberEmail({
            phonenumber: inputValues.phonenumber,
            email: inputValues.email
        })
        if (res.isCheck === true) {
            toast.error(res.errMessage)
        } else {
            setInputValues({
                ...inputValues, ["dataUser"]:
                {
                    email: inputValues.email,
                    lastName: inputValues.lastName,
                    phonenumber: inputValues.phonenumber,
                    password: inputValues.password,
                    roleId: 'R2',
                }, ["isOpen"]: true
            })
        }


    }
    const getBase64FromUrl = async (url) => {

        const data = await fetch(url);
        const blob = await data.blob();
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onloadend = () => {
                const base64data = reader.result;
                resolve(base64data);
            }
        });
    }
    let signInwithFacebook = () => {
        const provider = new FacebookAuthProvider()
        signInWithPopup(authentication, provider)
            .then((re) => {

                LoginWithSocial(re)

            })
            .catch((err) => {
                console.log(err.message)
            })
    }
    let LoginWithSocial = async (re) => {
        let res = await checkPhonenumberEmail({
            phonenumber: re.user.providerData[0].phoneNumber,
            email: re.user.providerData[0].email
        })

        if (res.isCheck === true) {
            setInputValues({
                ...inputValues,
                ["email"]: re.user.providerData[0].email,


            })
            handleLoginSocial(re.user.providerData[0].email)

        } else {
            getBase64FromUrl(re.user.providerData[0].photoURL).then(async (value) => {

                let res = await createNewUser({


                    email: re.user.providerData[0].email,
                    lastName: re.user.providerData[0].displayName,
                    phonenumber: re.user.providerData[0].phoneNumber,
                    avatar: value,
                    roleId: "R2",
                    password: inputValues.password
                })
                if (res && res.errCode === 0) {
                    toast.success("Tạo tài khoản thành công")
                    handleLoginSocial(re.user.providerData[0].email)


                } else {
                    toast.error(res.errMessage)
                }
            })


        }
    }
    let signInwithGoogle = async () => {
        const provider = new GoogleAuthProvider()
        signInWithPopup(authentication, provider)
            .then(async (re) => {

                LoginWithSocial(re)

            })
            .catch((err) => {
                console.log(err.message)
            })
    }

    return (
        <>
            {inputValues.isOpen === false &&
                <div className="box-login">
                    <div className="login-container">
                        <section id="formHolder">
                            <div className="row">
                                {/* Brand Box */}
                                <div className="col-sm-6 brand">
                                    <a href="#" className="logo">MR <span>.</span></a>
                                    <div className="heading">
                                        <h2>HT</h2>
                                        <p>Sự lựa chọn của bạn</p>
                                    </div>

                                </div>
                                {/* Form Box */}
                                <div className="col-sm-6 form">
                                    {/* Login Form */}
                                    <div className="login form-peice ">
                                        <form className="login-form" >
                                            <div className="form-group">
                                                <label htmlFor="loginemail">Địa chỉ email</label>
                                                <input name="email" onChange={(event) => handleOnChange(event)} type="email" id="loginemail" required />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="loginPassword">Mật khẩu</label>
                                                <input name="password" onChange={(event) => handleOnChange(event)} type="password" id="loginPassword" required />
                                            </div>
                                            <div className="CTA">
                                                <input onClick={() => handleLogin()} type="submit" value="Đăng nhập" />
                                                <a style={{ cursor: 'pointer', }} className="switch"></a>
                                            </div>
                                            <FacebookLoginButton text="Đăng nhập với Facebook" iconSize="25px" style={{ width: "300px", height: "40px", fontSize: "16px", marginTop: "40px", marginBottom: "10px" }} onClick={() => signInwithFacebook()} />
                                            <GoogleLoginButton text="Đăng nhập với Google" iconSize="25px" style={{ width: "300px", height: "40px", fontSize: "16px" }} onClick={() => signInwithGoogle()} />
                                        </form>
                                    </div>{/* End Login Form */}
                                    {/* Signup Form */}
                                   
                                </div>
                            </div>
                        </section>

                    </div>


                </div>
            }


            {inputValues.isOpen === true &&
                <Otp dataUser={inputValues.dataUser} />
            }
        </>
    )

}
export default LoginWebPage;