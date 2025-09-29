"use client";

interface CategoryStatsProps {
  stats: Record<string, number>;
  colors?: Record<string, string>;
}

export const CategoryStats: React.FC<CategoryStatsProps> = ({
  stats,
  colors = {
    فنی: "text-sky-600",
    اداری: "text-purple-600",
    درخواست: "text-green-600",
    پشتیبانی: "text-yellow-600",
    نامشخص: "text-gray-500",
  },
}) => {
  return (
    <div className="bg-white rounded-md shadow text-black">
      <div className="bg-gradient-to-r from-purple-500 to-blue-500 text-white font-bold p-3 rounded-t-md">
        آمار دسته‌بندی
      </div>
      <div className="p-4 text-sm">
        <ul className="space-y-2">
          {Object.entries(stats).map(([cat, count]) => (
            <li key={cat} className="flex justify-between">
              <span className={colors[cat] || "text-gray-600"}>{cat}</span>
              <span className="font-bold">{count} تیکت</span>
            </li>
          ))}
          {Object.keys(stats).length === 0 && (
            <li className="text-gray-500 text-center">دسته‌بندی وجود ندارد</li>
          )}
        </ul>
      </div>
    </div>
  );
};
