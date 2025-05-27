import { DialogContext, DialogState } from "@/context/dialog";
import { useContext } from "react";

export const useDialog = () => {
  const context = useContext(DialogContext);
  if (!context) throw new Error("useDialog must be used within a DialogProvider");
  return context as DialogState;
};