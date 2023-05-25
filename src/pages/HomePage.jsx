import { Badge, Button, Card, Carousel, List, Select, message } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import {
  FaAirFreshener,
  FaBabyCarriage,
  FaBriefcaseMedical,
  FaClinicMedical,
  FaFutbol,
  FaGift,
  FaGifts,
  FaLaptopHouse,
  FaPeopleCarry,
  FaUserNurse,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom/dist";
import combo from "../assets/images/banner-combo-khuyen-mai-home-08022023.jpg";
import slide1 from "../assets/images/banner-dia-chi-sieuthiyte-23122022-v1.jpg";
import bnr3 from "../assets/images/banner-right-sieuthiyte-lam-dep.jpg";
import bnr2 from "../assets/images/banner-right-sieuthiyte-may-chong-ngay.jpg";
import bnr1 from "../assets/images/banner-right-sieuthiyte-oxy.jpg";
import slide2 from "../assets/images/banner-slide-may-tao-oxy-11022023.jpg";
import img2 from "../assets/images/banner-top-benecheck-08022023.jpg";
import img1 from "../assets/images/banner-top-may-do-huyet-ap-08022023.jpg";
import img3 from "../assets/images/banner-top-vo-y-khoa-08022023.jpg";
import km from "../assets/images/khuyen-mai.png";
import slide3 from "../assets/images/may-tam-nuoc-roaman-mini8-banner-slide-28042023.jpg";
import Footer from "../layouts/Footer";
import Header from "../layouts/Header";

const datas = [
  {
    id: 1,
    description: "COMBO KHUYẾN MÃI",
    icon: <FaGift className="text-xl text-orange-600" />,
  },
  {
    id: 4,
    description: "Y TẾ GIA ĐÌNH",
    icon: <FaClinicMedical className="text-xl text-green-600" />,
  },
  {
    id: 7,
    description: "Y TẾ CHUYÊN DỤNG",
    icon: <FaBriefcaseMedical className="text-xl text-blue-600" />,
  },
  {
    id: 10,
    description: "CHĂM SÓC SẮC ĐẸP",
    icon: <FaUserNurse className="text-xl text-yellow-600" />,
  },
  {
    id: 11,
    description: "CHĂM SÓC SỨC KHỎE",
    icon: <FaPeopleCarry className="text-xl text-red-600" />,
  },
  {
    description: "THIẾT BỊ GIA ĐÌNH",
    icon: <FaLaptopHouse className="text-xl text-teal-600" />,
  },
  {
    description: "ĐỒ DÙNG MẸ VÀ BÉ",
    icon: <FaBabyCarriage className="text-xl text-red-800" />,
  },
  {
    description: "THỰC PHẨM DINH DƯỠNG",
    icon: <FaAirFreshener className="text-xl text-green-300" />,
  },
  {
    description: "ĐỒ THỂ THAO",
    icon: <FaFutbol className="text-xl text-purple-600" />,
  },
  {
    description: "QUÀ TẶNG",
    icon: <FaGifts className="text-xl text-red-500" />,
  },
];

function HomePage() {
  const { Meta } = Card;
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const [category, setCategory] = useState([]);
  const [flag, setFlag] = useState(false);
  const [url, setUrl] = useState([]);
  const [listCard, setListCard] = useState([]);
  const [listOrder, setListOrder] = useState(
    JSON.parse(localStorage.getItem("listOrder")) || []
  );
  useEffect(() => {
    localStorage.setItem("listOrder", JSON.stringify(listOrder));
    // eslint-disable-next-line
  }, [listOrder]);

  useEffect(() => {
    if (JSON.parse(localStorage.getItem("listOrder"))) {
      setListOrder(JSON.parse(localStorage.getItem("listOrder")));
    }
  }, [flag]);
  useEffect(() => {
    axios
      .get("http://localhost:6789/product")
      .then((res) => {
        setListCard(res.data.data);
      })
      .catch((error) => console.log(error));

    axios
      .get("http://localhost:6789/category")
      .then((res) => {
        setCategory(res.data);
      })
      .catch((error) => console.log(error));

    axios
      .get("http://localhost:6789/product-image")
      .then((res) => {
        setUrl(res.data);
      })
      .catch((error) => console.log(error));
    // eslint-disable-next-line
  }, []);
  function saveOrder(product) {
    if (
      listOrder.some((x) => x.cart_create_request.product_id === product.id)
    ) {
      messageApi.info("Sản phẩm đã được thêm vào giỏ hàng");
    } else {
      messageApi.success("Thêm vào giỏ hàng thành công");
      setFlag(!flag);
      setListOrder((pre) => [
        ...pre,
        {
          cart_create_request: {
            product_id: product.id,
            quantity_product: 1,
            total_price: product.price,
          },
          name_customer: "",
          address: "",
          phone_number: "",
        },
      ]);
    }
  }
  const handleChange = (newValue) => {
    navigate(`/category?type=${newValue}`);
  };
  return (
    <div>
      <Header />
      {contextHolder}
      <div>
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
        <div className="mb-8 grid grid-cols-5 gap-3 mx-32">
          <div className="overflow-auto p-2" style={{ maxHeight: 400 }}>
            <List
              itemLayout="horizontal"
              dataSource={datas}
              renderItem={(item, index) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={item.icon}
                    description={
                      <Select
                        placeholder={
                          <Link to={"/category"}>{item.description}</Link>
                        }
                        className="w-full"
                        size="large"
                        allowClear
                        onChange={handleChange}
                        options={
                          item.id === 4
                            ? category.map((x) => ({
                                label: (
                                  <span className="capitalize block">
                                    {x.name_category}
                                  </span>
                                ),
                                value: `${x.id}`,
                              }))
                            : ""
                        }
                      ></Select>
                    }
                  />
                </List.Item>
              )}
            />
          </div>
          <div className="col-start-2 col-end-6 grid grid-cols-4">
            <div className="col-start-1 col-end-4">
              <Carousel autoplay>
                <div>
                  <img
                    src={slide1}
                    alt="slide1"
                    className="w-full"
                    style={{ maxHeight: 400 }}
                  />
                </div>
                <div>
                  <img
                    src={slide2}
                    alt="slide2"
                    className="w-full"
                    style={{ maxHeight: 400 }}
                  />
                </div>
                <div>
                  <img
                    src={slide3}
                    alt="slide3"
                    className="w-full"
                    style={{ maxHeight: 400 }}
                  />
                </div>
              </Carousel>
            </div>
            <div className="grid grid-rows-3 pl-1">
              <div className="flex justify-end items-start">
                <img src={bnr1} alt="bnr1" />
              </div>
              <div className="flex justify-end items-start">
                <img src={bnr2} alt="bnr2" />
              </div>
              <div className="flex justify-end items-start">
                <img src={bnr3} alt="bnr3" />
              </div>
            </div>
          </div>
          <div className="col-start-1 col-end-6 mt-3 grid grid-cols-3 gap-3">
            <div>
              <img src={img1} alt="img1" className="w-full" />
            </div>
            <div>
              <img src={img2} alt="img2" className="w-full" />
            </div>
            <div>
              <img src={img3} alt="img3" className="w-full" />
            </div>
          </div>
          <div className="col-start-1 col-end-6 mt-6 bg-slate-300 grid grid-cols-4">
            <div className="bg-blue-800 text-white p-3 font-bold">
              <FaClinicMedical className="mr-2 text-xl" />Y TẾ GIA ĐÌNH
            </div>
            <div className="flex justify-end items-center col-start-2 col-end-5 px-2">
              <Link to={"/category"} className="no-underline">
                Xem thêm
              </Link>
            </div>
          </div>
          {/* List Card */}
          <div className="mt-4 col-start-1 col-end-6">
            <img src={combo} alt="combo" className="w-full" />
            <div className="mt-3 grid grid-cols-5 gap-4">
              {listCard?.map(
                (x, index) =>
                  index <= 20 && (
                    <Badge.Ribbon text={`${x.promotional_price}%`} color="red">
                      <Card
                        hoverable
                        style={{ height: 368 }}
                        bodyStyle={{
                          padding: "8px",
                        }}
                        cover={
                          <Link
                            key={x.id}
                            to={`/details/${x.id}`}
                            className="no-underline px-6 pt-2"
                          >
                            <img
                              alt={x.name_product}
                              style={{ height: 250 }}
                              width={190}
                              src={
                                url.find((y) => y.product_id === x.id)
                                  ?.image_url
                              }
                            />
                          </Link>
                        }
                      >
                        <Link
                          key={x.id}
                          to={`/details/${x.id}`}
                          className="no-underline"
                        >
                          <Meta title={x.name_product} className="capitalize" />
                          <div className="flex mt-4">
                            <strike className="font-bold">
                              {x.price.toLocaleString()}đ
                            </strike>{" "}
                            <span className="text-orange-600 font-bold ml-3">
                              {(
                                ((100 - x.promotional_price) / 100) *
                                x.price
                              ).toLocaleString()}
                              đ
                            </span>
                          </div>
                        </Link>
                        <div className="text-sm m-2">
                          <Button
                            type="primary"
                            className="w-full"
                            onClick={() => saveOrder(x)}
                          >
                            THÊM VÀO GIỎ HÀNG
                          </Button>
                        </div>
                      </Card>
                    </Badge.Ribbon>
                  )
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default HomePage;
