"use client";

import React, { useState } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import { CiCircleQuestion } from "react-icons/ci";
import { Checkbox, FormGroup, Slider, TextField } from "@mui/material";
import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import KeyboardArrowDown from "@mui/icons-material/KeyboardArrowDown";
import _ from "lodash";
import Dialogue from "./dialogue";
import Button from "./button";
import GetArtistAlbumsAndSongs from "@/hooks/useArtistAlbums";
import { Album } from "@/types";
import SongsMenu from "./songs-menu";
import axios from "axios";
import limitDecimalPlaces from "@/actions/limit-number-decimal";
import toast from "react-hot-toast";
import {
  SaveCustomMarks,
  FollowerCustomMarks,
  MonthlyListenerCustomMarks,
  PlaysCustomMarks,
} from "@/lib/custom-marks";
import {
  PlaysPrices,
  FollowerPrices,
  MonthlyListenerPrices,
  SavesPrice,
} from "@/lib/Prices";
import useOrderMenu from "@/hooks/useOrderMenu";
import FindIndex from "@/actions/find-index-price";
import { useRouter } from "next/navigation";

interface OrderListProps {
  disable?: boolean;
  expanded?: boolean;
  defaultExpanded?: boolean;
  onChange?: (event?: React.SyntheticEvent, isExpanded?: boolean) => void;
  onButtonClick?: (panel: string) => void;
  ArtistId?: string;
  ArtistName?: string;
  ListTwo?: boolean;
  ListThree?: boolean;
  ListFour?: boolean;
}

const OrderList: React.FC<OrderListProps> = ({
  disable,
  onButtonClick,
  defaultExpanded,
  expanded,
  onChange,
  ArtistId,
  ArtistName,
  ListTwo,
  ListThree,
  ListFour,
}) => {
  const API_KEY = process.env.NEXT_PUBLIC_API_KEY;
  const {
    songsCount,
    setSongsCount,
    setFollowerValue,
    setSavesValue,
    setListenerValue,
    setPlaysValue,
    PlayValue,
    ListenerValue,
    FollowerValue,
    SaveValue,
    checkedSongs
  } = useOrderMenu();
  const [Album, setAlbum] = useState(true);
  const { albums, epsData } = GetArtistAlbumsAndSongs(ArtistId || "");
  const [Email, setEmail] = useState("");
  const AlbumData: Album[] = albums;
  const EpsData: Album[] = epsData?.items;
  const [AlbumId, setAlbumId] = useState("");
  const [isLoading, setIsLoading] = useState(false)
  const [Eps, setEps] = useState("");

  const FilteredAlbum = AlbumData.filter(
    (obj: Album) => obj.album_type === "album"
  );
  const PlayPrice = FindIndex(PlaysCustomMarks, PlayValue);
  const FollowerPrice = FindIndex(FollowerCustomMarks, FollowerValue);
  const MonthlyListenerPrice = FindIndex(
    MonthlyListenerCustomMarks,
    ListenerValue
  );
  const SavePrice = FindIndex(SaveCustomMarks, SaveValue);

  const total =
    PlaysPrices[PlayPrice] * (songsCount - 1) +
    FollowerPrices[FollowerPrice] +
    MonthlyListenerPrices[MonthlyListenerPrice] +
    SavesPrice[SavePrice] * (songsCount - 1) ;

  const Discount = limitDecimalPlaces(total * 0.05, 2);
  const OrderTotal = limitDecimalPlaces(total  - Discount, 2);

  const router = useRouter();
  const onSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setIsLoading(true)
    try {
      const createOrderResponse =  await axios.post("/api/spotify-order", {
        OrderTotal,
        PlayValue,
        SaveValue,
        FollowerValue,
        ListenerValue,
        ArtistName,
        Email,
        checkedSongs,
        API_KEY,

      });
      const OrderId = createOrderResponse?.data?.id
     const response = await axios.post("http://localhost:3001/api/checkout", {
        OrderTotal,
        API_KEY,
        OrderId,
        ServiceName: "Spotify service"
      })

      window.location = response.data?.url;
    } catch (error) {
      toast.error("something went wrong");
      console.log(error);
    } finally {
      setIsLoading(false)
    }
  };

  return (
    <div className="w-full">
      <Accordion
        className="!rounded-lg py-2"
        defaultExpanded={defaultExpanded}
        sx={{
          background: "#202020",
        }}
        expanded={expanded}
        disabled={disable}
        onChange={typeof onChange === "function" ? onChange : () => {}}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon className="text-white " />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          {(ListTwo || ListThree || ListFour) && (
            <div className="px-4">
              <span className="font-semibold text-white">
                {(ListTwo && "Your Order") ||
                  (ListThree && "Select Order") ||
                  (ListFour && "Confirm Details")}
              </span>
            </div>
          )}
        </AccordionSummary>
        {ListTwo && (
          <AccordionDetails>
            <div className="flex flex-col px-4 border-t-[1px] border-green-500">
              <div className="pt-4">
                <div className="flex justify-between gap-2 items-center">
                  <div className="flex relative gap-2 items-center">
                    <span className="font-semibold text-white">
                      {PlayValue} Plays
                    </span>
                    <span className="text-green-500 group flex gap-2 font-extralight text-sm items-center">
                      <CiCircleQuestion
                        size={25}
                        className="text-white  relative"
                      />
                      (select songs in next step)
                      <Dialogue
                        className="top-[100%] left-0 -translate-x-[25%]"
                        label="High Quality Spotify Plays From Tier 1 Countries"
                        ListOne="Speed : We deliver a maximum of 1k to 5 Plays per day. Depending on the size of your order it may take several days for orders to be completed. We pace the delivery of the plays over time in a natural pattern."
                        ListTwo="Start Time : 0-24 hours"
                      />
                    </span>
                  </div>
                  <span className="text-white text-sm font-light">
                    ${PlaysPrices[PlayPrice]}
                  </span>
                </div>
                <Slider
                  defaultValue={0}
                  value={PlayValue}
                  onChange={(e, value) =>
                    setPlaysValue(typeof value === "number" ? value : 0)
                  }
                  valueLabelDisplay="auto"
                  marks={PlaysCustomMarks}
                  step={null}
                  max={250000}
                  style={{
                    width: 600,
                  }}
                  getAriaValueText={() => `${PlayValue}`}
                  sx={{
                    "& .MuiSlider-thumb": {
                      borderRadius: "100%",
                      width: "20px",
                      height: "20px",
                      color: "white",
                      boxShadow: "0 4px 4px rgba(102,123,154,.25)",
                      border: "2px solid green",
                    },
                  }}
                  className="text-green-500 h-2 !rounded-sm max-w-full"
                ></Slider>
              </div>
              <div className="pt-4">
                <div className="flex justify-between gap-2 items-center">
                  <div className="flex gap-2 items-center relative">
                    <span className="font-semibold text-white">
                      {FollowerValue} Followers
                    </span>
                    <span className="text-green-500 group flex gap-2 font-extralight text-sm items-center">
                      <CiCircleQuestion size={25} className="text-white" />
                      <Dialogue
                        className="left-0 -translate-x-[22%] top-[100%]"
                        label="High Quality Spotify Followers from Real Accounts Globally"
                        ListOne="Speed : Depends on server load and order size. We do not deliver instant but pace the order over several days"
                        ListTwo="Start Time : 0-24 hours"
                      />
                      (select songs in next step)
                    </span>
                  </div>
                  <span className="text-white text-sm font-light">
                    ${FollowerPrices[FollowerPrice]}
                  </span>
                </div>
                <Slider
                  defaultValue={0}
                  value={FollowerValue}
                  onChange={(e, value) =>
                    setFollowerValue(typeof value === "number" ? value : 0)
                  }
                  valueLabelDisplay="auto"
                  marks={FollowerCustomMarks}
                  step={null}
                  max={1000}
                  style={{
                    width: 600,
                  }}
                  getAriaValueText={() => `${FollowerValue}`}
                  sx={{
                    "& .MuiSlider-thumb": {
                      borderRadius: "100%",
                      width: "20px",
                      height: "20px",
                      color: "white",
                      boxShadow: "0 4px 4px rgba(102,123,154,.25)",
                      border: "2px solid green",
                    },
                  }}
                  className="text-green-500 h-2 !rounded-sm  max-w-full"
                ></Slider>
              </div>
              <div className="pt-4">
                <div className="flex justify-between gap-2 items-center">
                  <div className="flex gap-2 items-center">
                    <span className="font-semibold text-white">
                      {ListenerValue} Monthly Listeners
                    </span>
                    <span className="text-green-500 relative group flex gap-2 font-extralight text-sm items-center">
                      <CiCircleQuestion size={25} className="text-white" />
                      (select songs in next step)
                      <Dialogue
                        className="top-[100%] left-0 -translate-x-[50%]"
                        label="High Quality Monthly Listeners from USA Profiles"
                        ListOne="Speed : Depends on server load and order size. We do not deliver instant but pace the order over several days"
                        ListTwo="Start Time : 0-24 hours"
                      />
                    </span>
                  </div>
                  <span className="text-white text-sm font-light">
                    ${MonthlyListenerPrices[MonthlyListenerPrice]}
                  </span>
                </div>
                <Slider
                  defaultValue={0}
                  value={ListenerValue}
                  onChange={(e, value) =>
                    setListenerValue(typeof value === "number" ? value : 0)
                  }
                  valueLabelDisplay="auto"
                  marks={MonthlyListenerCustomMarks}
                  step={null}
                  max={250000}
                  style={{
                    width: 600,
                  }}
                  getAriaValueText={() => `${ListenerValue}`}
                  sx={{
                    "& .MuiSlider-thumb": {
                      borderRadius: "100%",
                      width: "20px",
                      height: "20px",
                      color: "white",
                      boxShadow: "0 4px 4px rgba(102,123,154,.25)",
                      border: "2px solid green",
                    },
                  }}
                  className="text-green-500 h-2 !rounded-sm  max-w-full"
                ></Slider>
              </div>
              <div className="pt-4">
                <div className="flex justify-between gap-2 items-center">
                  <div className="flex relative gap-2 items-center">
                    <span className="font-semibold text-white">
                      {SaveValue} Saves
                    </span>
                    <span className="text-green-500 group flex gap-2 font-extralight text-sm items-center">
                      <CiCircleQuestion size={25} className="text-white" />
                      (select songs in next step)
                      <Dialogue
                        className="top-[100%] left-0 -translate-x-[25%]"
                        ListOne="Speed : Depends on server load and order size. We do not deliver instant but pace the order over several days"
                        ListTwo="Start Time : 0-24 hours"
                      />
                    </span>
                  </div>
                  <span className="text-white text-sm font-light">
                    ${SavesPrice[SavePrice]}
                  </span>
                </div>
                <Slider
                  defaultValue={0}
                  value={SaveValue}
                  onChange={(e, value) =>
                    setSavesValue(typeof value === "number" ? value : 0)
                  }
                  valueLabelDisplay="auto"
                  marks={SaveCustomMarks}
                  step={null}
                  max={2500}
                  style={{
                    width: 600,
                  }}
                  getAriaValueText={() => `${SaveValue}`}
                  sx={{
                    "& .MuiSlider-thumb": {
                      borderRadius: "100%",
                      width: "20px",
                      height: "20px",
                      color: "white",
                      boxShadow: "0 4px 4px rgba(102,123,154,.25)",
                      border: "2px solid green",
                    },
                  }}
                  className="text-green-500 h-2 !rounded-sm max-w-full"
                ></Slider>
              </div>
              <span className="text-sm text-white py-3 border-b-[1px] border-green-500">
                Plays and saves are calculated for each song you select in the
                next step
              </span>
              <div className="flex justify-between items-center text-white py-3 border-b-[1px] border-green-500">
                <span className="font-medium text-sm">Discount</span>
                <span className="font-light text-sm">-${Discount}</span>
              </div>
              <div className="flex justify-between text-white w-full py-3">
                <h2 className="flex-1">Order Total</h2>
                <div className="flex-1 flex flex-col items-end">
                  <span className="text-lg font-medium">${OrderTotal}</span>
                  <span className="text-xs font-light">Approx. </span>
                </div>
              </div>
              <Button
                Label={
                  ((FollowerValue as number) > 1 || ListenerValue > 1) &&
                  SaveValue === 0 &&
                  PlayValue === 0
                    ? "Next: Confirm Details"
                    : "Next: Select Songs"
                }
                disabled={total === 0 && PlayValue === 0}
                onClick={() => {
                  ((FollowerValue as number) > 1 || ListenerValue > 1) &&
                  SaveValue === 0 &&
                  PlayValue === 0
                    ? onButtonClick?.("panel3")
                    : onButtonClick?.("panel2");
                }}
              />
            </div>
          </AccordionDetails>
        )}
        {ListThree && (
          <AccordionDetails>
            <div className="px-4 py-4 flex flex-col gap-4 text-white border-t-[1px] border-green-500">
              <span className="text-sm font-light">
                Your plays and saves are calculated per song
              </span>
              <h3 className="text-base font-semibold text-green-500">
                Select Your Album and Song(s)
              </h3>
              <FormControl>
                <RadioGroup
                  row
                  aria-labelledby="demo-row-radio-buttons-group-label"
                  name="row-radio-buttons-group"
                >
                  <FormControlLabel
                    control={
                      <Radio
                        sx={{
                          color: "white",
                          "&.Mui-checked": {
                            color: "#22c55e",
                          },
                        }}
                        onChange={() => {
                          setAlbum(true);
                          setSongsCount(1);
                          setAlbumId("");
                        }}
                        checked={Album}
                      />
                    }
                    label="Album"
                  />
                  <FormControlLabel
                    control={
                      <Radio
                        sx={{
                          color: "white",
                          "&.Mui-checked": {
                            color: "#22c55e",
                          },
                        }}
                      />
                    }
                    onChange={() => {
                      setAlbum(false);
                      setSongsCount(1);
                      setEps("");
                    }}
                    checked={!Album}
                    label="Single & EPs"
                  />
                </RadioGroup>
              </FormControl>
              {Album ? (
                <React.Fragment>
                  <Select
                    placeholder="Select your album"
                    indicator={<KeyboardArrowDown />}
                    variant="outlined"
                    value={AlbumId}
                    onChange={(e, value) =>
                      //@ts-ignore
                      setAlbumId(value)
                    }
                    className="!bg-[#333030] !hover:bg-[#222121] !text-white hover:!border-green-500"
                    sx={{
                      height: 50,
                      width: "100%",
                    }}
                  >
                    {FilteredAlbum.map((data, index) => (
                      <Option value={data?.name} key={index}>
                        {data?.name}
                      </Option>
                    ))}
                  </Select>
                  <SongsMenu
                    AlbumId={FilteredAlbum?.find(
                      (data) => data?.name === AlbumId
                    )}
                  />
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <Select
                    placeholder="Select Singles & EPs"
                    indicator={<KeyboardArrowDown />}
                    variant="outlined"
                    onChange={(e, value) => {
                      //@ts-ignore
                      setEps(value);
                    }}
                    value={Eps}
                    className="!bg-[#333030] !hover:bg-[#222121] !text-white hover:!border-green-500"
                    sx={{
                      height: 50,
                      width: "100%",
                    }}
                  >
                    {EpsData.map((data, index) => (
                      <Option value={data?.name} key={index}>
                        {data?.name}
                      </Option>
                    ))}
                  </Select>
                  <SongsMenu
                    AlbumId={EpsData?.find((data) => data?.name === Eps)}
                  />
                </React.Fragment>
              )}

              <Button
                Label="Confirm Payment"
                disabled={songsCount - 1 === 0}
                onClick={() => onButtonClick?.("panel3")}
              />
            </div>
          </AccordionDetails>
        )}
        {ListFour && (
          <AccordionDetails>
            <form
              onSubmit={onSubmit}
              className="flex flex-col gap-4 px-4 border-t-[1px] pt-4 border-green-500 text-white"
            >
              <p className="text-sm font-light">
                Please enter your email address. This is where we will send you
                updates on your Viewpals campaign.
              </p>
              <TextField
                id="outlined-basic"
                sx={{
                  "& label": {
                    color: "white",
                  },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "white",
                    },
                    color: "white",
                    "&:hover fieldset": {
                      borderColor: "#22c55e",
                    },
                  },
                }}
                label="Email"
                onChange={(e) => setEmail(e.target.value)}
                value={Email}
                required
                type="email"
                variant="outlined"
                color="success"
              />
              <FormGroup>
                <FormControlLabel
                  className="font-light text-sm select-none"
                  control={
                    <Checkbox
                      required
                      sx={{
                        color: "#22B83A",
                        borderRadius: "50%",
                        "&.Mui-checked": {
                          color: "#22B83A",
                          borderRadius: "50%",
                        },
                      }}
                      id="Song-Check"
                      className="text-green-500"
                    />
                  }
                  label={
                    <p className="text-sm font-light">
                      You agree to our
                      <a href="" className="underline ml-1">
                        Terms
                      </a>{" "}
                      &{" "}
                      <a href="" className="underline ml-1">
                        Refund Policy
                      </a>
                    </p>
                  }
                />
              </FormGroup>
              <Button Label="Continue to Payment" disabled={isLoading} className="self-center" />
              <p className="text-white text-xs text-light self-center mt-4">
                By clicking Pay button you agree to our
                <a href="#" className="text-green-500 ml-1 underline">
                  Terms of use
                </a>
              </p>
            </form>
          </AccordionDetails>
        )}
      </Accordion>
    </div>
  );
};

export default OrderList;
