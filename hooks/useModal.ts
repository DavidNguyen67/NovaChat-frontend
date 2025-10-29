/* eslint-disable prettier/prettier */
import { useState } from 'react';

export const useModal = <T = Record<string, unknown>>(initial?: {
  show: boolean;
  data?: T;
}) => {
  const [modal, setModal] = useState(initial);

  const handleShow = (data?: T) => {
    setModal({ show: true, data });
  };
  const handleHide = () => {
    setModal((prev) => ({ ...prev, show: false }));
  };

  const onChangeOpen = (isOpen: boolean) => {
    setModal((prev) => ({ ...prev, show: isOpen }));
  };

  return {
    isOpen: modal?.show,
    handleShow,
    handleHide,
    onChangeOpen,
    data: modal?.data,
  };
};
