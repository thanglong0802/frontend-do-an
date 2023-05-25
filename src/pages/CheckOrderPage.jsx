import { Link } from "react-router-dom";
import km from "../assets/images/khuyen-mai.png";
import Footer from "../layouts/Footer";
import Header from "../layouts/Header";
import { Breadcrumb, Button, Input, Table, message } from "antd";
import { FaUserAlt } from "react-icons/fa";
import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
function CheckOrderPage() {
  const [order, setOrder] = useState([]);
  const [product, setProduct] = useState([]);
  const [messageApi, contextHolder] = message.useMessage();
  const [orderDetail, setOrderDetail] = useState([]);
  const [phone, setPhone] = useState("");
  const [data, setData] = useState([]);
  const columns = [
    {
      title: "Mã đơn hàng",
      dataIndex: "code",
      key: "code",
    },
    {
      title: "Sản phẩm",
      dataIndex: "product",
      key: "product",
    },
    {
      title: "Ngày đặt/Ngày giao",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Số tiền",
      dataIndex: "money",
      key: "money",
    },
    {
      title: "Thông tin người nhận",
      dataIndex: "infor",
      key: "infor",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
    },
  ];

  useEffect(() => {
    axios
      .get("http://localhost:6789/cart")
      .then((res) => {
        setOrder(res.data);
      })
      .catch((error) => console.log(error));

    axios
      .get("http://localhost:6789/order-detail")
      .then((res) => {
        setOrderDetail(res.data);
      })
      .catch((error) => console.log(error));
    axios
      .get("http://localhost:6789/product")
      .then((res) => {
        setProduct(res.data.data);
      })
      .catch((error) => console.log(error));
  }, [data]);
  function findByCartId(id) {
    return order.find((x) => x.id === id);
  }
  function search() {
    const od = orderDetail.filter((x) => x.phone_number === phone);
    let arr = [];
    let cart = {};
    od.forEach((x) => {
      cart = findByCartId(x.cart_id);
      arr.push({
        key: x.id,
        code: x.order_detail_id,
        product: product.find((y) => y.id === cart.product_id)?.name_product,
        date: x.date_order,
        money: `${cart.total_price?.toLocaleString()}đ`,
        infor: x.name_customer,
        status: x.status,
      });
      if (cart) {
        setData(arr);
      }
    });
    if (cart && phone.length > 0) {
      messageApi.success("Tìm kiếm thành công");
    }
    if (phone.length === 0) {
      messageApi.info("Vui lòng nhập số điện thoại");
    }
  }
  return (
    <div>
      <Header />
      {contextHolder}
      <div className="h-10 text-white bg-blue-800 grid grid-cols-5 mx-32">
        <div className="bg-blue-900 py-2 text-center">DANH MỤC SẢN PHẨM</div>
        <div className="col-start-2 col-end-6 grid grid-cols-4">
          <div className="flex justify-center items-center">
            <img src={km} alt="khuyen-mai" />
          </div>
          <div className="py-2 px-7">BẢNG TIN SIÊU THỊ Y TÊ</div>
          <div className="py-2 px-7">CHUYÊN MỤC SỨC KHỎE</div>
          <div className="py-2 px-7">
            <Link to={"/check-order"} className="no-underline text-white">
              KIỂM TRA ĐƠN HÀNG
            </Link>
          </div>
        </div>
      </div>
      <div className="h-1 bg-blue-950" style={{ marginTop: "-3px" }}></div>
      <div className="mx-32 py-2">
        <Breadcrumb
          separator=">"
          items={[
            {
              title: <Link to={"/"}>Trang chủ</Link>,
            },
            {
              title: "Kiểm tra đơn hàng",
            },
          ]}
        />
      </div>
      <div className="mx-32 mt-4">
        <div className="font-bold">
          <span className="me-2">
            <FaUserAlt />
          </span>
          NHẬP THÔNG TIN NGƯỜI MUA HÀNG ĐỂ KIỂM TRA ĐƠN HÀNG
        </div>
        <div className="mt-6 text-center">
          <Input
            placeholder="Tìm kiếm theo số điện thoại"
            size="large"
            style={{
              width: 400,
            }}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <Button
            type="primary"
            size="large"
            className="mx-3 bg-orange-500"
            onClick={() => search()}
          >
            KIỂM TRA
          </Button>
        </div>
        <div className="my-6">
          <Table columns={columns} dataSource={data} />
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default CheckOrderPage;
