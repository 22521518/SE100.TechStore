"use client";
import { fetchDistricts, fetchProvinces, fetchWards } from "@actions/address";
import DatePicker from "@components/Input/DatePicker";
import DropDownButton from "@components/Input/DropDownButton";
import InputBox from "@components/Input/InputBox";
import PhoneInput from "@components/Input/PhoneInput";
import RadioButton from "@components/Input/RadioButton";
import Divider from "@components/UI/Divider";
import { faUserCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Input } from "postcss";
import React, { useEffect, useState } from "react";

const Address = () => {
  const [isUpdatingAddresses, setIsUpdatingAddresses] = useState("");
  const [addresses, setAddresses] = useState([
    {
      id: "123",
      fullname: "John Doe",
      phone: "1234 567 890",
      specificAddress: "123 Street",
      address: "Xã Bình Khánh, Huyện Cần Giờ, Thành phố Hồ Chí Minh",
      default: true,
    },
    {
      id: "456",
      fullname: "John Nguyễn",
      phone: "1234 567 890",
      specificAddress: "123 Street",
      address: "Thị trấn Tây Đằng, Huyện Ba Vì, Thành phố Hà Nội",
      default: false,
    },
  ]);

  const [newAdddress, setNewAddress] = useState({
    id: "",
    fullname: "",
    phone: "",
    specificAddress: "",
    address: "",
    type: "",
    default: false,
  });
  const [skipflag, setSkipFlag] = useState(false);
  const [provinces, setProvinces] = useState();
  const [districts, setDistricts] = useState();
  const [wards, setWards] = useState();
  const [province, setProvince] = useState();
  const [district, setDistrict] = useState();
  const [ward, setWard] = useState();

  const handleChangeProvince = (province) => {
    setProvince(province);
  };
  const handleChangeDistrict = (district) => {
    setDistrict(district);
  };
  const handleChangeWard = (ward) => {
    setWard(ward);
  };

  useEffect(() => {
    if (skipflag) return;
    setDistrict(null);
    getDistricts(province?.id || "");
  }, [province]);

  useEffect(() => {
    if (skipflag) return;
    setWard(null);
    getWards(district?.id || "");
  }, [district]);

  const getProvinces = async () => {
    const provinces = await fetchProvinces();

    setProvinces(
      provinces.map((item) => {
        return { id: item.province_id, name: item.province_name };
      })
    );
  };

  const getDistricts = async (id) => {
    const districts = await fetchDistricts(id);

    setDistricts(
      districts.map((item) => {
        return { id: item.district_id, name: item.district_name };
      })
    );
  };

  const getWards = async (id) => {
    const wards = await fetchWards(id);

    setWards(
      wards.map((item) => {
        return { id: item.ward_id, name: item.ward_name };
      })
    );
  };

  useEffect(() => {
    getProvinces();
  }, []);

  useEffect(() => {
    if (!isUpdatingAddresses) {
      setWards([]);
      setDistricts([]);
    } else if(isUpdatingAddresses==='Adding') {
        setProvince(null)
        setDistrict(null)
        setWard(null)
        setNewAddress({
            id: "",
            fullname: "",
            phone: "",
            specificAddress: "",
            address: "",
            default: false,
          })
    }
  }, [isUpdatingAddresses]);

  const handleAddNewAddress = () => {
    setAddresses((prev) => [
      ...prev,
      {
        ...newAdddress,
        address: [ward.name, district.name, province.name].join(", "),
      },
    ]);
  };

  const handleUpdateAddress = () => {
    setAddresses(
      addresses.map((address) => {
        return address.id === newAdddress.id
          ? {
              ...newAdddress,
              address: [ward.name, district.name, province.name].join(", "),
            }
          : address;
      })
    );
    setIsUpdatingAddresses("");
  };

  const handleFullnameChange = (text) => {
    setNewAddress((prev) => ({ ...prev, fullname: text }));
  };
  const handlePhoneChange = (text) => {
    setNewAddress((prev) => ({ ...prev, phone: text }));
  };
  const handleSpecificAddressChange = (text) => {
    setNewAddress((prev) => ({ ...prev, specificAddress: text }));
  };

  const handleSetDefaultAddress = (id) => {
    setAddresses(
      addresses.map((address) => {
        return { ...address, default: address.id === id ? true : false };
      })
    );
  };

  const handleInitUpdateAddress = async (id) => {
    setIsUpdatingAddresses("");
    setSkipFlag(true);

    const selectedAddress = addresses.find((item) => item.id === id);
    setNewAddress(selectedAddress);

    const [wardName, districtName, provinceName] =
      selectedAddress.address.split(", ");

    const provinceList = await fetchProvinces();
    const formattedProvinces = provinceList.map((prov) => {
      return { id: prov.province_id, name: prov.province_name };
    });
    setProvinces(formattedProvinces);

    const selectedProvince = formattedProvinces.find(
      (prov) => prov.name === provinceName
    );

    if (selectedProvince) {
      setProvince(selectedProvince);
      const districtList = await fetchDistricts(selectedProvince.id);
      const formattedDistricts = districtList.map((dist) => {
        return { id: dist.district_id, name: dist.district_name };
      });
      setDistricts(formattedDistricts);

      const selectedDistrict = formattedDistricts.find(
        (dist) => dist.name === districtName
      );
      if (selectedDistrict) {
        setDistrict(selectedDistrict);
        const wardList = await fetchWards(selectedDistrict.id);
        const formattedWards = wardList.map((ward) => {
          return { id: ward.ward_id, name: ward.ward_name };
        });
        setWards(formattedWards);

        const selectedWard = formattedWards.find(
          (ward) => ward.name === wardName
        );
        setWard(selectedWard);
      }
    }
    setIsUpdatingAddresses("Updating");
    setSkipFlag(false);
  };

  return (
    <section className="w-full flex flex-col gap-2">
      <div className="w-full flex flex-row justify-between items-center">
        <div className="flex flex-col gap-2">
          <div className="text-xl font-semibold">My Address</div>
          <div className="text-sm opacity-60">Manage your shipping address</div>
        </div>
        <div>
          <button
            className="button-variant-1"
            onClick={() => setIsUpdatingAddresses("Adding")}
          >
            Add address
          </button>
        </div>
      </div>
      <Divider />
      {/* adding new address section */}
      {isUpdatingAddresses && (
        <div className="z-20">
          <div className="flex flex-col py-4 gap-4 bg-surface rounded-lg p-2">
            <InputBox
              value={newAdddress.fullname}
              name={"Full name *"}
              onChange={handleFullnameChange}
            />
            <PhoneInput
              value={newAdddress.phone}
              name={"Phone number *"}
              onChange={handlePhoneChange}
              maxLength={12}
            />
            <div className="flex gap-4 flex-wrap  items-center h-fit rounded-xl w-full z-50">
              <DropDownButton
                value={province}
                options={provinces}
                name="province"
                onChange={handleChangeProvince}
                zIndex={70}
              />
              <DropDownButton
                value={district}
                options={districts}
                name="district"
                onChange={handleChangeDistrict}
                zIndex={60}
              />
              <DropDownButton
                value={ward}
                options={wards}
                name="ward"
                onChange={handleChangeWard}
                zIndex={50}
              />
            </div>
            <InputBox
              value={newAdddress.specificAddress}
              name={"Specific address *"}
              onChange={handleSpecificAddressChange}
            />
            <div className="ml-auto flex flex-wrap gap-4">
              <button
                className="button-variant-2"
                onClick={() => {
                  setIsUpdatingAddresses("");
                }}
              >
                Cancel
              </button>
              <button
                className="button-variant-2"
                onClick={
                  isUpdatingAddresses === "Adding"
                    ? handleAddNewAddress
                    : isUpdatingAddresses === "Updating"
                    ? handleUpdateAddress
                    : () => {}
                }
              >
                Save address
              </button>
            </div>
          </div>
        </div>
      )}
      {/* address list section */}
      <div className="flex flex-col gap-4">
        {addresses.map((item) => (
          <div
            key={item.id}
            className="grid grid-cols gap-3 items-start w-full bg-surface rounded-lg p-2 min-h-[70px]"
          >
            <div className="flex flex-col items-start gap-2 h-full justify-around text-base">
              <h2>
                <span className="text-xl font-semibold">{item.fullname}</span> |{" "}
                {item.phone}
              </h2>
              <h3 className="opacity-50">{item.specificAddress}</h3>
              <h3 className="opacity-50">{item.address}</h3>
            </div>
            <div className="w-full flex flex-wrap justify-between col-span-2">
              {item.default && (
                <div className="rounded-lg border-2 border-green-500 px-2 text-green-500">
                  Default
                </div>
              )}
              <div className="flex flex-wrap flex-row-reverse gap-2 ml-auto ">
                <button
                  className="button-variant-2"
                  onClick={() => handleInitUpdateAddress(item.id)}
                >
                  Update
                </button>
                {!item.default && (
                  <button
                    className="button-variant-2"
                    onClick={() => handleSetDefaultAddress(item.id)}
                  >
                    Set default
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Address;
