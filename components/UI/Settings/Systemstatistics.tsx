interface SystemstatisticsProps {
  value: number | string;
  label: string;
  bgColor: string;  
  textColor: string; 
}

export const Systemstatistics: React.FC<SystemstatisticsProps> = ({
  value,
  label,
  bgColor,
  textColor,
}) => {
  return (
    <div className={`${bgColor} p-6 text-center`}>
      <p className={`${textColor} font-bold text-2xl`}>{value}</p>
      <p className="text-gray-600">{label}</p>
    </div>
  );
};
