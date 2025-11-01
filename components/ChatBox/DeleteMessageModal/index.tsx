/* eslint-disable prettier/prettier */
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@heroui/react';
import React from 'react';
import { Icon } from '@iconify/react';

import { useChatRoom } from '../hook';

const DeleteMessageModal = () => {
  const { selectedMode, clearSelectModal } = useChatRoom();

  const isOpen = selectedMode?.data?.isOpenModal;

  const mode = selectedMode?.data?.mode;

  const selectedMessages = selectedMode?.data?.selectedMessages || [];

  const onOpenChange = (isOpen: boolean) => {
    selectedMode.mutate({
      isOpenModal: isOpen,
      selectedMessages: selectedMode?.data?.selectedMessages || [],
      mode: selectedMode?.data?.mode,
      isSelectMode: selectedMode?.data?.isSelectMode,
    });
  };

  const onConfirm = () => {
    console.log('Deleting', selectedMessages);
    clearSelectModal();
  };

  return (
    <Modal isOpen={isOpen && mode === 'delete'} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex items-center gap-2">
              <Icon
                className="text-danger text-2xl"
                icon="mdi:alert-circle-outline"
              />
              <span className="font-semibold text-lg">Delete Messages</span>
            </ModalHeader>

            <ModalBody>
              <p className="text-default-500 text-sm">
                Are you sure you want to delete{' '}
                <span className="font-semibold text-foreground">
                  {selectedMessages.length}
                </span>{' '}
                {selectedMessages.length > 1 ? 'messages' : 'message'}? <br />
                This action cannot be undone.
              </p>
            </ModalBody>

            <ModalFooter>
              <Button
                className="hover:opacity-80"
                color="default"
                variant="light"
                onPress={onClose}
              >
                Cancel
              </Button>
              <Button
                className="font-medium"
                color="danger"
                startContent={<Icon icon="mdi:trash-can-outline" />}
                onPress={onConfirm}
              >
                Delete
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default DeleteMessageModal;
