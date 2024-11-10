"use client";
import InputBox from "@components/Input/InputBox";
import Divider from "@components/UI/Divider";
import { faClock } from "@fortawesome/free-regular-svg-icons";
import { faShoppingBag, faTicket } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSession } from "@node_modules/next-auth/react";
import { useSelector } from "@node_modules/react-redux/dist/react-redux";
import { getVouchers } from "@service/voucher";
import { formattedDate } from "@util/format";
import React, { useEffect, useState } from "react";

const Vouchers = () => {
  const session = useSelector((state) => state.session);
  const [isLoading, setIsLoading] = useState(true);
  const [vouchers, setVouchers] = useState([]);
  const [voucherCode, setVoucherCode] = useState("");
  const fetchVoucher = () => {
    setIsLoading(true);
    getVouchers(session?.user?.id).then((data) => {
      // Separate vouchers into two groups
      const activeAndValidVouchers = data.filter(
        (voucher) =>
          voucher.is_active && new Date(voucher.valid_to) >= new Date() // Active and not expired
      );

      const expiredVouchers = data.filter(
        (voucher) =>
          !voucher.is_active || new Date(voucher.valid_to) < new Date() // Inactive or expired by date
      );

      // Sort active & valid vouchers by expiration date (ascending)
      const sortedValidVouchers = activeAndValidVouchers.sort(
        (a, b) => new Date(a.valid_to) - new Date(b.valid_to)
      );

      // Sort expired vouchers by expiration date (descending)
      const sortedExpiredVouchers = expiredVouchers.sort(
        (a, b) => new Date(b.valid_to) - new Date(a.valid_to)
      );

      // Combine the sorted arrays: valid vouchers first, expired vouchers second
      const sortedVouchers = [...sortedValidVouchers, ...sortedExpiredVouchers];
      setVouchers(sortedVouchers);
    });

    setTimeout(() => setIsLoading(false), 1000);
  };
  useEffect(() => {
    fetchVoucher();
  }, []);
  return (
    <section className="w-full flex flex-col gap-2">
      <div className="flex flex-col gap-2">
        <div className="text-xl font-semibold">Vouchers</div>
        <div className="text-sm opacity-60">View your vouchers </div>
      </div>
      <Divider />
      <div className="flex flex-col md:flex-row gap-4 items-center justify-center bg-primary-variant py-4">
        <h2 className="font-bold text-xl">VOUCHER CODE</h2>
        <div>
          <InputBox value={voucherCode} onChange={setVoucherCode} />
        </div>
        <button className="button-variant-1">Save voucher</button>
      </div>
      <Divider />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-on-surface/20 p-2">
        {isLoading
          ? Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="relative flex flex-row voucher">
                <div className="flex items-center justify-center aspect-square h-full bg-on-primary text-primary text-4xl">
                  <FontAwesomeIcon icon={faShoppingBag} />
                </div>
                <div className="p-2 flex flex-col overflow-x-scroll no-scrollbar whitespace-nowrap gap-2">
                  <h3 className="h-7 w-[100px] rounded-lg animate-pulse bg-primary"></h3>
                  <div className="h-6 w-[200px] rounded-lg animate-pulse bg-primary"></div>
                  <div className="flex flex-row items-center gap-2 text-xs">
                    <FontAwesomeIcon icon={faClock} />
                    <div className="h-4 w-[50px] rounded-lg animate-pulse bg-primary"></div>
                    <div className="h-4 w-[50px] rounded-lg animate-pulse bg-primary"></div>
                  </div>
                </div>
              </div>
            ))
          : vouchers.map((voucher) => (
              <div
                key={voucher.voucher_code}
                className={`relative max-h-[100px] w-full items-center flex flex-row voucher ${(!voucher.is_active ||
                  new Date(voucher.valid_to) < new Date())&&'opacity-30 blur-[2px]'}`}
              >
                <div className="flex items-center justify-center h-full aspect-square bg-on-primary grow max-w-[100px] text-primary text-3xl font-bold">
                  {voucher.discount_amount}%
                </div>
                <div className="p-2 flex flex-col overflow-x-scroll no-scrollbar whitespace-nowrap gap-2 ">
                  <h3 className="text-xl font-bold ">{voucher.voucher_code}</h3>
                  <h4 className="opacity-60 ">{voucher.description}</h4>
                  <div className="flex flex-row items-center gap-2 text-xs">
                    <FontAwesomeIcon icon={faClock} />
                    <h5>
                      {formattedDate(voucher.valid_from)} to{" "}
                      {formattedDate(voucher.valid_to)}
                    </h5>
                  </div>
                </div>
              </div>
            ))}
      </div>
    </section>
  );
};

export default Vouchers;
