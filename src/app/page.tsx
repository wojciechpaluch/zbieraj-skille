// app/page.tsx
'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function Home() {
    const router = useRouter();

    return (
        <div className="flex h-screen items-center justify-center bg-gradient-to-b from-indigo-900 via-purple-900 to-pink-900 text-white flex-col relative overflow-hidden">
            {/* Animated background stars */}
            <div className="absolute inset-0 overflow-hidden">
                {Array.from({ length: 50 }).map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-white rounded-full opacity-70"
                        initial={{
                            x: Math.random() * window.innerWidth,
                            y: Math.random() * window.innerHeight,
                        }}
                        animate={{
                            y: window.innerHeight + 10,
                        }}
                        transition={{
                            duration: Math.random() * 10 + 10,
                            repeat: Infinity,
                            ease: "linear",
                        }}
                    />
                ))}
            </div>

            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center z-10"
            >
                <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                >
                    <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                        💻 Dev Survival
                    </h1>
                    <p className="text-xl mb-8 opacity-80">
                        Zbieraj umiejętności, unikaj pułapek!
                    </p>
                </motion.div>

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => router.push('/game')}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-full text-xl font-bold shadow-lg hover:shadow-xl transition-all"
                >
                    🚀 Start Game
                </motion.button>

                <div className="mt-8 text-sm opacity-60">
                    <p>Sterowanie: A/D lub strzałki ←/→</p>
                </div>
            </motion.div>
        </div>
    );
}