"use client";

import OrderList from "./order-list";
import { useState } from "react";
import _ from "lodash";
import useOrderMenu from "@/hooks/useOrderMenu";

interface OrderMenuProps {
  url: string;
  name: string;
  ArtistId: string;
  ArtistName: string;
}
const OrderMenu: React.FC<OrderMenuProps> = ({ url, name, ArtistId, ArtistName }) => {
  const [expanded, setExpanded] = useState<string | false>("panel1");
  const handleChange =
    (panel: string) => (event?: React.SyntheticEvent, isExpanded?: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };
  const handleButtonClick = (panel: string) => {
    setExpanded((prevExpandedPanel) =>
      prevExpandedPanel === panel ? false : panel
    );
  };
  const { songsCount, PlayValue, SaveValue, FollowerValue, ListenerValue} = useOrderMenu();
  return (
    <div className="flex-1 pt-16 min-h-[91.6vh] max-w-full">
      <div className="md:px-32 px-4 flex flex-col gap-4">
        <OrderList
          ListTwo
          defaultExpanded={true}
          expanded={expanded === "panel1"}
          onChange={handleChange("panel1")}
          onButtonClick={handleButtonClick}
        />
        <OrderList
          ListThree
          ArtistId={ArtistId}
          disable={PlayValue === 0 && SaveValue === 0}
          expanded={expanded === "panel2"}
          onChange={handleChange("panel2")}
          onButtonClick={handleButtonClick}
        />
        <OrderList
          ListFour
          disable={(FollowerValue === 0 && ListenerValue === 0) || (PlayValue > 0 || SaveValue > 0) && songsCount === 1}
          expanded={expanded === "panel3"}
          onChange={handleChange("panel3")}
          ArtistName={ArtistName}
        />
      </div>
    </div>
  );
};

export default OrderMenu;
