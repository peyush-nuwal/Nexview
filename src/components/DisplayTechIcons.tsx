"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { getTechLogos } from "../../lib/utils";

type Props = {
  techStack: string[];
};

const DisplayTechIcons = ({ techStack }: Props) => {
  const [techIcons, setTechIcons] = useState<{ tech: string; url: string }[]>(
    []
  );

  useEffect(() => {
    const fetchIcons = async () => {
      const icons = await getTechLogos(techStack);
      setTechIcons(icons);
    };

    fetchIcons();
  }, [techStack]);

  return (
    <div className="flex flex-row">
      {techIcons.slice(0, 3).map(({ tech, url }, idx) => (
        <div
          key={idx}
          className={`relative group bg-dark-300 rounded-full p-2 flex-center ${
            idx > 0 ? "-ml-3" : ""
          }`}
        >
          <span className="tech-tooltip">{tech}</span>
          <Image
            src={url}
            alt={tech}
            width={100}
            height={100}
            className="size-5"
          />
        </div>
      ))}
    </div>
  );
};

export default DisplayTechIcons;
