import { DatePicker, Table } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/images/logo.png";
import MenuLayout from "../../layouts/MenuLayout";
const columns = [
  {
    title: "Mã sản phẩm",
    dataIndex: "code",
  },
  {
    title: "Tên sản phẩm",
    dataIndex: "name",
  },
  {
    title: "Mã loại sản phẩm",
    dataIndex: "category",
  },
  {
    title: "Giá bán",
    dataIndex: "price",
  },
  {
    title: "Đã bán",
    dataIndex: "quantityBuy",
  },
  {
    title: "Số lượng còn",
    dataIndex: "quantity",
  },
  {
    title: "Lần mua gần nhất",
    dataIndex: "date",
  },
];
const columnsCart = [
  {
    title: "Mã đơn hàng",
    dataIndex: "code",
  },
  {
    title: "Tên sản phẩm",
    dataIndex: "name",
  },
  {
    title: "Giá bán",
    dataIndex: "price",
  },
  {
    title: "Số lượng",
    dataIndex: "quantity",
  },
  {
    title: "Khách hàng",
    dataIndex: "fullname",
  },
  {
    title: "Ngày đặt hàng",
    dataIndex: "date",
  },
];
function StatisticManaPage() {
  const arr = [];
  const arrCart = [];
  const arrPrice = [];
  const [products, setProducts] = useState([]);
  const [dateFmCart, setDateFmCart] = useState({
    start: "",
    end: "",
  });
  const [orderDetails, setOrderDetails] = useState([]);
  const [categories, setCategories] = useState([]);
  const [carts, setCarts] = useState([]);
  const [isFilter, setIsFilter] = useState(false);

  async function getCarts() {
    await axios
      .get(`http://localhost:6789/cart`)
      .then((res) => {
        setCarts(res.data);
      })
      .catch((error) => console.log(error));
  }
  async function getProducts() {
    await axios
      .get(`http://localhost:6789/product`)
      .then((res) => {
        setProducts(res.data.data);
      })
      .catch((error) => console.log(error));
  }
  async function getOrderDetails() {
    await axios
      .get(`http://localhost:6789/order-detail`)
      .then((res) => {
        setOrderDetails(res.data);
      })
      .catch((error) => console.log(error));
  }
  async function getCategories() {
    await axios
      .get(`http://localhost:6789/category/search`)
      .then((res) => {
        setCategories(res.data.data);
      })
      .catch((error) => console.log(error));
  }

  useEffect(() => {
    getCategories();
    getCarts();
    getProducts();
    getOrderDetails();
    // eslint-disable-next-line
  }, []);

  function findByDate(productId) {
    return orderDetails
      .filter(
        (x) => carts.find((y) => y.id === x.cart_id)?.product_id === productId
      )
      .sort(
        (a, b) =>
          new Date(b.date_order).getTime() - new Date(a.date_order).getTime()
      )[0]?.date_order;
  }
  function removeDuplicate() {
    const dup = orderDetails.filter(
      (el, i, arr) =>
        arr.findIndex(
          (el2) =>
            carts.find((y) => y.id === el2.cart_id)?.product_id ===
            carts.find((y) => y.id === el.cart_id)?.product_id
        ) === i
    );
    return dup;
  }
  function totalQuantityByProductId(productId) {
    return carts
      .filter((x) => x.product_id === productId)
      .reduce((cat, o) => cat + parseInt(o.quantity_product), 0);
  }

  function findByCategoryId(cateId) {
    return categories.find((x) => x.id === cateId)?.name_category;
  }

  removeDuplicate().forEach((x, index) => {
    const productId = carts.find((y) => y.id === x.cart_id)?.product_id;
    const cateId = products?.find((z) => z.id === productId)?.categories_id;
    const productById = products.find(
      (z) => z.id === carts.find((y) => y.id === x.cart_id)?.product_id
    );
    arr.push({
      key: index,
      code: carts.find((y) => y.id === x.cart_id)?.product_id,
      name: productById?.name_product,
      category: <span className="capitalize">{findByCategoryId(cateId)}</span>,
      price: `${(
        Math.floor(
          (((100 - productById?.promotional_price) / 100) *
            productById?.price) /
            1000
        ) * 1000
      ).toLocaleString()}đ`,
      quantityBuy: `${totalQuantityByProductId(productId)} sản phẩm`,
      quantity: `${productById?.quantity} sản phẩm`,
      date: findByDate(carts.find((y) => y.id === x.cart_id)?.product_id),
    });
  });

  function filterByMonthCart(value) {
    const start = value
      ? value[0]?.$d.toISOString().replace("T", " ").slice(0, 10)
      : "";
    const end = value
      ? value[1]?.$d.toISOString().replace("T", " ").slice(0, 10)
      : "";
    setDateFmCart({
      start: start,
      end: end,
    });
    setIsFilter(true);
  }
  function findByCartId(id) {
    return carts.find((x) => x.id === id);
  }
  let cart = [];
  const temp = isFilter
    ? orderDetails.filter(
        (x) =>
          new Date(x.date_order) >=
            new Date(dateFmCart.start + " " + x.date_order.slice(11, 20)) &&
          new Date(x.date_order) <=
            new Date(
              dateFmCart.end + " " + x.date_order.slice(11, 20)
            ).getTime()
      )
    : orderDetails;
  temp.forEach((x) => {
    cart = findByCartId(x.cart_id);
    const productById = products.find((y) => y.id === cart.product_id);
    arrPrice.push(
      totalQuantityByProductId(cart.product_id) *
        (((100 - productById?.promotional_price) / 100) * productById?.price)
    );
    arrCart.push({
      key: x.id,
      code: x.order_detail_id,
      name: products.find((y) => y.id === cart.product_id)?.name_product,
      price: `${(
        Math.floor(
          (((100 -
            products.find((y) => y.id === cart.product_id)?.promotional_price) /
            100) *
            products.find((y) => y.id === cart.product_id)?.price) /
            1000
        ) * 1000
      ).toLocaleString()}đ`,
      quantity: cart.quantity_product,
      fullname: x.name_customer,
      date: x.date_order,
    });
  });
  return (
    <div className="grid grid-cols-5 h-screen">
      <div className="shadow-lg">
        <div className="h-1/6">
          <Link to={"/"}>
            <img src={logo} alt="logo" width={250} height={100} />
          </Link>
        </div>
        <div className="h-5/6">
          <MenuLayout name="statistic" />
        </div>
      </div>
      <div className="col-start-2 col-end-6">
        <div className="bg-slate-500 text-white p-3 h-20 grid grid-cols-2">
          <div className="flex justify-start items-center">
            <h2>QUẢN LÝ THỐNG KÊ</h2>
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-4 gap-5">
            <div className="bg-green-500 h-28 p-4 rounded-md text-white">
              <div>TỔNG SỐ SẢN PHẨM</div>
              <div className="text-2xl flex justify-center items-center h-14 font-bold">
                {products.reduce((pro, o) => pro + parseInt(o.quantity), 0)}
              </div>
            </div>
            <div className="bg-red-500 h-28 p-4 rounded-md text-white">
              <div>TỔNG DOANH THU THÁNG</div>
              <div className="text-2xl flex justify-center items-center h-14 font-bold">
                {arrPrice.reduce((a, b) => a + b, 0).toLocaleString()}đ
              </div>
            </div>
            <div className="bg-blue-500 h-28 p-4 rounded-md text-white">
              <div>TỔNG SỐ LOẠI DANH MỤC</div>
              <div className="text-2xl flex justify-center items-center h-14 font-bold">
                {categories.length}
              </div>
            </div>
            <div className="bg-yellow-500 h-28 p-4 rounded-md text-white">
              <div>TỔNG SỐ ĐƠN HÀNG</div>
              <div className="text-2xl flex justify-center items-center h-14 font-bold">
                {orderDetails.length}
              </div>
            </div>
          </div>
          <div className="mt-6">
            <div className="grid grid-cols-2">
              <div className="font-bold">Thống kê theo sản phẩm đã bán</div>
            </div>
            <div className="mt-3">
              <Table
                columns={columns}
                dataSource={arr}
                pagination={{
                  pageSize: 4,
                }}
              />
            </div>
          </div>
          <div className="mt-6">
            <div className="grid grid-cols-2">
              <div className="font-bold">Thống kê theo đơn đặt hàng</div>
              <div className="flex justify-end items-center">
                <span className="mr-3">Lọc theo tháng năm : </span>
                <DatePicker.RangePicker
                  className="w-2/4"
                  placeholder={["Bắt đầu", "Kết thúc"]}
                  size="large"
                  onChange={(value) => filterByMonthCart(value)}
                />
              </div>
            </div>
            <div className="mt-3">
              <Table
                columns={columnsCart}
                dataSource={arrCart}
                pagination={{
                  pageSize: 4,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StatisticManaPage;
