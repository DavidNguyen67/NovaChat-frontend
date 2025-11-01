/* eslint-disable prettier/prettier */
'use client';

import { motion } from 'framer-motion';
import { Button, Card, CardBody } from '@heroui/react';
import { Icon } from '@iconify/react';
import { useRouter } from 'next/navigation';

const LandingPage = () => {
  const router = useRouter();

  return (
    <div className="w-full h-full flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl w-full mb-16"
        initial={{ opacity: 0, y: 30 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <h1 className="text-5xl sm:text-6xl font-extrabold mb-4">
          <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
            Welcome to NovaChat
          </span>
          🚀
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg mb-8">
          A modern real-time chat experience — built for speed, simplicity, and
          connection.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button
            color="primary"
            size="lg"
            startContent={<Icon icon="mdi:rocket-launch-outline" />}
            onPress={() => router.push('/login')}
          >
            Get Started
          </Button>
          <Button
            size="lg"
            startContent={<Icon icon="mdi:eye-outline" />}
            variant="flat"
            onPress={() => {
              window.open(process.env.AUTHOR_PROFILE, '_blank');
            }}
          >
            Learn More
          </Button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl w-full">
        {[
          {
            icon: 'mdi:chat-processing-outline',
            title: 'Real-time Messaging',
            desc: 'Instant communication with friends and teams, powered by WebSocket technology.',
          },
          {
            icon: 'mdi:shield-check-outline',
            title: 'Secure & Private',
            desc: 'End-to-end encryption and smart moderation ensure your safety and privacy.',
          },
          {
            icon: 'mdi:palette-outline',
            title: 'Customizable Themes',
            desc: 'Personalize your experience with light, dark, or system themes.',
          },
        ].map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            transition={{ delay: 0.2 * i }}
            viewport={{ once: true }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <Card className="bg-white/10 dark:bg-gray-800/40 backdrop-blur-lg border border-white/10 shadow-md hover:shadow-lg transition-all duration-300 h-full">
              <CardBody className="flex flex-col items-center text-center gap-4 p-6">
                <Icon className="text-4xl text-primary" icon={item.icon} />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  {item.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">{item.desc}</p>
              </CardBody>
            </Card>
          </motion.div>
        ))}
      </div>

      <motion.footer
        animate={{ opacity: 1 }}
        className="mt-20 text-gray-500 dark:text-gray-400 text-sm"
        initial={{ opacity: 0 }}
        transition={{ delay: 0.6 }}
      >
        <p>
          © {new Date().getFullYear()} NovaChat. Crafted with ❤️ by your team.
        </p>
      </motion.footer>
    </div>
  );
};

export default LandingPage;
