/* eslint-disable prettier/prettier */
import { Button } from '@heroui/react';
import { Icon } from '@iconify/react';
import { useTheme } from 'next-themes';
import React from 'react';

const ThemeSwitcher = () => {
  const { theme, setTheme } = useTheme();

  const onChange = () => {
    theme === 'light' ? setTheme('dark') : setTheme('light');
  };

  return (
    <Button
      isIconOnly
      className="bg-gray-200 dark:bg-[#3A3B3C] hover:bg-gray-300 dark:hover:bg-[#4E4F50] rounded-full transition"
      size="sm"
      onPress={onChange}
    >
      <Icon
        className="text-2xl"
        icon={theme === 'light' ? 'mdi:weather-sunny' : 'mdi:weather-night'}
      />
    </Button>
  );
};

export default ThemeSwitcher;
