import { Checkbox, FormControlLabel, FormGroup } from "@mui/material";
import { useState } from "react";
import { FaRegCircle } from "react-icons/fa";
import { FaCircleCheck } from "react-icons/fa6";
interface SongsListProps {
  label: string;
  onCheckBoxChange: (label:string, isChecked: boolean)=> void;
}

const SongsList: React.FC<SongsListProps> = ({ label, onCheckBoxChange }) => {
  const handleCheckboxChange = (event:React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = event.target.checked;
    onCheckBoxChange(label, isChecked);
  };

  return (
    <FormGroup>
      <FormControlLabel
        className="font-light text-sm select-none"
        control={
          <Checkbox
            sx={{
              color: "#22B83A",
              borderRadius: "50%",
              "&.Mui-checked": {
                color: "#22B83A",
                borderRadius: "50%",
              },
            }}
            id="Song-Check"
            icon={<FaRegCircle size={20} />}
            checkedIcon={<FaCircleCheck size={20} />}
            className="text-green-500"
            onChange={handleCheckboxChange}
          />
        }
        label={label}
      />
    </FormGroup>
  );
};

export default SongsList;
