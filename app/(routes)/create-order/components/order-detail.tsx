import { Typography } from "@mui/material";
import Badge from "@mui/material-next/Badge";
import React from "react";
import FindIndex from "@/actions/find-index-price";
import {
  PlaysCustomMarks,
  MonthlyListenerCustomMarks,
  SaveCustomMarks,
  FollowerCustomMarks,
} from "@/lib/custom-marks";
import {
  PlaysPrices,
  FollowerPrices,
  MonthlyListenerPrices,
  SavesPrice,
} from "@/lib/Prices";
import useOrderMenu from "@/hooks/useOrderMenu";
import limitDecimalPlaces from "@/actions/limit-number-decimal";

interface OrderDetailProps {
  ArtistName: string;
}

const OrderDetail: React.FC<OrderDetailProps> = ({ ArtistName }) => {
  const { songsCount, PlayValue, FollowerValue, ListenerValue, SaveValue } =
    useOrderMenu();
  const PlayPrice = FindIndex(PlaysCustomMarks, PlayValue);
  const FollowerPrice = FindIndex(FollowerCustomMarks, FollowerValue);
  const MonthlyListenerPrice = FindIndex(
    MonthlyListenerCustomMarks,
    ListenerValue
  );
  const SavePrice = FindIndex(SaveCustomMarks, SaveValue);

  const Total =
    PlaysPrices[PlayPrice] * (songsCount - 1) +
    FollowerPrices[FollowerPrice] +
    MonthlyListenerPrices[MonthlyListenerPrice] +
    SavesPrice[SavePrice] * (songsCount - 1);
  return (
    <div className=" flex flex-col bg-[#202020] rounded-lg w-full max-w-[500px]">
      <div className="flex items-center justify-between w-full px-6 py-4">
        <div className="flex items-center gap-4">
          <Badge
            color="success"
            sx={{
              "& .MuiBadge-badge": {
                background: "#22C55E",
                width: 20,
                height: 20,
              },
            }}
            size="large"
            overlap="circular"
            badgeContent={PlayValue > 0 || SaveValue > 0 ? (songsCount - 1) : (0)}
          />
          <div className="flex flex-wrap items-start gap-2">
            <Typography className="font-semibold text-center font-sans text-green-500">
              {ArtistName}
            </Typography>
            <div className="py-1 px-3 font-medium block md:hidden text-green-500 w-fit text-xs text-center border border-green-500 rounded-full">
              Selected
            </div>
          </div>
        </div>
        <div className="text-center">
          <span className="text-neutral-500 text-sm">Order Detail</span>
          <h2 className="font-semibold text-xl text-green-500">
            ${limitDecimalPlaces(Total, 2)}
          </h2>
        </div>
      </div>
      <div className="flex flex-col px-8 pb-8 border-t-[1px] border-green-500">
        <div className="flex items-center justify-between text-white pt-4">
          <span className="font-light">{PlayValue} Plays</span>
          <strong className="text-lg font-medium">
            ${limitDecimalPlaces(PlaysPrices[PlayPrice], 2)}
          </strong>
        </div>
        <div className="flex items-center justify-between text-white pt-4">
          <span className="font-light">{FollowerValue} Followers</span>
          <strong className="text-lg font-medium">
            ${limitDecimalPlaces(FollowerPrices[FollowerPrice], 2)}
          </strong>
        </div>
        <div className="flex items-center justify-between text-white pt-4">
          <span className="font-light">{ListenerValue} Monthly Listeners</span>
          <strong className="text-lg font-medium">
            $
            {limitDecimalPlaces(MonthlyListenerPrices[MonthlyListenerPrice], 2)}
          </strong>
        </div>
        <div className="flex items-center justify-between text-white pt-4">
          <span className="font-light">{SaveValue} Saves</span>
          <strong className="text-lg font-medium">
            ${limitDecimalPlaces(SavesPrice[SavePrice], 2)}
          </strong>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
