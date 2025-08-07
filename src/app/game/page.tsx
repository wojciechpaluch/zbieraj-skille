"use client"
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const skills = [
    { name: "React", color: "from-blue-400 to-blue-600", emoji: "⚛️", quote: "Hooks are magic!" },
    { name: "Next.js", color: "from-gray-700 to-black", emoji: "▲", quote: "SSR for the win!" },
    { name: "JavaScript", color: "from-yellow-400 to-yellow-600", emoji: "🟨", quote: "== vs === 🤔" },
    { name: "TypeScript", color: "from-blue-500 to-blue-700", emoji: "🔷", quote: "Types save lives!" },
    { name: "CSS", color: "from-pink-400 to-pink-600", emoji: "🎨", quote: "Center a div!" },
    { name: "Node.js", color: "from-green-400 to-green-600", emoji: "🟢", quote: "JavaScript everywhere!" },
    { name: "Git", color: "from-orange-400 to-orange-600", emoji: "📝", quote: "git commit -m 'fix'" },
    { name: "Coffee", color: "from-amber-600 to-amber-800", emoji: "☕", quote: "Fuel of devs!" },
    { name: "Stack", color: "from-orange-500 to-red-500", emoji: "📚", quote: "Copy paste magic!" },
];

const traps = [
    { name: "Bug", color: "from-red-500 to-red-700", emoji: "🐛", quote: "It works on my machine!" },
    { name: "Legacy", color: "from-gray-500 to-gray-700", emoji: "💀", quote: "Don't touch this code!" },
    { name: "Meeting", color: "from-purple-500 to-purple-700", emoji: "📅", quote: "This could be an email..." },
    { name: "IE11", color: "from-blue-300 to-blue-500", emoji: "🔧", quote: "Why does it still exist?" },
    { name: "Merge Conflict", color: "from-red-400 to-red-600", emoji: "🔀", quote: "HEAD vs main battle!" },
    { name: "404", color: "from-gray-600 to-gray-800", emoji: "❌", quote: "Page not found!" },
    { name: "Deadline", color: "from-red-600 to-red-800", emoji: "⏰", quote: "Yesterday was too late!" },
];

const getRandomItem = () => {
    const isSkill = Math.random() > 0.4; // Slightly more skills for relaxed gameplay
    const pool = isSkill ? skills : traps;
    const item = pool[Math.floor(Math.random() * pool.length)];
    return {
        id: Date.now() + Math.random(),
        name: item.name,
        emoji: item.emoji,
        color: item.color,
        quote: item.quote,
        isSkill,
        x: Math.floor(Math.random() * 75) + 10, // More centered spawning
        y: -15,
        rotation: Math.floor(Math.random() * 20) - 10, // Less rotation for readability
        rotationSpeed: (Math.random() - 0.5) * 2, // Slower rotation
    };
};

const Particle = ({ x, y, color, onComplete }) => (
    <motion.div
        className={`absolute w-3 h-3 rounded-full bg-gradient-to-r ${color}`}
        initial={{ x, y, opacity: 1, scale: 1 }}
        animate={{
            x: x + (Math.random() - 0.5) * 80,
            y: y - Math.random() * 40 - 15,
            opacity: 0,
            scale: 0,
        }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        onAnimationComplete={onComplete}
    />
);

const FloatingMessage = ({ message, x, y, isPositive }) => (
    <motion.div
        className={`absolute pointer-events-none text-lg font-bold z-20 ${
            isPositive ? 'text-green-300' : 'text-red-300'
        }`}
        initial={{ x, y, opacity: 1, scale: 0.8 }}
        animate={{
            y: y - 50,
            opacity: 0,
            scale: 1.2,
        }}
        transition={{ duration: 2, ease: "easeOut" }}
        style={{ transform: "translateX(-50%)" }}
    >
        {message}
    </motion.div>
);

export default function RelaxedDevGame() {
    const [playerX, setPlayerX] = useState(50);
    const [items, setItems] = useState([]);
    const [particles, setParticles] = useState([]);
    const [floatingMessages, setFloatingMessages] = useState([]);
    const [score, setScore] = useState(0);
    const [lives, setLives] = useState(5); // More lives for relaxed gameplay
    const [gameOver, setGameOver] = useState(false);
    const [highScore, setHighScore] = useState(0);
    const [combo, setCombo] = useState(0);
    const [showCombo, setShowCombo] = useState(false);
    const [gameStarted, setGameStarted] = useState(true);
    const [difficulty, setDifficulty] = useState(0.5); // Start easier
    const gameRef = useRef(null);
    const keysRef = useRef({ left: false, right: false });

    // Keyboard controls
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") {
                keysRef.current.left = true;
            }
            if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") {
                keysRef.current.right = true;
            }
            if (e.key === " " && gameOver) {
                resetGame();
            }
        };

        const handleKeyUp = (e) => {
            if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") {
                keysRef.current.left = false;
            }
            if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") {
                keysRef.current.right = false;
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("keyup", handleKeyUp);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("keyup", handleKeyUp);
        };
    }, [gameStarted]);

    // Smooth player movement (slower for relaxed gameplay)
    useEffect(() => {
        const movePlayer = () => {
            if (keysRef.current.left && playerX > 8) {
                setPlayerX(prev => Math.max(8, prev - 1.5));
            }
            if (keysRef.current.right && playerX < 82) {
                setPlayerX(prev => Math.min(82, prev + 1.5));
            }
        };

        const interval = setInterval(movePlayer, 16);
        return () => clearInterval(interval);
    }, [playerX]);

    // Touch controls
    useEffect(() => {
        let startX = 0;
        const handleTouchStart = (e) => {
            startX = e.touches[0].clientX;
        };
        const handleTouchMove = (e) => {
            e.preventDefault();
            const currentX = e.touches[0].clientX;
            const deltaX = (currentX - startX) / window.innerWidth * 100;
            setPlayerX(prev => Math.max(8, Math.min(82, prev + deltaX * 0.3)));
            startX = currentX;
        };

        const node = gameRef.current;
        if (node) {
            node.addEventListener("touchstart", handleTouchStart, { passive: false });
            node.addEventListener("touchmove", handleTouchMove, { passive: false });
            return () => {
                node.removeEventListener("touchstart", handleTouchStart);
                node.removeEventListener("touchmove", handleTouchMove);
            };
        }
    }, [playerX]);

    // Game logic (slower and more relaxed)
    useEffect(() => {
        if (!gameStarted || gameOver) return;

        // Very gradual difficulty increase
        const difficultyTimer = setInterval(() => {
            setDifficulty(prev => Math.min(prev + 0.05, 2));
        }, 15000);

        // Slower spawn rate for relaxed gameplay
        const spawnRate = Math.max(1200 - (difficulty * 300), 600);
        const spawn = setInterval(() => {
            setItems(prev => [...prev, getRandomItem()]);
        }, spawnRate);

        // Slower falling speed
        const move = setInterval(() => {
            setItems(prev => {
                return prev
                    .map(item => ({
                        ...item,
                        y: item.y + (2 + difficulty * 1.5),
                        rotation: item.rotation + item.rotationSpeed * 0.5
                    }))
                    .filter(item => item.y < 110);
            });
        }, 60); // Slower update rate

        return () => {
            clearInterval(spawn);
            clearInterval(move);
            clearInterval(difficultyTimer);
        };
    }, [gameStarted, gameOver, difficulty]);

    // Collision detection (more forgiving hitbox)
    useEffect(() => {
        items.forEach(item => {
            if (item.y >= 75 && item.y <= 100 && Math.abs(item.x - playerX) < 12) {
                const itemElement = document.getElementById(`item-${item.id}`);
                const rect = itemElement?.getBoundingClientRect();

                if (item.isSkill) {
                    const points = 1 + Math.floor(combo / 3);
                    setScore(s => s + points);
                    setCombo(c => c + 1);
                    setShowCombo(true);
                    setTimeout(() => setShowCombo(false), 1500);

                    // Add floating message
                    if (rect) {
                        const newMessage = {
                            id: Date.now(),
                            message: `+${points} ${item.quote}`,
                            x: rect.left + rect.width / 2,
                            y: rect.top,
                            isPositive: true
                        };
                        setFloatingMessages(prev => [...prev, newMessage]);
                        setTimeout(() => {
                            setFloatingMessages(prev => prev.filter(m => m.id !== newMessage.id));
                        }, 2000);
                    }

                    // Create success particles
                    if (rect) {
                        const newParticles = Array.from({ length: 6 }, (_, i) => ({
                            id: Date.now() + i,
                            x: rect.left + rect.width / 2,
                            y: rect.top + rect.height / 2,
                            color: item.color,
                        }));
                        setParticles(prev => [...prev, ...newParticles]);
                    }
                } else {
                    setLives(l => l - 1);
                    setCombo(0);

                    // Add floating message
                    if (rect) {
                        const newMessage = {
                            id: Date.now(),
                            message: item.quote,
                            x: rect.left + rect.width / 2,
                            y: rect.top,
                            isPositive: false
                        };
                        setFloatingMessages(prev => [...prev, newMessage]);
                        setTimeout(() => {
                            setFloatingMessages(prev => prev.filter(m => m.id !== newMessage.id));
                        }, 2000);
                    }

                    // Create damage particles
                    if (rect) {
                        const newParticles = Array.from({ length: 4 }, (_, i) => ({
                            id: Date.now() + i,
                            x: rect.left + rect.width / 2,
                            y: rect.top + rect.height / 2,
                            color: "from-red-500 to-red-700",
                        }));
                        setParticles(prev => [...prev, ...newParticles]);
                    }
                }

                setItems(prev => prev.filter(i => i.id !== item.id));
            }
        });
    }, [items, playerX, combo]);

    // Game over check
    useEffect(() => {
        if (lives <= 0) {
            setGameOver(true);
            if (score > highScore) {
                setHighScore(score);
            }
        }
    }, [lives, score, highScore]);

    const resetGame = () => {
        setPlayerX(50);
        setItems([]);
        setParticles([]);
        setFloatingMessages([]);
        setScore(0);
        setLives(5);
        setCombo(0);
        setDifficulty(0.5);
        setGameOver(false);
        setGameStarted(true);
    };

    const removeParticle = (id) => {
        setParticles(prev => prev.filter(p => p.id !== id));
    };

    return (
        <div
            ref={gameRef}
            className="relative w-full h-screen bg-gradient-to-b from-blue-900 via-indigo-800 to-purple-800 overflow-hidden cursor-none"
            style={{
                backgroundImage: `
          radial-gradient(circle at 30% 70%, rgba(59, 130, 246, 0.2) 0%, transparent 50%),
          radial-gradient(circle at 70% 30%, rgba(168, 85, 247, 0.2) 0%, transparent 50%),
          radial-gradient(circle at 50% 50%, rgba(34, 197, 94, 0.1) 0%, transparent 50%)
        `,
            }}
        >
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden opacity-30">
                {Array.from({ length: 30 }).map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-white rounded-full"
                        initial={{
                            x: Math.random() * window.innerWidth,
                            y: Math.random() * window.innerHeight,
                        }}
                        animate={{
                            y: window.innerHeight + 10,
                        }}
                        transition={{
                            duration: Math.random() * 15 + 15,
                            repeat: Infinity,
                            ease: "linear",
                        }}
                    />
                ))}
            </div>

            {/* UI Elements */}
            <div className="absolute top-4 left-4 text-white">
                <div className="flex items-center space-x-4 bg-black bg-opacity-40 px-6 py-3 rounded-xl backdrop-blur-sm">
                    <div className="text-xl font-bold">💻 {score}</div>
                    <div className="text-lg opacity-90">💖 {lives}</div>
                    <div className="text-lg opacity-90">🏆 {highScore}</div>
                </div>
                {combo > 1 && (
                    <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: showCombo ? 1.3 : 1, opacity: showCombo ? 1 : 0.8 }}
                        className="mt-3 text-yellow-300 font-bold text-xl bg-yellow-900 bg-opacity-60 px-4 py-2 rounded-full"
                    >
                        🔥 Combo x{combo}
                    </motion.div>
                )}
            </div>

            <div className="absolute top-4 right-4 text-white text-sm bg-black bg-opacity-40 px-6 py-3 rounded-xl backdrop-blur-sm">
                <div className="text-lg">⚡ Level: {Math.floor(difficulty * 2) + 1}</div>
                <div className="text-xs opacity-80 mt-1">
                    A/D or ←/→ to move | Relax & code! 😊
                </div>
            </div>

            {/* Player */}
            <motion.div
                className="absolute bottom-12 w-20 h-20 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-2xl shadow-2xl flex items-center justify-center text-3xl"
                animate={{
                    left: `${playerX}%`,
                    boxShadow: [
                        "0 0 30px rgba(59, 130, 246, 0.6)",
                        "0 0 40px rgba(59, 130, 246, 0.9)",
                        "0 0 30px rgba(59, 130, 246, 0.6)"
                    ]
                }}
                transition={{
                    left: { duration: 0.2 },
                    boxShadow: { duration: 3, repeat: Infinity }
                }}
                style={{ transform: "translateX(-50%)" }}
            >
                👨‍💻
            </motion.div>

            {/* Falling items (larger) */}
            <AnimatePresence>
                {items.map(item => (
                    <motion.div
                        key={item.id}
                        id={`item-${item.id}`}
                        initial={{
                            scale: 0,
                            rotate: item.rotation,
                            opacity: 0
                        }}
                        animate={{
                            scale: 1,
                            rotate: item.rotation,
                            opacity: 1
                        }}
                        exit={{
                            scale: 0,
                            opacity: 0
                        }}
                        className={`absolute w-20 h-20 rounded-2xl shadow-2xl flex flex-col items-center justify-center text-white font-bold text-xs bg-gradient-to-br ${item.color} border-3 ${item.isSkill ? 'border-green-300' : 'border-red-300'}`}
                        style={{
                            top: `${item.y}%`,
                            left: `${item.x}%`,
                            transform: "translateX(-50%)",
                            filter: `drop-shadow(0 0 ${item.isSkill ? '15px rgba(34, 197, 94, 0.6)' : '15px rgba(239, 68, 68, 0.6)'})`,
                        }}
                    >
                        <div className="text-center">
                            <div className="text-2xl mb-1">{item.emoji}</div>
                            <div className="text-xs leading-tight">{item.name}</div>
                        </div>
                    </motion.div>
                ))}
            </AnimatePresence>

            {/* Floating messages */}
            <AnimatePresence>
                {floatingMessages.map(message => (
                    <FloatingMessage
                        key={message.id}
                        message={message.message}
                        x={message.x}
                        y={message.y}
                        isPositive={message.isPositive}
                    />
                ))}
            </AnimatePresence>

            {/* Particles */}
            <AnimatePresence>
                {particles.map(particle => (
                    <Particle
                        key={particle.id}
                        x={particle.x}
                        y={particle.y}
                        color={particle.color}
                        onComplete={() => removeParticle(particle.id)}
                    />
                ))}
            </AnimatePresence>

            {/* Game Over Screen */}
            <AnimatePresence>
                {gameOver && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm"
                    >
                        <div className="text-center bg-gradient-to-br from-gray-800 to-gray-900 p-10 rounded-3xl shadow-2xl max-w-lg mx-4">
                            <motion.div
                                animate={{ rotate: [0, 5, -5, 0] }}
                                transition={{ duration: 0.8, repeat: 3 }}
                                className="text-8xl mb-6"
                            >
                                😵‍💫
                            </motion.div>
                            <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-red-400 to-purple-400 bg-clip-text text-transparent">
                                Debug Session Over!
                            </h1>
                            <div className="text-white space-y-3 mb-8">
                                <p className="text-3xl">Lines of Code: <span className="font-bold text-green-400">{score}</span></p>
                                <p className="text-xl opacity-80">Personal Best: {highScore}</p>
                                <p className="text-xl opacity-80">Max Streak: {combo}</p>
                                <p className="text-lg opacity-60 italic">"Time for coffee break! ☕"</p>
                            </div>
                            <div className="space-y-4">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={resetGame}
                                    className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white px-8 py-4 rounded-xl text-xl font-bold shadow-lg"
                                >
                                    🔄 Start New Session
                                </motion.button>
                                <motion.a
                                    whileHover={{ scale: 1.05 }}
                                    href="#"
                                    className="block w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-xl text-xl font-bold text-center shadow-lg"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    💼 Check My Work
                                </motion.a>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}