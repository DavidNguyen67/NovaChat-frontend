/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tooltip } from '@heroui/react';
import { Icon } from '@iconify/react';
import clsx from 'clsx';

import { Message } from '@/interfaces/response';
import { useAccount } from '@/hooks/auth/useAccount';
import { useChatRoom } from '@/components/ChatBox/hook';

interface MessageActionsProps {
  show?: boolean;
  msg: Message;
}

export const MessageActions: React.FC<MessageActionsProps> = ({
  show,
  msg,
}) => {
  const [copied, setCopied] = useState(false);

  const { accountInfo } = useAccount();

  const isSelf = msg.sender?.id === accountInfo?.data?.id;

  const { toggleSelectMode } = useChatRoom();

  const [showReactions, setShowReactions] = useState(false);

  const emojiList = ['❤️', '😂', '😮', '😢', '👍', '👎'];

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(msg.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 1000);
    } catch (err) {
      console.error('Copy failed:', err);
    }
  };

  useEffect(() => {
    if (!show) setShowReactions(false);
  }, [show]);

  const onForward = (message: Message) => {
    toggleSelectMode('forward', message);
  };

  const onReact = (message: Message, emoji: string) => {
    console.log('Reacted with emoji:', emoji, 'to message:', message);
  };

  const onRecall = (message: Message) => {
    toggleSelectMode('delete', message);
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className={clsx(
            'absolute -top-7 flex gap-1.5 px-1.5 py-[3px] rounded-md shadow-md z-20 select-none',
            'bg-background/90 backdrop-blur-md border border-content2/30',
            isSelf ? '-left-3' : '-right-3 flex-row',
          )}
          exit={{ opacity: 0, scale: 0.9, y: -5 }}
          initial={{ opacity: 0, scale: 0.95, y: -5 }}
          transition={{ duration: 0.18, ease: 'easeOut' }}
        >
          <Tooltip content={copied ? 'Copied' : 'Copy'} placement="top">
            <motion.button
              className="p-1 hover:text-primary transition-colors relative"
              transition={{ duration: 0.15 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleCopy}
            >
              <AnimatePresence initial={false} mode="wait">
                {copied ? (
                  <motion.span
                    key="check"
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    exit={{ opacity: 0, scale: 0.6, rotate: 45 }}
                    initial={{ opacity: 0, scale: 0.6, rotate: -45 }}
                    transition={{ duration: 0.25 }}
                  >
                    <Icon className="text-lg text-success" icon="mdi:check" />
                  </motion.span>
                ) : (
                  <motion.span
                    key="copy"
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.6 }}
                    initial={{ opacity: 0, scale: 0.6 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Icon className="text-lg" icon="mdi:content-copy" />
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </Tooltip>

          <Tooltip content="Forward" placement="top">
            <motion.button
              className="p-1 hover:text-primary transition-colors"
              transition={{ duration: 0.15 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onForward?.(msg)}
            >
              <Icon className="text-lg" icon="mdi:forward" />
            </motion.button>
          </Tooltip>

          <motion.div
            className="relative"
            onHoverEnd={() => setTimeout(() => setShowReactions(false), 150)}
            onHoverStart={() => setShowReactions(true)}
          >
            <motion.button
              className="p-1 hover:text-primary transition-colors"
              transition={{ duration: 0.15 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Icon className="text-lg" icon="mdi:emoticon-happy-outline" />
            </motion.button>

            <AnimatePresence>
              {showReactions && (
                <motion.div
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  className={clsx(
                    'absolute -top-10 flex gap-2 rounded-full px-3 py-1 shadow-lg border border-content2/30',
                    'bg-background/95 backdrop-blur-lg',
                    isSelf
                      ? 'right-0 translate-x-1/2'
                      : 'left-0 -translate-x-1/2',
                  )}
                  exit={{ opacity: 0, scale: 0.8, y: 8 }}
                  initial={{ opacity: 0, scale: 0.8, y: 8 }}
                  transition={{ duration: 0.15, ease: 'easeOut' }}
                >
                  {emojiList.map((emoji) => (
                    <motion.button
                      key={emoji}
                      className="text-lg p-0.5"
                      transition={{ duration: 0.1 }}
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.8 }}
                      onClick={() => {
                        onReact?.(msg, emoji);
                        setShowReactions(false);
                      }}
                    >
                      {emoji}
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          <Tooltip content="Recall" placement="top">
            <motion.button
              className="p-1 hover:text-danger transition-colors"
              transition={{ duration: 0.15 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onRecall?.(msg)}
            >
              <Icon className="text-lg" icon="mdi:delete-outline" />
            </motion.button>
          </Tooltip>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
