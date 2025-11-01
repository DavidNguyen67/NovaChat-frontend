/* eslint-disable prettier/prettier */
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tooltip } from '@heroui/react';
import { Icon } from '@iconify/react';
import clsx from 'clsx';

import { Message } from '@/interfaces/response';

interface MessageActionsProps {
  isSelf?: boolean;
  show?: boolean;
  msg: Message;
}

export const MessageActions: React.FC<MessageActionsProps> = ({
  isSelf,
  show,
  msg,
}) => {
  const handleCopy = () => navigator.clipboard.writeText(msg.content);
  const handleForward = () => console.log('Forward', msg.id);
  const handleReact = () => console.log('React', msg.id);
  const handleRecall = () => console.log('Recall', msg.id);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className={clsx(
            'absolute -top-6 flex gap-1 px-1.5 py-[3px] rounded-md shadow-md z-10',
            'bg-background/90 backdrop-blur-md border border-content2/30',
            isSelf ? '-left-2 flex-row-reverse' : '-right-2 flex-row',
          )}
          exit={{ opacity: 0, scale: 0.9, y: -5 }}
          initial={{ opacity: 0, scale: 0.9, y: -5 }}
          transition={{ duration: 0.15 }}
        >
          <Tooltip content="Copy" placement="top">
            <button
              className="p-1 hover:text-primary transition-colors"
              onClick={handleCopy}
            >
              <Icon className="text-lg" icon="mdi:content-copy" />
            </button>
          </Tooltip>

          <Tooltip content="Forward" placement="top">
            <button
              className="p-1 hover:text-primary transition-colors"
              onClick={handleForward}
            >
              <Icon className="text-lg" icon="mdi:forward" />
            </button>
          </Tooltip>

          <Tooltip content="React" placement="top">
            <button
              className="p-1 hover:text-primary transition-colors"
              onClick={handleReact}
            >
              <Icon className="text-lg" icon="mdi:emoticon-happy-outline" />
            </button>
          </Tooltip>

          {isSelf && (
            <Tooltip content="Recall" placement="top">
              <button
                className="p-1 hover:text-danger transition-colors"
                onClick={handleRecall}
              >
                <Icon className="text-lg" icon="mdi:delete-outline" />
              </button>
            </Tooltip>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
