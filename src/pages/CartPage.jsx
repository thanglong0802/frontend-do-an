import { Breadcrumb, Button, Input, InputNumber, Table, message } from "antd";
import TextArea from "antd/es/input/TextArea";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import km from "../assets/images/khuyen-mai.png";
import img from "../assets/images/may-tao-oxy-5-lit-reiwa-k5bw-14022023.jpg";
import Footer from "../layouts/Footer";
import Header from "../layouts/Header";

const columns = [
  {
    title: "Tên sản phẩm",
    dataIndex: "name",
  },
  {
    title: "Đơn giá",
    dataIndex: "price",
  },
  {
    title: "Số lượng",
    dataIndex: "quantity",
  },
  {
    title: "Số tiền",
    dataIndex: "total",
  },
  {
    title: "Thao tác",
    dataIndex: "action",
  },
];
function CartPage() {
  const [messageApi, contextHolder] = message.useMessage();
  const [flag, setFlag] = useState(false);
  const [list, setList] = useState([]);
  const [listKey, setListKey] = useState([]);
  const [info, setInfo] = useState({
    address: "",
    name_customer: "",
    phone_number: "",
  });
  const [product, setProduct] = useState([]);

  const arr = [];
  useEffect(() => {
    if (JSON.parse(localStorage.getItem("listOrder"))) {
      setList(JSON.parse(localStorage.getItem("listOrder")));
    }
    axios
      .get(`http://localhost:6789/product`)
      .then((res) => {
        setProduct(res.data.data);
      })
      .catch((error) => console.log(error));
    // eslint-disable-next-line
  }, [flag]);

  let totalMoney = JSON.parse(localStorage.getItem("listOrder"))
    ? (
        Math.floor(
          listKey.reduce(
            (n, { cart_create_request }) =>
              n +
              (((100 -
                product.find((y) => y.id === cart_create_request?.product_id)
                  ?.promotional_price) *
                product.find((y) => y.id === cart_create_request?.product_id)
                  ?.price) /
                100) *
                cart_create_request?.quantity_product,
            0
          ) / 1000
        ) * 1000
      ).toLocaleString()
    : 0;
  function deleteById(id) {
    setList(list.filter((x) => x.cart_create_request?.product_id !== id));
    window.localStorage.setItem(
      "listOrder",
      JSON.stringify(
        list.filter((x) => x.cart_create_request.product_id !== id)
      )
    );
  }
  function deleteAll() {
    setList([]);
    window.localStorage.setItem("listOrder", JSON.stringify([]));
    messageApi.success("Xóa thành công");
  }
  function changeQuantity(value, id) {
    const prod = product.find((x) => x.id === id);
    const index = list.findIndex(
      (z) => z.cart_create_request?.product_id === id
    );
    list[index] = {
      address: "",
      name_customer: "",
      phone_number: "",
      cart_create_request: {
        product_id: id,
        quantity_product: value,
        total_price: value * prod.price,
      },
    };
    setList(list);
    window.localStorage.setItem("listOrder", JSON.stringify(list));
    setFlag(!flag);
  }
  list.forEach((x) => {
    arr.push({
      key: x.cart_create_request?.product_id,
      name: (
        <div className="flex">
          <Link to={`/details/${x.cart_create_request?.product_id}`}>
            <img
              src={img}
              alt={
                product.find((y) => y.id === x.cart_create_request?.product_id)
                  ?.name_product
              }
              width={50}
              className="rounded-md mr-2"
            />
            <p className="line-clamp-1 capitalize">
              {
                product.find((y) => y.id === x.cart_create_request?.product_id)
                  ?.name_product
              }
            </p>
          </Link>
        </div>
      ),
      price: `${(
        Math.floor(
          ((100 -
            product.find((y) => y.id === x.cart_create_request?.product_id)
              ?.promotional_price) *
            product.find((y) => y.id === x.cart_create_request?.product_id)
              ?.price) /
            100 /
            1000
        ) * 1000
      ).toLocaleString()}đ`,
      quantity: (
        <InputNumber
          min={1}
          defaultValue={x.cart_create_request?.quantity_product}
          onChange={(value) =>
            changeQuantity(value, x.cart_create_request?.product_id)
          }
        />
      ),
      total: `${(
        Math.floor(
          ((100 -
            product.find((y) => y.id === x.cart_create_request?.product_id)
              ?.promotional_price) *
            product.find((y) => y.id === x.cart_create_request?.product_id)
              ?.price) /
            100 /
            1000
        ) *
        1000 *
        x.cart_create_request?.quantity_product
      ).toLocaleString()}đ`,
      action: (
        <div
          className="cursor-pointer"
          onClick={() => deleteById(x.cart_create_request?.product_id)}
        >
          Xóa
        </div>
      ),
    });
  });
  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      const arr2 = [];
      selectedRows.forEach((x) => {
        arr2.push(
          list.find((y) => y.cart_create_request?.product_id === x.key)
        );
      });
      setListKey(arr2);
    },
  };
  function saveCart() {
    const newList = listKey.map((x) => ({
      ...x,
      address: info.address,
      name_customer: info.name_customer,
      phone_number: info.phone_number,
    }));
    window.localStorage.setItem("listOrder", JSON.stringify(newList));
    setInfo({
      address: "",
      name_customer: "",
      phone_number: "",
    });
    newList.forEach((x) => {
      axios
        .post("http://localhost:6789/order-detail/new-cart", x)
        .then((res) => {
          if (res.status === 200) {
            messageApi.success("Bạn đã đặt đơn hàng thành công");
            window.localStorage.removeItem("listOrder");
            setList([]);
          }
        })
        .catch((error) => {
          messageApi.error("Đặt đơn hàng không thành công");
          console.log(error);
        });
    });
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
              title: "Giỏ hàng",
            },
          ]}
        />
      </div>
      <div className="grid grid-cols-7 gap-4 mx-32">
        <div className="col-start-1 col-end-6">
          <div className="mt-4">
            <Table
              rowSelection={{
                type: "checkbox",
                ...rowSelection,
              }}
              columns={columns}
              pagination={{
                pageSize: 3,
              }}
              dataSource={arr}
            />
          </div>
          <div className="mt-6 grid grid-cols-2 bg-zinc-50 p-4">
            <div className="flex justify-start items-center font-bold">
              Tổng tiền :{" "}
              <span className="text-red-600 mx-2">{totalMoney}đ</span>
            </div>
            {arr.length > 0 ? (
              <div className="col-start-3">
                <Button type="primary" danger onClick={() => deleteAll()}>
                  Xóa hết
                </Button>
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
        <div className="bg-slate-100 rounded-md col-start-6 col-end-8 p-4 max-h-96">
          <div className="font-bold text-center mb-2">THÔNG TIN KHÁCH HÀNG</div>
          <div className="mt-3">
            <div>
              <label>Họ và tên</label>
              <Input
                size="large"
                className="mt-2"
                value={info.name_customer}
                onChange={(e) =>
                  setInfo({ ...info, name_customer: e.target.value })
                }
              />
            </div>
            <div className="mt-2">
              <label>Số điện thoại</label>
              <Input
                size="large"
                className="mt-2"
                value={info.phone_number}
                onChange={(e) =>
                  setInfo({ ...info, phone_number: e.target.value })
                }
              />
            </div>
            <div className="mt-2">
              <label>Địa chỉ</label>
              <TextArea
                rows={4}
                className="mt-2"
                value={info.address}
                onChange={(e) => setInfo({ ...info, address: e.target.value })}
              />
            </div>
            <div className="mt-4">
              <Button
                type="primary"
                size="large"
                disabled={
                  !Object.values(info).every((value) =>
                    Boolean(String(value).trim())
                  )
                }
                className="w-full"
                onClick={() => saveCart()}
              >
                ĐẶT HÀNG
              </Button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default CartPage;
