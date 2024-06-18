import { useState, useEffect } from "react";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import { Button } from "@/components/ui/button"
import { siteConfig } from "@/config/site"

export default function ScrollButton() {
  return (
    <div className="fixed bottom-0 right-0 z-[40] p-6">
      <Button passhref="true" className="bg-[#010101]/90">
        <FaAngleDown />
      </Button>
    </div>
  );
};

