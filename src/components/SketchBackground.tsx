import React from "react";
import styled from "@emotion/styled";

const StyledDiv = styled.div`
    position: fixed;
    z-index: -9;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
`;

interface SketchBackgroundProps {
    /** The background colour of the div */
    color: string;
}

/** A background div to override the default page background colour */
export const SketchBackground = ({ color }: SketchBackgroundProps) => {
    return <StyledDiv style={{ backgroundColor: color }} />;
};
