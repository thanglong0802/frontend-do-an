import { FaShoppingCart } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/images/logo.png";

import { Badge, Select } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";

function Header() {
  const navigate = useNavigate();
  const [category, setCategory] = useState([]);
  const [product, setProduct] = useState([]);
  const { Option } = Select;
  const count = JSON.parse(window.localStorage.getItem("listOrder"))?.length;

  useEffect(() => {
    axios
      .get("http://localhost:6789/category")
      .then((res) => {
        setCategory(res.data);
      })
      .catch((error) => console.log(error));
    axios
      .get("http://localhost:6789/product")
      .then((res) => {
        setProduct(res.data.data);
      })
      .catch((error) => console.log(error));
    // eslint-disable-next-line
  }, []);
  const [selectedItems, setSelectedItems] = useState([]);
  const filteredOptions = product.filter((p) => !selectedItems.includes(p.id));
  const handleChange = (newValue) => {
    const id = newValue.match(/\[(.*?)\]/)[1];
    navigate(`/details/${id}`);
    setSelectedItems(newValue.replace(`[${id}]`, ""));
  };
  return (
    <div className="h-24 px-36">
      <div className="grid grid-cols-5 p-3">
        <div className="col-start-1 col-end-2 flex justify-center items-center">
          <Link to={"/"}>
            <img src={logo} alt="logo" width={250} height={80} />
          </Link>
        </div>
        <div className="col-start-2 col-end-5 grid grid-cols-4">
          <div className="flex justify-center items-center">
            <Select
              placeholder="Tất cả"
              className="w-full mx-2"
              size="large"
              allowClear
            >
              {category?.map((x) => (
                <Option key={x.id} value={x.id}>
                  <span className="capitalize"> {x.name_category}</span>
                </Option>
              ))}
            </Select>
          </div>
          <div className="col-start-2 col-end-5 flex justify-center items-center">
            <Select
              size="large"
              showSearch
              showArrow={false}
              placeholder="Tìm kiếm theo tên sản phẩm"
              value={selectedItems}
              onChange={handleChange}
              style={{
                width: "100%",
              }}
              options={filteredOptions.map((item) => ({
                value: `${item.name_product}[${item.id}]`,
                label: (
                  <span className="block capitalize">{item.name_product}</span>
                ),
              }))}
            />
          </div>
        </div>
        <div className="col-start-5 col-end-6 flex justify-center items-center">
          <Link to="/cart" className="no-underline">
            <Badge count={count}>
              <FaShoppingCart className="text-2xl text-blue-600" />
            </Badge>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Header;
