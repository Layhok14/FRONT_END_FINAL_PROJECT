import React from "react";
import { Phone, Calendar, User } from "lucide-react";

export default function AlertCard({ alert }) {

  const colors = {
    critical: {
      strip: "bg-[#FF4D4D]",
      tagBg: "bg-[#FF4D4D]",
      tagText: "text-white",
      alertText: "text-[#FF4D4D]",
      progress: "bg-[#FF4D4D]",
    },
    warning: {
      strip: "bg-[#FBBF24]",
      tagBg: "bg-[#FBBF24]",
      tagText: "text-white",
      alertText: "text-[#F59E0B]",
      progress: "bg-[#FBBF24]",
    },
  };
  
  //filter it first to know if it's critical or warning
  const isCritical = alert.type === "critical";
  const currentColors = isCritical ? colors.critical : colors.warning;

  return (
    <div className="flex bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-md hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 relative border border-gray-50 dark:border-gray-700 mb-6">
      {/* Left side color strip */}
      <div
        className={`w-3 ${currentColors.strip} shrink-0 h-16 mt-6 rounded-r-lg`}
      ></div>

      {/* Image Area */}
      <div className="w-56 p-6 pb-0 flex flex-col pt-6 relative">
        {/* The side warning */}
        <div
          className={`absolute top-8 left-1 px-3 py-1 text-[10px] font-bold tracking-wider rounded-full shadow-sm ${currentColors.tagBg} ${currentColors.tagText}`}
        >
          {isCritical ? "CRITICAL" : "WARNING"}
        </div>

        {/* input img */}
        <div className="w-full h-32 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 mt-4 flex items-center justify-center overflow-hidden shadow-inner">
          <div className="text-gray-400 dark:text-gray-500 opacity-50 font-bold text-4xl">img</div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 pl-4 flex flex-col justify-between">
        {/* Top Header Row */}
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-white tracking-tight leading-tight">
              {alert.patientNameKhmer}{" "}
              <span className="font-semibold text-gray-700 dark:text-gray-300">
                ({alert.patientNameEn})
              </span>
            </h3>
            <p className="text-gray-500 dark:text-gray-400 font-medium text-sm mt-1">
              Medication:{" "}
              <span className="text-gray-600 dark:text-gray-300">{alert.medication}</span>
            </p>
            <p className="text-gray-400 dark:text-gray-500 text-sm mt-0.5">
              Current: {alert.currentTabs} tabs / Required: {alert.requiredTabs}{" "}
              tabs
            </p>
          </div>

          <div className="text-right">
            <div className={`font-bold text-lg ${currentColors.alertText}`}>
              {alert.daysRemaining} days remaining
            </div>
            <div className="text-[10px] uppercase font-bold text-gray-400 dark:text-gray-500 tracking-widest mt-1">
              Estimated Out: {alert.estimatedOutDate}
            </div>
          </div>
        </div>

        {/* Progress Bar & Buttons */}
        <div className="flex items-end justify-between mt-6">
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 bg-[#55B9EB] hover:bg-[#4AA8D8] text-white px-5 py-2.5 rounded-full font-bold text-sm shadow-sm hover:shadow transition-all">
              {alert.actionType === "contact" ? (
                <Phone size={16} />
              ) : (
                <Calendar size={16} />
              )}
              {alert.actionType === "contact"
                ? "Contact Patient"
                : "Schedule Refill"}
            </button>
            <button className="flex items-center gap-2 bg-gray-50 hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 px-5 py-2.5 rounded-full font-bold text-sm border border-gray-100 hover:border-gray-200 dark:border-gray-600 dark:hover:border-gray-500 transition-all">
              View Patient Profile
            </button>
          </div>

          <div className="w-64">
            <div
              className={`font-bold text-sm text-right mb-2 ${currentColors.alertText}`}
            >
              {alert.stockPercentage}% Stock Remaining
            </div>
            <div className="h-2 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className={`h-full ${currentColors.progress} rounded-full`}
                style={{ width: `${alert.stockPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
