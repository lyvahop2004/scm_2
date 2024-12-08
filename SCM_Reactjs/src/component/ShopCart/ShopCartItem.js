import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { getItemCartStart } from "../../action/ShopCartAction";
import {
  addShopCartService,
  deleteItemShopCartService,
} from "../../services/userService";
import DeleteShopCartModal from "../../container/ShopCart/DeleteShopCartModal";
import CommonUtils from "../../utils/CommonUtils";
function ShopCartItem(props) {
  const [quantity, setquantity] = useState("");
  const [isOpenModal, setisOpenModal] = useState(false);
  const dispatch = useDispatch();
  const handleOnChange = async (event) => {
    const newQuantity = parseInt(event.target.value, 10);

    // Cập nhật số lượng trong state
    setquantity(newQuantity);

    // Kiểm tra nếu số lượng bằng 0, hiển thị modal cảnh báo
    if (newQuantity === 0) {
      setisOpenModal(true);
      return;
    }

    // Nếu giá trị hợp lệ, gửi yêu cầu cập nhật
    if (newQuantity > 0) {
      try {
        const res = await addShopCartService({
          type: "UPDATE_QUANTITY",
          userId: props.userId,
          productdetailsizeId: props.productdetailsizeId,
          quantity: newQuantity,
        });

        if (res && res.errCode === 0) {
          // Thành công, cập nhật lại danh sách giỏ hàng
          dispatch(getItemCartStart(props.userId));
        } else {
          // Thông báo lỗi nếu API trả về lỗi
          toast.error(res.errMessage);
          setquantity(res.quantity); // Khôi phục giá trị cũ nếu lỗi
        }
      } catch (error) {
        // Xử lý lỗi khi gọi API
        console.error("Error updating cart quantity:", error);
        toast.error(
          "Đã xảy ra lỗi khi cập nhật giỏ hàng. Vui lòng thử lại sau."
        );
      }
    } else {
      // Nếu giá trị không hợp lệ
      toast.error("Số lượng không hợp lệ.");
      setquantity(1); // Đặt lại số lượng về mặc định nếu cần
    }
  };
  useEffect(() => {
    setquantity(props.quantity);
  }, [props.quantity]);
  let closeModal = () => {
    setisOpenModal(false);
    setquantity(1);
  };
  let handleDeleteShopCart = async () => {
    let res = await deleteItemShopCartService({
      data: {
        id: props.id,
      },
    });
    if (res && res.errCode === 0) {
      dispatch(getItemCartStart(props.userId));
      setisOpenModal(false);
    } else {
      toast.error(res.errMessage);
    }
  };
  return (
    <tr>
      <td>
        <div className="media">
          <div className="d-flex">
            <img
              style={{ width: "147px", height: "100px", objectFit: "cover" }}
              src={props.image}
              alt=""
            />
          </div>
          <div className="media-body">
            <p className="text-justify">{props.name} </p>
          </div>
        </div>
      </td>
      <td>
        <h5>{CommonUtils.formatter.format(props.price)}</h5>
      </td>
      <td style={{ textAlign: "center" }}>
        {props.isOrder === true ? (
          <span>{quantity}</span>
        ) : (
          <div className="product_count">
            {/* <input type="text" name="qty" id="sst" maxLength={12} defaultValue={1} title="Quantity:" className="input-text qty" /> */}
            <input
              type="number"
              name="qty"
              id="sst"
              value={quantity}
              title="Quantity:"
              className="input-text qty"
              onChange={(event) => handleOnChange(event)}
            />
          </div>
        )}
      </td>
      <td style={{ textAlign: "center" }}>
        <h5 style={{ color: "#71cd14" }}>
          {CommonUtils.formatter.format(quantity * props.price)}
        </h5>
      </td>
      {props.isOrder === false && (
        <>
          <td className="link-delete" onClick={() => setisOpenModal(true)}>
            Xóa
          </td>
          <DeleteShopCartModal
            handleDeleteShopCart={handleDeleteShopCart}
            name={props.name}
            isOpenModal={isOpenModal}
            closeModal={closeModal}
          />
        </>
      )}
    </tr>
  );
}

export default ShopCartItem;
