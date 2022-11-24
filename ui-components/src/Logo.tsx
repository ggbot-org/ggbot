import type { FC } from "react";

type Props = {
  animated?: boolean;
  size?: number;
};

export const Logo: FC<Props> = ({ animated, size }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      fill="none"
      width={size}
      height={size}
    >
      <circle cx="256" cy="256" r="255" />
      <path fill="#16e0c8" d="M96 154.426l160 92.376v189L96 343.426z">
        {animated && (
          <animate
            begin="0.4s"
            attributeName="fill-opacity"
            values="0;1"
            dur="1s"
            repeatCount="1"
          />
        )}
      </path>
      <path fill="#6adbc6" d="M256 247.198l160-92.376v189l-160 92.376z">
        {animated && (
          <animate
            begin="0.8s"
            attributeName="fill-opacity"
            values="0;1"
            dur="1s"
            repeatCount="1"
          />
        )}
      </path>
      <path
        fill="#28ebc6"
        d="M256.142 63.392l160.09 92.207-160.09 92.207-160.089-92.207z"
      >
        {animated && (
          <animate
            begin="0s"
            attributeName="fill-opacity"
            values="0;1"
            dur="1s"
            repeatCount="1"
          />
        )}
      </path>
      <path d="M416 155L256 64v107l66 38z">
        {animated && (
          <animate
            begin="0.4s"
            attributeName="fill-opacity"
            values="0;0.17"
            dur="0.1s"
            repeatCount="1"
            fill="freeze"
          />
        )}
      </path>
      <path d="M256 435V330l67-39 93 52z">
        {animated && (
          <animate
            begin="0.4s"
            attributeName="fill-opacity"
            values="0;0.17"
            dur="0.1s"
            repeatCount="1"
            fill="freeze"
          />
        )}
      </path>
      <path d="M189 210l-92-55v188l92-52z">
        {animated && (
          <animate
            begin="0.4s"
            attributeName="fill-opacity"
            values="0;0.17"
            dur="0.1s"
            repeatCount="1"
            fill="freeze"
          />
        )}
      </path>
      <g fill="#333" fillOpacity=".17">
        <path d="M195 213.583l60 34.641v74l-60-34.64z">
          {animated && (
            <animate
              begin="0s"
              attributeName="width"
              values="0;60"
              dur="0.4s"
              repeatCount="1"
            />
          )}
        </path>
        <path d="M257 248.621l60-34.641v74l-60 34.641z">
          {animated && (
            <animate
              begin="0s"
              attributeName="width"
              values="0;60"
              dur="0.4s"
              repeatCount="1"
            />
          )}
        </path>
        <path d="M256.142 177.498l60.034 34.577-60.034 34.578-60.033-34.578z">
          {animated && (
            <animate
              begin="0s"
              attributeName="width"
              values="0;60"
              dur="0.4s"
              repeatCount="1"
            />
          )}
        </path>
      </g>
      <path
        d="M416 155L256 64 97 155v188l159 92 160-92V230l-66 41"
        stroke="#09eae5"
        strokeWidth="17"
        strokeDasharray="1114"
      >
        {animated && (
          <animate
            attributeName="stroke-dashoffset"
            values="1114;0"
            dur="1.2s"
            repeatCount="1"
          />
        )}
      </path>
      <circle cx="416" cy="155" r="9" fill="#09eae5" />
      <circle cx="350" cy="271" r="0" fill="#09eae5">
        {animated && (
          <animate
            attributeName="r"
            values="0;17;9"
            begin="1.17s"
            dur="0.25s"
            repeatCount="1"
            fill="freeze"
          />
        )}
      </circle>
      <path
        d="M322 209l-66-38-67 39v81l67 39 67-39v-41l-38 21"
        stroke="#333"
        strokeWidth="17"
        strokeDasharray="1114"
      />
      <circle cx="322" cy="209" r="9" fill="#333" />
      <circle cx="285" cy="271" r="9" fill="#333" />
    </svg>
  );
};
