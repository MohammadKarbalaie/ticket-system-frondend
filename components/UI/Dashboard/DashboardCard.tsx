import { LucideIcon } from "lucide-react";

interface DashboardCardProps {
    icon : LucideIcon;
    iconBg :string;
    value : number | string;
    label : string
}

export const DashboardCard: React.FC<DashboardCardProps> = ({
    icon : Icon,
    iconBg,
    value,
    label,
}) =>{
    return(
        <div className="bg-white rounded-md flex flex-col items-center justify-center py-8 text-black">
            <div className={`${iconBg}  p-6 rounded-full flex items-center justify-center`}>
                <Icon className="w-8 h-8 text-white" />
            </div>
            <p className="mt-4 font-bold text-2xl">{value}</p>
            <p className="mt-2 text-lg">{label}</p>
        </div>
    )
}