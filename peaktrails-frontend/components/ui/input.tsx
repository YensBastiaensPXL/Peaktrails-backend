import * as React from "react";
import { cn } from "@/lib/utils";
import { SearchIcon } from "@heroicons/react/solid"; // Zoekicoon van Heroicons

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", ...props }, ref) => {
    return (
      <div className="flex justify-center">
        <div className="relative w-[25rem] ">
          {/* Zoekicoon */}
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon className="h-5 w-5 text-gray-400" />
          </div>

          {/* Input veld */}
          <input
            type={type}
            placeholder="Search by trail name, location, or difficulty"
            className={cn(
              "h-[3.5rem] w-full pl-10 rounded-[2rem] text-[1rem]  focus:outline-none ",
              className
            )}
            ref={ref}
            {...props}
          />
        </div>
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
