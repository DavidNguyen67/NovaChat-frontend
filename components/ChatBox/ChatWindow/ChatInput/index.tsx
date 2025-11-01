/* eslint-disable no-console */
/* eslint-disable prettier/prettier */
'use client';
import { Button, Input, Tooltip } from '@heroui/react';
import { Icon } from '@iconify/react';
import React, { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';
import EmojiPicker, { Theme } from 'emoji-picker-react';

import { useChatRoom } from '../../hook';

import { INPUT_ACTIONS } from './config';

const ChatInput = () => {
  const { sendMessage } = useChatRoom();

  const [textValue, setTextValue] = useState<string>('');

  const [isRecording, setIsRecording] = useState<boolean>(false);

  const [showEmoji, setShowEmoji] = useState<boolean>(false);

  const textRef = useRef<string>('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const emojiPickerContainerRef = useRef<HTMLDivElement>(null);

  const handleSend = async () => {
    if (!textValue.trim()) return;

    await sendMessage.trigger({ content: textRef.current });
    setTextValue('');
    textRef.current = '';
  };

  const handleSelectFile = () => fileInputRef.current?.click();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;
    e.target.value = '';
    console.log('📁 Selected file:', file.name);
  };

  const handleVoice = () => setIsRecording((prev) => !prev);

  const handleEmoji = () => setShowEmoji((prev) => !prev);

  const handleSticker = () => console.log('🧩 Sticker picker opened');

  const handleGif = () => console.log('🎞️ GIF picker opened');

  const actionHandlers: Record<string, () => void> = {
    'mdi:microphone': handleVoice,
    'mdi:image-outline': handleSelectFile,
    'mdi:sticker-emoji': handleSticker,
    'mdi:gif': handleGif,
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        emojiPickerContainerRef.current &&
        !emojiPickerContainerRef.current.contains(event.target as Node)
      ) {
        setShowEmoji(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative flex items-center gap-3 px-4 py-3 border-t border-default-200 rounded-b-lg mt-auto bg-content1/70 backdrop-blur-md h-[65px]">
      <div className="flex items-center gap-2 text-default-500">
        {INPUT_ACTIONS.map((a) => {
          const onClick = actionHandlers[a.icon];
          const isMic = a.icon === 'mdi:microphone';

          return (
            <Tooltip key={a.icon} content={a.label} placement="top">
              <motion.div
                transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Icon
                  className={clsx(
                    'text-xl cursor-pointer transition-colors duration-300',
                    isMic && isRecording
                      ? 'text-danger animate-pulse'
                      : 'hover:text-primary',
                  )}
                  icon={
                    isMic && isRecording ? 'mdi:stop-circle-outline' : a.icon
                  }
                  onClick={onClick}
                />
              </motion.div>
            </Tooltip>
          );
        })}
      </div>

      <input
        ref={fileInputRef}
        accept="image/*,video/*"
        className="hidden"
        type="file"
        onChange={handleFileChange}
      />

      <Input
        classNames={{
          inputWrapper: clsx(
            'rounded-full flex-1 px-4 bg-default-100/70 dark:bg-gray-800/70',
            'text-foreground focus-within:ring-2 focus-within:ring-primary/50 transition-all duration-300',
          ),
          input: 'text-sm text-foreground placeholder:text-default-400',
        }}
        placeholder="Aa"
        value={textValue}
        variant="flat"
        onChange={(e) => {
          setTextValue(e.target.value);
          textRef.current = e.target.value;
        }}
        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
      />

      <div className="flex items-center gap-2">
        <Tooltip content="Emoji" placement="top">
          <motion.div whileTap={{ scale: 0.9 }}>
            <Icon
              className={clsx(
                'text-[22px] cursor-pointer text-default-500 transition-colors duration-300',
                showEmoji && 'text-primary',
              )}
              icon="mdi:emoticon-outline"
              onClick={handleEmoji}
            />
          </motion.div>
        </Tooltip>

        <motion.div
          animate={{
            scale: textValue.trim() ? 1.1 : 1,
            rotate: textValue.trim() ? 0 : 0,
          }}
          initial={false}
          transition={{ type: 'spring', stiffness: 250, damping: 15 }}
        >
          <Button
            isIconOnly
            className="transition-all duration-150 hover:scale-105"
            radius="full"
            onPress={handleSend}
          >
            <Icon
              className={clsx(
                'text-xl transition-colors duration-300',
                textValue.trim() ? 'text-primary' : 'text-default-500',
              )}
              icon={textValue.trim() ? 'mdi:send' : 'mdi:thumb-up'}
            />
          </Button>
        </motion.div>
      </div>

      <AnimatePresence>
        {showEmoji && (
          <motion.div
            ref={emojiPickerContainerRef}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="absolute bottom-[70px] right-4 z-50 shadow-xl rounded-2xl overflow-hidden"
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <EmojiPicker
              allowExpandReactions
              autoFocusSearch
              theme={Theme.AUTO}
              onEmojiClick={(emojiData) => {
                setTextValue((prev) => prev + emojiData.emoji);
                textRef.current += emojiData.emoji;
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChatInput;
