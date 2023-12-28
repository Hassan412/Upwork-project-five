interface ClientResultProps {
  value: string;
  lable: string;
}
const ClientResult = ({ value, lable }: ClientResultProps) => {
  return (
    <div>
      <h3 className=" font-bold md:text-4xl text-xl bg-gradient-to-r from-[#24C48C] to-[#2EC560] bg-clip-text text-transparent">
        {value}
      </h3>
      <p className="text-gray-400 text-sm">{lable}</p>
    </div>
  );
};

export default ClientResult;
