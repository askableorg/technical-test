import * as React from "react";
import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";

const LoadingWrapper = styled.i`
  display: block;
  position: absolute;
  top: 50%;
  width: 100%;
  left: 0;
  margin: -0.5em auto 0;
  line-height: 1;
`;

const bounce = keyframes`
  from {
    transform:rotate(0deg);
  }
  to {
    transform:rotate(360deg);
   }
`;

const LoadingSVG = styled.svg`
  width: 2rem;
  height: 2rem;
  animation-duration: 0.5s;
  animation-name: ${bounce};
  animation-direction: linear;
  animation-iteration-count: infinite;
`;

const Loading: React.FC = () => (
  <LoadingWrapper
    className="loading-wrapper"
    style={{
      display: "inline-block",
      lineHeight: 1,
      transform: "translate(0, 0)",
    }}
  >
    <p>Loading...</p>
    <LoadingSVG
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 16 16`}
      className="loading-svg"
    >
      <g fill="none">
        <g stroke="#AADD99" strokeWidth="2">
          <g transform="translate(1.000000, 1.000000)">
            <circle strokeOpacity="0.5" cx="7" cy="7" r="7" />
            <path d="M14,7 C14,3.13444444 10.8655556,0 7,0" />
          </g>
        </g>
      </g>
    </LoadingSVG>
  </LoadingWrapper>
);

export { Loading };
