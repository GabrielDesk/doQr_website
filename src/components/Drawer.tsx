import { useEffect, useState } from "react";
import { FaCheck, FaMinusSquare } from "react-icons/fa";
import { IoArrowBackSharp } from "react-icons/io5";

interface IDrawer {
  shouldOpen: boolean;
  onClose: () => void; //close callback
  fstButton_color?: string;
  fstButton_text?: string;
  fstButton_fnc?: () => void;
  scndButton_color?: string;
  scndButton_text?: string;
  scndButton_fnc?: () => void;
  message: string;
  title_action?: string;
  shoulDisableButtons?: boolean;
}

export const Drawer = ({
  shouldOpen,
  onClose,
  fstButton_color,
  fstButton_text,
  fstButton_fnc,
  scndButton_color,
  scndButton_text,
  scndButton_fnc,
  message,
  title_action,
  shoulDisableButtons,
}: IDrawer) => {
  const [showDrawer, setShowDrawer] = useState(shouldOpen);

  useEffect(() => {
    setShowDrawer(shouldOpen);
  }, [shouldOpen]);

  const handleClose = () => {
    setShowDrawer(false);
    onClose(); // Notify Dashboard of closure
  };

  return showDrawer ? (
    <div className="bg-background shadow-sm w-[50%] md:w-[20%] fixed z-50 top-0 right-0 h-screen animate-slide-in-right delay-700 backdrop-blur-sm border-x-2 border-text/10 transform translate-x-full">
      <div className="flex flex-col md:p-7 h-full w-full items-start justify-between">
        <header className="flex flex-row px-5 md:px-0 pt-5 gap-5 items-start justify-center">
          <button onClick={handleClose}>
            <IoArrowBackSharp className="text-3xl text-primary" />
          </button>
          <h6 className="text-[1rem] md:text-lg font-clash font-medium  text-primary">
            {title_action ?? ""}
          </h6>
        </header>

        <div className="flex flex-col overflow-hidden h-full mb-20 px-5 md:px-0 gap-5 items-start justify-end">
          <h6 className="text-[1rem] md:text-xl font-clash font-medium text-text">
            {message ?? "Você tem certeza que deseja executar esta ação?"}
          </h6>
          <h6 className="text-[1rem] font-clash font-medium text-gray-300">
            <u>Doqr!</u>
          </h6>
        </div>

        <div className="flex flex-col w-full mb-20 md:mb-0 px-3 md:px-0 gap-5">
          <button
            disabled={shoulDisableButtons}
            onClick={fstButton_fnc}
            className={`${fstButton_color ?? "bg-red-600"} ${
              shoulDisableButtons ? "opacity-50 cursor-not-allowed" : ""
            } p-2 w-full items-center md:justify-evenly flex md:flex-initial flex-row border-2 rounded-md gap-2`}
          >
            <FaMinusSquare className="text-background text-2xl md:text-xl" />
            <span className="font-bold">{fstButton_text ?? "Cancelar"}</span>
          </button>

          <button
            disabled={shoulDisableButtons}
            onClick={scndButton_fnc}
            className={`${scndButton_color ?? "bg-primary"} ${
              shoulDisableButtons ? "opacity-50 cursor-not-allowed" : ""
            } p-2 w-full items-center md:justify-evenly flex md:flex-initial flex-row border-2 rounded-md gap-2`}
          >
            <FaCheck className="text-background text-2xl md:text-xl" />
            <span className="font-bold">{scndButton_text ?? "Confirmar"}</span>
          </button>
        </div>
      </div>
    </div>
  ) : null;
};
