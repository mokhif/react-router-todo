import React from "react";
import { Button } from "./ui/button";
import { Spinner } from "./ui/spinner";
const LoadingButton = ({ isPending, onClick, children }) => {
  return <Button onClick={onClick}>{isPending ? <Spinner/> : children}</Button>;
};

export default LoadingButton;
