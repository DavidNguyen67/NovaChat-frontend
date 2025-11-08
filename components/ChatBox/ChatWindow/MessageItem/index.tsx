/* eslint-disable prettier/prettier */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useState } from 'react';
import clsx from 'clsx';
import { Avatar, Checkbox, Image, Link, Spinner } from '@heroui/react';
import { Icon } from '@iconify/react';
import { PhotoProvider, PhotoView } from 'react-photo-view';

import { useChatRoom } from '../../hook';
import PhotoOverlay from '../PhotoOverlay';

import { MessageActions } from './MessageActions';

import { useAccount } from '@/hooks/auth/useAccount';
import { formatFileSize, getFileIcon, getUrlMedia } from '@/helpers';
import { Message } from '@/interfaces/response';

interface MessageItemProps {
  data: Message;
  prevData: Message | null;
  nextData: Message | null;
}

const MessageItem = ({ data, nextData }: MessageItemProps) => {
  const msg = data;

  const { accountInfo } = useAccount();

  const { chatRoom, selectedMode, handleSelectMessage } = useChatRoom();

  const isSelf = msg?.sender?.id === accountInfo.data?.id;

  const showAvatar = nextData?.sender?.id !== msg?.sender?.id;

  const [hovered, setHovered] = useState(false);

  const isInModeSelect = selectedMode?.data?.isSelectMode;

  const mode = selectedMode?.data?.mode;

  const isSelected = selectedMode?.data?.selectedMessages.some(
    (m) => m.id === msg.id,
  );

  const renderAttachments = () => {
    if (!msg.attachments?.length) return null;

    return (
      <div
        className={clsx(
          'flex flex-col gap-2',
          isSelf ? 'items-end' : 'items-start',
        )}
      >
        <PhotoProvider
          bannerVisible={false}
          loadingElement={<Spinner color="primary" size="sm" />}
          maskOpacity={0.9}
          overlayRender={PhotoOverlay}
        >
          {msg.attachments.map((file) => {
            const isImage = file.type?.startsWith('image/');
            const isVideo = file.type?.startsWith('video/');
            const isAudio = file.type?.startsWith('audio/');
            const fileUrl = getUrlMedia(file.url);

            if (isImage) {
              return (
                <PhotoView key={file.id} src={getUrlMedia(file.url)}>
                  <Image
                    alt={file.name || 'attachment'}
                    className="rounded-xl max-h-60 object-cover cursor-pointer hover:opacity-90 transition"
                    src={getUrlMedia(file.thumbnailUrl || file.url)}
                  />
                </PhotoView>
              );
            }

            if (isVideo) {
              return (
                <video
                  key={file.id}
                  controls
                  className="rounded-xl max-h-64 border border-gray-300 dark:border-gray-700"
                  src={fileUrl}
                >
                  <track
                    kind="captions"
                    src={file.thumbnailUrl || ''}
                    srcLang="en"
                  />
                </video>
              );
            }

            if (isAudio) {
              return (
                <audio
                  key={file.id}
                  controls
                  className="w-full rounded-md"
                  src={fileUrl}
                >
                  <track
                    kind="captions"
                    src={file.thumbnailUrl || ''}
                    srcLang="en"
                  />
                </audio>
              );
            }

            return (
              <Link
                key={file.id}
                download
                className={clsx(
                  'flex items-center justify-between gap-3 px-4 py-3 rounded-xl border shadow-sm transition-all w-80',
                  'bg-content2 hover:bg-content3 hover:shadow-md active:scale-[0.99]',
                )}
                href={fileUrl}
                target="_blank"
                title={`Download ${file.name || 'File attachment'}`}
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="flex items-center justify-center size-9 rounded-lg bg-primary/10 text-primary text-lg">
                    <Icon
                      className="size-5"
                      icon={getFileIcon(file.type, file.name)}
                    />
                  </div>

                  <div className="flex flex-col min-w-0">
                    <span className="font-medium truncate text-foreground">
                      {file.name || 'File attachment'}
                    </span>
                    {file.size && (
                      <span className="text-xs text-foreground/70">
                        {formatFileSize(file.size)}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center text-sm text-primary hover:text-primary/80 transition">
                  <Icon className="size-5" icon="mdi:download" />
                  <span className="ml-1 hidden sm:inline">Tải xuống</span>
                </div>
              </Link>
            );
          })}
        </PhotoProvider>
      </div>
    );
  };

  return (
    <div
      className={clsx(
        'flex w-full px-4 group relative transition-all duration-200 cursor-default',
        isSelf ? 'justify-end' : 'justify-start',
        showAvatar ? 'pb-4' : 'pb-1',
        isInModeSelect && 'cursor-pointer select-none',
      )}
      onClick={() => {
        if (isInModeSelect) {
          handleSelectMessage(msg);
        }
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {isInModeSelect && !isSelf && (
        <Checkbox
          color={mode === 'delete' ? 'danger' : 'primary'}
          isSelected={isSelected}
          size="lg"
          onValueChange={() => handleSelectMessage(msg)}
        />
      )}

      {/* Tin nhắn từ người khác */}
      {!isSelf && (
        <div className="flex items-end gap-3 max-w-[80%] relative">
          {!isInModeSelect && (
            <>
              {showAvatar ? (
                <div className="size-8 flex items-center justify-center object-center">
                  <Avatar
                    className="size-8 shadow-sm"
                    fallback={chatRoom.data?.name?.charAt(0) ?? '?'}
                    radius="full"
                    src={getUrlMedia(msg?.sender?.avatarUrl!)}
                  />
                </div>
              ) : (
                <div className="size-8" />
              )}
            </>
          )}

          <div className="flex flex-col gap-0.5">
            <div
              className={clsx(
                'relative rounded-2xl px-4 py-2 text-sm leading-[1.45] break-words shadow-sm transition-all duration-200 text-left',
                'bg-content1 text-foreground/90 dark:bg-gray-800 dark:text-gray-100 mr-auto w-fit',
              )}
              style={{
                borderBottomLeftRadius:
                  nextData?.sender === msg?.sender ? '0.5rem' : '1rem',
              }}
            >
              {msg?.content && <div>{msg.content}</div>}
              {!isInModeSelect && <MessageActions msg={msg} show={hovered} />}
            </div>
            {renderAttachments()}
          </div>
        </div>
      )}

      {isSelf && (
        <div className="flex gap-2 max-w-[70%] flex-row-reverse relative items-center">
          {isInModeSelect && (
            <Checkbox
              color={mode === 'delete' ? 'danger' : 'primary'}
              isSelected={isSelected}
              size="lg"
              onValueChange={() => handleSelectMessage(msg)}
            />
          )}

          <div className="flex flex-col gap-0.5">
            <div
              className={clsx(
                'relative rounded-2xl px-4 py-2 text-sm leading-[1.45] break-words shadow-sm transition-all duration-200 text-left',
                'bg-gradient-to-br from-blue-500 to-purple-500 text-white dark:from-blue-600 dark:to-purple-600 w-fit ml-auto',
              )}
              style={{
                borderBottomRightRadius:
                  nextData?.sender === msg?.sender ? '0.5rem' : '1rem',
              }}
            >
              {msg?.content && <div>{msg.content}</div>}
              {!isInModeSelect && <MessageActions msg={msg} show={hovered} />}
            </div>
            {renderAttachments()}
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageItem;
