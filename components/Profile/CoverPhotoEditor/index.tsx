/* eslint-disable prettier/prettier */
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from '@heroui/react';
import { Icon } from '@iconify/react';
import React, { useEffect, useRef, useState } from 'react';
import { PhotoProvider, PhotoView } from 'react-photo-view';
import { useFormik } from 'formik';

import { CoverPhotoFormValues, coverPhotoSchema } from './config';
import CoverReposition from './CoverReposition';

import { blobUrlToFile } from '@/helpers';

interface CoverPhotoEditorProps {
  coverUrl: string;
}

const CoverPhotoEditor: React.FC<CoverPhotoEditorProps> = ({ coverUrl }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [isRepositioning, setIsRepositioning] = useState(false);

  const avatarInputRef = useRef<HTMLInputElement>(null);

  const prevFile = useRef<File | null>(null);

  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const onSubmit = async (values: CoverPhotoFormValues) => {};

  const initialValues = useRef<CoverPhotoFormValues>({
    avatarFile: undefined,
  });

  const formik = useFormik<CoverPhotoFormValues>({
    validationSchema: coverPhotoSchema,
    initialValues: initialValues.current,
    onSubmit,
    validateOnBlur: true,
    validateOnChange: true,
  });

  const handleRemoveAvatar = () => {
    prevFile.current = null;
    setAvatarPreview(null);
    formik.resetForm();
  };

  const handleAvatarChange = (file: File) => {
    if (file) {
      prevFile.current = file;
      formik.setFieldTouched('avatarFile', true);

      formik.setFieldValue('avatarFile', file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleInitFormValues = async () => {
    if (!coverUrl) return;
    setAvatarPreview(coverUrl);
    const file = await blobUrlToFile(coverUrl);

    handleAvatarChange(file);
  };

  useEffect(() => {
    handleInitFormValues();
  }, [coverUrl]);

  return (
    <>
      {isRepositioning ? (
        <CoverReposition
          avatarPreview={avatarPreview!}
          onCancel={() => setIsRepositioning(false)}
          onSave={(offsetY) => {
            setIsRepositioning(false);
          }}
        />
      ) : (
        <PhotoProvider>
          <PhotoView src={avatarPreview!}>
            <Image
              alt="cover"
              className="w-full h-full object-cover rounded-b-2xl shadow-sm cursor-zoom-in"
              classNames={{
                wrapper: '!max-w-full w-full !h-full !max-h-full',
                img: '!h-full !max-h-full',
              }}
              src={avatarPreview!}
            />
          </PhotoView>
        </PhotoProvider>
      )}

      {!isRepositioning && (
        <div className="absolute bottom-4 right-4 z-20">
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Button
                className="bg-white/80 hover:bg-white text-gray-700 font-medium shadow-md backdrop-blur-sm"
                color="default"
                radius="lg"
                startContent={<Icon icon="mdi:camera-outline" />}
                variant="shadow"
              >
                Edit cover
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Cover photo actions">
              <DropdownItem
                key="choose"
                startContent={<Icon icon="mdi:image-multiple-outline" />}
              >
                Choose from library
              </DropdownItem>
              <DropdownItem
                key="upload"
                startContent={<Icon icon="mdi:upload-outline" />}
                onClick={() => avatarInputRef?.current?.click()}
              >
                Upload new photo
              </DropdownItem>
              <DropdownItem
                key="reposition"
                startContent={<Icon icon="mdi:crop" />}
                // onClick={() => setIsRepositioning(true)}
              >
                Reposition
              </DropdownItem>
              <DropdownItem
                key="remove"
                className="text-danger"
                color="danger"
                startContent={<Icon icon="mdi:delete-outline" />}
                onClick={onOpen}
              >
                Remove
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>

          <input
            ref={avatarInputRef}
            accept="image/*"
            className="hidden"
            id="avatar"
            name="avatarFile"
            type="file"
            onChange={(event) => handleAvatarChange(event.target.files![0])}
          />
        </div>
      )}

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="text-lg font-semibold">
                Confirm delete
              </ModalHeader>
              <ModalBody>
                Are you sure you want to remove this cover photo?
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button
                  color="danger"
                  onPress={() => {
                    handleRemoveAvatar();
                    onClose();
                  }}
                >
                  Remove
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default CoverPhotoEditor;
