"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "../icons";
import { cn } from "./utils";
import { buttonVariants } from "./button";

interface CalendarProps {
  mode?: "single" | "multiple" | "range";
  selected?: Date | Date[] | { from?: Date; to?: Date };
  onSelect?: (date: Date | Date[] | { from?: Date; to?: Date } | undefined) => void;
  disabled?: (date: Date) => boolean;
  className?: string;
  initialFocus?: boolean;
}

function Calendar({
  className,
  mode = "single",
  selected,
  onSelect,
  disabled,
  ...props
}: CalendarProps) {
  const [currentMonth, setCurrentMonth] = React.useState(new Date());

  const daysInMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0
  ).getDate();

  const firstDayOfMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1
  ).getDay();

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const dayNames = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const handleDateClick = (day: number) => {
    const clickedDate = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day
    );

    if (disabled && disabled(clickedDate)) return;

    if (mode === "single") {
      onSelect?.(clickedDate);
    } else if (mode === "range") {
      onSelect?.(clickedDate);
    }
  };

  const isSelected = (day: number) => {
    if (!selected) return false;

    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    // Reset hours to compare dates only
    date.setHours(0, 0, 0, 0);

    if (mode === "single" && selected instanceof Date) {
      const selectedDate = new Date(selected);
      selectedDate.setHours(0, 0, 0, 0);
      return date.getTime() === selectedDate.getTime();
    }

    if (mode === "range" && typeof selected === 'object' && 'from' in selected) {
      const from = selected.from ? new Date(selected.from) : null;
      const to = selected.to ? new Date(selected.to) : null;

      if (from) from.setHours(0, 0, 0, 0);
      if (to) to.setHours(0, 0, 0, 0);

      if (from && !to) {
        return date.getTime() === from.getTime();
      }
      if (from && to) {
        return date.getTime() >= from.getTime() && date.getTime() <= to.getTime();
      }
    }
    return false;
  };

  const isToday = (day: number) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    date.setHours(0, 0, 0, 0);
    return date.getTime() === today.getTime();
  };

  const days = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(<div key={`empty-${i}`} className="p-0" />);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    const isDisabled = disabled && disabled(date);
    const selected = isSelected(day);

    days.push(
      <button
        key={day}
        onClick={() => handleDateClick(day)}
        disabled={isDisabled}
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "h-8 w-8 p-0 font-normal",
          selected &&
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
          isToday(day) && !selected && "bg-accent text-accent-foreground",
          isDisabled && "text-muted-foreground opacity-50 cursor-not-allowed"
        )}
      >
        {day}
      </button>
    );
  }

  return (
    <div className={cn("p-3", className)} {...props}>
      <div className="flex flex-col gap-4">
        <div className="flex justify-center pt-1 relative items-center">
          <div className="text-sm">
            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </div>
          <div className="flex items-center gap-1 absolute right-0">
            <button
              onClick={previousMonth}
              className={cn(
                buttonVariants({ variant: "outline" }),
                "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
              )}
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={nextMonth}
              className={cn(
                buttonVariants({ variant: "outline" }),
                "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
              )}
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
        <div className="w-full border-collapse">
          <div className="flex">
            {dayNames.map((name) => (
              <div
                key={name}
                className="text-muted-foreground w-8 text-[0.8rem] text-center"
              >
                {name}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-y-2 mt-2">
            {days}
          </div>
        </div>
      </div>
    </div>
  );
}

export { Calendar };
