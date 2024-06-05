const Condition = ({
  title,
  quantity,
  unit,
  Icon,
  rotateValue = 0,
  label = null,
}) => {
  return (
    <div className="w-[90%] h-full flex flex-col items-center">
      <div className="h-full flex flex-row justify-between pt-3 items-center gap-2">
        <div style={{ transform: `rotate(${rotateValue}deg)` }}>
          {label}
          {Icon && <Icon size={42} />}
        </div>
        <div className="flex flex-row items-end">
          <div className="text-4xl">{quantity}</div>
          <div className="text-xl bottom-0">{unit}</div>
        </div>
      </div>
      <div className="text-md bottom-0">{title}</div>
    </div>
  );
};

export default Condition;
