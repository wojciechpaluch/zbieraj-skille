"use client"
import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Zasoby potrzebne do projektu
const projectResources = [
    { name: "Pomysł", emoji: "🧠", color: "from-purple-400 to-purple-600", quote: "Eureka! Mam to!", value: 10 },
    { name: "Kod", emoji: "👨‍💻", color: "from-blue-400 to-blue-600", quote: "10x developer mode!", value: 15 },
    { name: "Testy", emoji: "🧪", color: "from-green-400 to-green-600", quote: "Wszystko działa!", value: 20 },
    { name: "Fixy", emoji: "🔧", color: "from-orange-400 to-orange-600", quote: "To już ostatni bug!", value: 12 },
    { name: "Build", emoji: "📦", color: "from-cyan-400 to-cyan-600", quote: "Kompilacja 100%!", value: 18 },
    { name: "Deploy", emoji: "☁️", color: "from-indigo-400 to-indigo-600", quote: "Do produkcji!", value: 25 },
];

// Bugi i problemy
const bugs = [
    { name: "Bug", emoji: "🐛", color: "from-red-500 to-red-700", quote: "Działa tylko u mnie!", damage: -15 },
    { name: "Merge Conflict", emoji: "🔀", color: "from-red-400 to-red-600", quote: "Git ma konflikt w duszy!", damage: -20 },
    { name: "Meeting", emoji: "📅", color: "from-purple-500 to-purple-700", quote: "To mogło być mailem...", damage: -10 },
    { name: "Deadline", emoji: "⏰", color: "from-red-600 to-red-800", quote: "Deploy w piątek?! Szalejesz?!", damage: -25 },
    { name: "Code Review", emoji: "👀", color: "from-yellow-500 to-yellow-700", quote: "Czekam na review... od AI", damage: -12 },
];

// Power-upy
const powerUps = [
    { name: "Kawa", emoji: "☕", color: "from-yellow-600 to-amber-600", quote: "Fuel dla developera!", effect: "speed" },
    { name: "Stack Overflow", emoji: "📚", color: "from-green-600 to-emerald-600", quote: "Copy-paste master!", effect: "shield" },
    { name: "AI Assistant", emoji: "🤖", color: "from-blue-600 to-cyan-600", quote: "ChatGPT to the rescue!", effect: "auto_collect" },
    { name: "Red Bull", emoji: "🔋", color: "from-red-600 to-pink-600", quote: "Gives you wings!", effect: "double_score" },
];

// Boss encounters
const bosses = [
    {
        name: "Legacy Code",
        emoji: "👹",
        color: "from-gray-800 to-gray-900",
        quote: "Kto to pisał?! Ach... ja...",
        hp: 100,
        reward: 100,
        spawnsAt: 90
    },
    {
        name: "Production Bug",
        emoji: "🚨",
        color: "from-red-800 to-red-900",
        quote: "ALERT! System down!",
        hp: 150,
        reward: 150,
        spawnsAt: 45
    },
];

type ItemType = {
    id: number;
    name: string;
    emoji: string;
    color: string;
    quote: string;
    isBug: boolean;
    isPowerUp: boolean;
    isBoss: boolean;
    x: number;
    y: number;
    rotation: number;
    rotationSpeed: number;
    scale: number;
    value?: number;
    damage?: number;
    effect?: string;
    hp?: number;
    maxHp?: number;
    reward?: number;
    lifetime?: number;
    createdAt?: number;
};

type PowerUpEffect = {
    type: string;
    duration: number;
    startTime: number;
};

type BackgroundDot = {
    x: number;
    duration: number;
};

export default function EnhancedDevLifecycleGame() {
    const [items, setItems] = useState<ItemType[]>([]);
    const [particles, setParticles] = useState<any[]>([]);
    const [floatingMessages, setFloatingMessages] = useState<any[]>([]);
    const [collectedResources, setCollectedResources] = useState<string[]>([]);
    const [gameStatus, setGameStatus] = useState<string>("Rozpocznij projekt!");
    const [gameTime, setGameTime] = useState<number>(120);
    const [gameStarted, setGameStarted] = useState<boolean>(false);
    const [gameEnded, setGameEnded] = useState<boolean>(false);
    const [crunchMode, setCrunchMode] = useState<boolean>(false);
    const [score, setScore] = useState<number>(0);
    const [projects, setProjects] = useState<number>(0);
    const [combo, setCombo] = useState<number>(0);
    const [maxCombo, setMaxCombo] = useState<number>(0);
    const [health, setHealth] = useState<number>(100);
    const [maxHealth] = useState<number>(100);
    const [powerUpEffects, setPowerUpEffects] = useState<PowerUpEffect[]>([]);
    const [currentBoss, setCurrentBoss] = useState<ItemType | null>(null);
    const [caffeineMeter, setCaffeineMeter] = useState<number>(50);
    const [streak, setStreak] = useState<number>(0);
    const [level, setLevel] = useState<number>(1);
    const [xp, setXp] = useState<number>(0);
    const [xpToNext, setXpToNext] = useState<number>(100);
    const [achievements, setAchievements] = useState<string[]>([]);
    const [windowSize, setWindowSize] = useState({ width: 1000, height: 800 });
    const [backgroundDots, setBackgroundDots] = useState<BackgroundDot[]>([]);
    const gameRef = useRef<HTMLDivElement>(null);

    // Initialize background dots
    useEffect(() => {
        if (typeof window !== 'undefined') {
            setBackgroundDots(Array.from({ length: 20 }).map(() => ({
                x: Math.random() * windowSize.width,
                duration: Math.random() * 10 + 10
            })));
        }
    }, [windowSize.width]);

    // Handle window resize
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const handleResize = () => {
                setWindowSize({
                    width: window.innerWidth,
                    height: window.innerHeight
                });
            };

            handleResize();
            window.addEventListener('resize', handleResize);
            return () => window.removeEventListener('resize', handleResize);
        }
    }, []);

    // Sprawdź osiągnięcia
    const checkAchievements = useCallback(() => {
        const newAchievements: string[] = [];

        if (combo >= 10 && !achievements.includes("combo_master")) {
            newAchievements.push("combo_master");
        }
        if (projects >= 5 && !achievements.includes("project_machine")) {
            newAchievements.push("project_machine");
        }
        if (score >= 1000 && !achievements.includes("code_warrior")) {
            newAchievements.push("code_warrior");
        }
        if (currentBoss && !achievements.includes("boss_slayer")) {
            newAchievements.push("boss_slayer");
        }

        if (newAchievements.length > 0) {
            setAchievements(prev => [...prev, ...newAchievements]);
            newAchievements.forEach(achievement => {
                const achievementNames = {
                    combo_master: "🔥 Combo Master!",
                    project_machine: "🚀 Project Machine!",
                    code_warrior: "⚔️ Code Warrior!",
                    boss_slayer: "👑 Boss Slayer!"
                };
                showFloatingMessage(achievementNames[achievement as keyof typeof achievementNames], 50, 50, true);
            });
        }
    }, [combo, projects, score, currentBoss, achievements]);

    // System poziomów
    useEffect(() => {
        if (xp >= xpToNext) {
            setLevel(prev => prev + 1);
            setXp(0);
            setXpToNext(prev => prev + 50);
            showFloatingMessage(`🆙 Level ${level + 1}!`, 50, 30, true);
        }
    }, [xp, xpToNext, level]);

    // Zarządzanie kofeiną
    useEffect(() => {
        if (!gameStarted || gameEnded) return;

        const caffeineTimer = setInterval(() => {
            setCaffeineMeter(prev => Math.max(0, prev - 1));
        }, 2000);

        return () => clearInterval(caffeineTimer);
    }, [gameStarted, gameEnded]);

    // Power-up effects management
    useEffect(() => {
        if (!gameStarted) return;

        const effectTimer = setInterval(() => {
            const now = Date.now();
            setPowerUpEffects(prev => prev.filter(effect => now - effect.startTime < effect.duration));
        }, 100);

        return () => clearInterval(effectTimer);
    }, [gameStarted]);

    // Logika spawnu itemów
    const createRandomItem = useCallback(() => {
        // Boss spawn logic
        if ((gameTime === 90 || gameTime === 45) && !currentBoss) {
            const boss = bosses.find(b => b.spawnsAt === gameTime);
            if (boss) {
                const newBoss: ItemType = {
                    id: Date.now() + Math.random(),
                    name: boss.name,
                    emoji: boss.emoji,
                    color: boss.color,
                    quote: boss.quote,
                    isBug: false,
                    isPowerUp: false,
                    isBoss: true,
                    x: 50,
                    y: 30,
                    rotation: 0,
                    rotationSpeed: 0,
                    scale: 1.5,
                    hp: boss.hp,
                    maxHp: boss.hp,
                    reward: boss.reward,
                    lifetime: 30000, // Boss pozostaje przez 30 sekund
                    createdAt: Date.now()
                };
                setItems(prev => [...prev, newBoss]);
                setCurrentBoss(newBoss);
                return;
            }
        }

        // Nie spawnuj jeśli jest boss
        if (currentBoss) return;

        // Losowy czas życia od 2 do 5 sekund
        const lifetime = Math.floor(Math.random() * 3000) + 2000;

        let newItem: ItemType;

        // 15% szansy na power-up
        if (Math.random() < 0.15) {
            const powerUp = powerUps[Math.floor(Math.random() * powerUps.length)];
            newItem = {
                id: Date.now() + Math.random(),
                name: powerUp.name,
                emoji: powerUp.emoji,
                color: powerUp.color,
                quote: powerUp.quote,
                isBug: false,
                isPowerUp: true,
                isBoss: false,
                x: Math.floor(Math.random() * 80) + 10,
                y: Math.floor(Math.random() * 60) + 20,
                rotation: Math.floor(Math.random() * 360),
                rotationSpeed: (Math.random() - 0.5) * 2,
                scale: 1,
                effect: powerUp.effect,
                lifetime: lifetime,
                createdAt: Date.now()
            };
        } else {
            // 30% szansy na bug, 70% na zasób
            const isBug = Math.random() < 0.3;
            const pool = isBug ? bugs : projectResources;
            const item = pool[Math.floor(Math.random() * pool.length)];

            newItem = {
                id: Date.now() + Math.random(),
                name: item.name,
                emoji: item.emoji,
                color: item.color,
                quote: item.quote,
                isBug,
                isPowerUp: false,
                isBoss: false,
                x: Math.floor(Math.random() * 80) + 10,
                y: Math.floor(Math.random() * 60) + 20,
                rotation: Math.floor(Math.random() * 360),
                rotationSpeed: (Math.random() - 0.5) * 2,
                scale: 1,
                value: isBug ? undefined : (item as any).value,
                damage: isBug ? (item as any).damage : undefined,
                lifetime: lifetime,
                createdAt: Date.now()
            };
        }

        setItems(prev => [...prev, newItem]);
    }, [gameTime, currentBoss]);

    // Spawn itemów
    useEffect(() => {
        if (!gameStarted || gameEnded) return;

        // Natychmiastowy spawn pierwszych 5 itemów po starcie
        if (items.length === 0) {
            for (let i = 0; i < 5; i++) {
                createRandomItem();
            }
        }

        // Sprawdzaj co sekundę czy trzeba dodać nowe itemy
        const spawnCheckInterval = setInterval(() => {
            setItems(prev => {
                // Filtruj tylko zwykłe itemy (nie bossy)
                const regularItems = prev.filter(item => !item.isBoss);

                // Liczba brakujących itemów do 5
                const missingItems = 5 - regularItems.length;

                // Jeśli brakuje itemów, dodaj nowe
                if (missingItems > 0) {
                    const newItems = [];
                    for (let i = 0; i < missingItems; i++) {
                        // Tymczasowe wywołanie createRandomItem
                        const lifetime = Math.floor(Math.random() * 3000) + 2000;
                        const isBug = Math.random() < 0.3;
                        const pool = isBug ? bugs : projectResources;
                        const item = pool[Math.floor(Math.random() * pool.length)];

                        const newItem: ItemType = {
                            id: Date.now() + Math.random(),
                            name: item.name,
                            emoji: item.emoji,
                            color: item.color,
                            quote: item.quote,
                            isBug,
                            isPowerUp: false,
                            isBoss: false,
                            x: Math.floor(Math.random() * 80) + 10,
                            y: Math.floor(Math.random() * 60) + 20,
                            rotation: Math.floor(Math.random() * 360),
                            rotationSpeed: (Math.random() - 0.5) * 2,
                            scale: 1,
                            value: isBug ? undefined : (item as any).value,
                            damage: isBug ? (item as any).damage : undefined,
                            lifetime: lifetime,
                            createdAt: Date.now()
                        };
                        newItems.push(newItem);
                    }
                    return [...prev, ...newItems];
                }
                return prev;
            });
        }, 1000);

        return () => clearInterval(spawnCheckInterval);
    }, [gameStarted, gameEnded, items.length, createRandomItem]);

    // Automatyczne usuwanie itemów po czasie
    useEffect(() => {
        if (!gameStarted || gameEnded) return;

        const cleanupTimer = setInterval(() => {
            const now = Date.now();
            setItems(prev => {
                const itemsToRemove = prev.filter(item =>
                    item.createdAt && item.lifetime && (now - item.createdAt > item.lifetime)
                );

                if (itemsToRemove.length > 0) {
                    return prev.filter(item =>
                        !item.createdAt || !item.lifetime || (now - item.createdAt <= item.lifetime)
                    );
                }
                return prev;
            });
        }, 100);

        return () => clearInterval(cleanupTimer);
    }, [gameStarted, gameEnded]);

    const hasEffect = (effectType: string) => {
        const now = Date.now();
        return powerUpEffects.some(effect =>
            effect.type === effectType && now - effect.startTime < effect.duration
        );
    };

    const addPowerUpEffect = (type: string, duration: number) => {
        setPowerUpEffects(prev => [...prev, { type, duration, startTime: Date.now() }]);
    };

    const showFloatingMessage = (message: string, x: number, y: number, isPositive: boolean) => {
        const newMessage = {
            id: Date.now() + Math.random(),
            message,
            x,
            y,
            isPositive
        };
        setFloatingMessages(prev => [...prev, newMessage]);
        setTimeout(() => {
            setFloatingMessages(prev => prev.filter(m => m.id !== newMessage.id));
        }, 2500);
    };

    const createParticles = (x: number, y: number, color: string, count: number = 6) => {
        const rect = gameRef.current?.getBoundingClientRect();
        if (!rect) return;

        const newParticles = Array.from({ length: count }, (_, i) => ({
            id: Date.now() + i + Math.random(),
            x: (x / 100) * rect.width,
            y: (y / 100) * rect.height,
            color,
        }));
        setParticles(prev => [...prev, ...newParticles]);
    };

    // Timer gry
    useEffect(() => {
        if (!gameStarted || gameEnded) return;

        const timer = setInterval(() => {
            setGameTime(prev => {
                if (prev <= 1) {
                    setGameEnded(true);
                    return 0;
                }
                if (prev <= 30) {
                    setCrunchMode(true);
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [gameStarted, gameEnded]);

    // Auto-collect z AI Assistant
    useEffect(() => {
        if (!hasEffect("auto_collect") || !gameStarted) return;

        const autoCollect = setInterval(() => {
            setItems(prev => {
                const resourceItem = prev.find(item => !item.isBug && !item.isPowerUp && !item.isBoss);
                if (resourceItem) {
                    const baseScore = resourceItem.value || 10;
                    const comboMultiplier = Math.floor(combo / 5) + 1;
                    const scoreMultiplier = hasEffect("double_score") ? 2 : 1;
                    const totalScore = baseScore * comboMultiplier * scoreMultiplier;

                    if (!collectedResources.includes(resourceItem.name)) {
                        setCollectedResources(prevRes => [...prevRes, resourceItem.name]);
                        setScore(prevScore => prevScore + totalScore);
                        setXp(prevXp => prevXp + Math.floor(totalScore / 2));
                        setCombo(prevCombo => prevCombo + 1);
                        setStreak(prevStreak => prevStreak + 1);

                        showFloatingMessage(
                            `🤖 Auto: ${resourceItem.emoji} +${totalScore}`,
                            resourceItem.x,
                            resourceItem.y,
                            true
                        );
                        createParticles(resourceItem.x, resourceItem.y, resourceItem.color, 6);
                    }
                    return prev.filter(i => i.id !== resourceItem.id);
                }
                return prev;
            });
        }, 2000);

        return () => clearInterval(autoCollect);
    }, [powerUpEffects, gameStarted, combo, collectedResources, hasEffect]);

    // Combo reset timer
    useEffect(() => {
        if (combo === 0) return;

        const comboTimer = setTimeout(() => {
            if (combo > maxCombo) {
                setMaxCombo(combo);
            }
            setCombo(0);
            setStreak(0);
        }, 4000);

        return () => clearTimeout(comboTimer);
    }, [combo, maxCombo]);

    const handleItemClick = (item: ItemType) => {
        if (item.isBoss && item.hp) {
            // Boss fight
            const damage = 25 + (combo * 2);
            const newHp = item.hp - damage;

            if (newHp <= 0) {
                // Boss defeated
                setScore(prev => prev + (item.reward || 100));
                setXp(prev => prev + 50);
                showFloatingMessage(`💀 ${item.name} defeated! +${item.reward}`, item.x, item.y, true);
                createParticles(item.x, item.y, "from-yellow-500 to-yellow-700", 15);
                setCurrentBoss(null);
                setItems(prev => prev.filter(i => i.id !== item.id));
            } else {
                // Update boss HP
                setItems(prev => prev.map(i => i.id === item.id ? { ...i, hp: newHp } : i));
                showFloatingMessage(`-${damage} HP`, item.x, item.y - 10, false);
            }
            return;
        }

        if (item.isPowerUp && item.effect) {
            // Power-up
            switch (item.effect) {
                case "speed":
                    addPowerUpEffect("speed", 15000);
                    setCaffeineMeter(100);
                    break;
                case "shield":
                    addPowerUpEffect("shield", 20000);
                    break;
                case "auto_collect":
                    addPowerUpEffect("auto_collect", 12000);
                    break;
                case "double_score":
                    addPowerUpEffect("double_score", 15000);
                    break;
            }
            showFloatingMessage(`⚡ ${item.quote}`, item.x, item.y, true);
            createParticles(item.x, item.y, item.color, 8);
            setItems(prev => prev.filter(i => i.id !== item.id));
            return;
        }

        if (item.isBug) {
            // Bug clicked
            if (hasEffect("shield")) {
                showFloatingMessage("🛡️ Shield absorbed!", item.x, item.y, true);
            } else {
                const damage = Math.abs(item.damage || 15);
                setHealth(prev => Math.max(0, prev - damage));
                setCombo(0);
                setStreak(0);
                showFloatingMessage(item.quote, item.x, item.y, false);
                createParticles(item.x, item.y, "from-red-500 to-red-700", 8);

                if (health - damage <= 0) {
                    setGameEnded(true);
                }
            }
        } else {
            // Resource collected
            if (!collectedResources.includes(item.name)) {
                setCollectedResources(prev => [...prev, item.name]);
                const baseScore = item.value || 10;
                const comboMultiplier = Math.floor(combo / 5) + 1;
                const scoreMultiplier = hasEffect("double_score") ? 2 : 1;
                const totalScore = baseScore * comboMultiplier * scoreMultiplier;

                setScore(prev => prev + totalScore);
                setXp(prev => prev + Math.floor(totalScore / 2));
                setCombo(prev => prev + 1);
                setStreak(prev => prev + 1);

                showFloatingMessage(
                    combo > 0 ? `${item.emoji} ${totalScore} (x${comboMultiplier})` : `${item.emoji} +${totalScore}`,
                    item.x,
                    item.y,
                    true
                );
                createParticles(item.x, item.y, item.color, 6);
            }
        }

        setItems(prev => prev.filter(i => i.id !== item.id));
        checkAchievements();
    };

    const canDeploy = () => {
        return collectedResources.length === projectResources.length;
    };

    const handleDeploy = () => {
        if (!canDeploy()) return;

        const success = Math.random() > (0.15 + (level * 0.01));

        if (success) {
            setProjects(prev => prev + 1);
            const deployScore = 100 + (level * 20) + (streak * 10);
            setScore(prev => prev + deployScore);
            setXp(prev => prev + 50);
            setHealth(prev => Math.min(maxHealth, prev + 30));
            setGameStatus(`🎉 Deploy sukces! +${deployScore} points!`);
            showFloatingMessage(`🚀 Project deployed! +${deployScore}`, 50, 60, true);
        } else {
            setGameStatus("❌ Error 500! Rollback!");
            setHealth(prev => Math.max(0, prev - 20));
        }

        setCollectedResources([]);

        if (gameTime > 0) {
            setTimeout(() => {
                setGameStatus("Kolejny projekt czeka!");
            }, 3000);
        }
    };

    const startGame = () => {
        setGameStarted(true);
        setGameEnded(false);
        setGameTime(120);
        setCollectedResources([]);
        setScore(0);
        setProjects(0);
        setCombo(0);
        setMaxCombo(0);
        setHealth(100);
        setCrunchMode(false);
        setPowerUpEffects([]);
        setCurrentBoss(null);
        setCaffeineMeter(50);
        setStreak(0);
        setLevel(1);
        setXp(0);
        setXpToNext(100);
        setAchievements([]);
        setItems([]);
        setParticles([]);
        setFloatingMessages([]);
        setGameStatus("Zbieraj zasoby do projektu!");
    };

    const resetGame = () => {
        startGame();
    };

    const formatTime = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div
            ref={gameRef}
            className={`relative w-full h-screen overflow-hidden transition-all duration-300 ${
                crunchMode
                    ? 'bg-gradient-to-b from-red-900 via-red-800 to-orange-800'
                    : currentBoss
                        ? 'bg-gradient-to-b from-gray-900 via-purple-900 to-black'
                        : 'bg-gradient-to-b from-blue-900 via-indigo-800 to-purple-800'
            }`}
        >
            {/* Game start screen */}
            {!gameStarted && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-80 backdrop-blur-sm z-50">
                    <div className="text-center bg-gradient-to-br from-gray-800 to-gray-900 p-10 rounded-3xl shadow-2xl max-w-md mx-4">
                        <div className="text-8xl mb-6">👨‍💻</div>
                        <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                            Dev Lifecycle Game
                        </h1>
                        <p className="text-white text-lg mb-8 opacity-80">
                            Zbieraj zasoby, unikaj bugów, deployuj projekty!
                        </p>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={startGame}
                            className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white px-8 py-4 rounded-xl text-xl font-bold shadow-lg"
                        >
                            🚀 Start Game
                        </motion.button>
                    </div>
                </div>
            )}

            {/* Enhanced Header */}
            {gameStarted && (
                <div className="absolute top-4 left-4 right-4 z-10">
                    <div className="bg-black bg-opacity-50 backdrop-blur-sm rounded-2xl px-6 py-4">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-4">
                                <div className="text-2xl font-bold text-white">💻 {score}</div>
                                <div className="text-lg text-green-400">🚀 {projects}</div>
                                <div className={`text-lg font-mono ${crunchMode ? 'text-red-400 animate-pulse' : 'text-blue-400'}`}>
                                    ⏰ {formatTime(gameTime)}
                                </div>
                                <div className="text-lg text-purple-400">⭐ Lvl {level}</div>
                            </div>
                            {crunchMode && (
                                <motion.div
                                    animate={{ scale: [1, 1.1, 1] }}
                                    transition={{ duration: 0.5, repeat: Infinity }}
                                    className="text-red-400 font-bold text-lg"
                                >
                                    🔥 CRUNCH MODE!
                                </motion.div>
                            )}
                        </div>

                        {/* Stats row */}
                        <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center space-x-4">
                                {combo > 0 && (
                                    <motion.div
                                        animate={{ scale: [1, 1.1, 1] }}
                                        transition={{ duration: 0.3, repeat: Infinity }}
                                        className="text-orange-400 font-bold"
                                    >
                                        🔥 Combo: {combo}
                                    </motion.div>
                                )}
                                <div className="text-green-400">❤️ {health}/100</div>
                                <div className="text-yellow-400">☕ {caffeineMeter}%</div>
                            </div>

                            {/* XP Bar */}
                            <div className="flex items-center space-x-2">
                                <span className="text-purple-400 text-xs">XP:</span>
                                <div className="w-16 h-2 bg-gray-600 rounded-full">
                                    <div
                                        className="h-full bg-purple-400 rounded-full transition-all duration-300"
                                        style={{ width: `${(xp / xpToNext) * 100}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Boss Health Bar */}
            {gameStarted && currentBoss && (
                <motion.div
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute top-32 left-1/2 transform -translate-x-1/2 z-20"
                >
                    <div className="bg-red-900 bg-opacity-80 backdrop-blur-sm rounded-xl p-4 text-center">
                        <div className="text-white text-lg font-bold mb-2">
                            {currentBoss.emoji} {currentBoss.name}
                        </div>
                        <div className="w-64 h-4 bg-gray-700 rounded-full mb-2">
                            <div
                                className="h-full bg-red-500 rounded-full transition-all duration-300"
                                style={{ width: `${((currentBoss.hp || 0) / (currentBoss.maxHp || 1)) * 100}%` }}
                            />
                        </div>
                        <div className="text-red-300 text-sm">{currentBoss.hp}/{currentBoss.maxHp} HP</div>
                    </div>
                </motion.div>
            )}

            {/* Game Status */}
            {gameStarted && (
                <div className="absolute top-36 left-4 right-4 z-10" style={{ top: currentBoss ? '200px' : '144px' }}>
                    <motion.div
                        key={gameStatus}
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-gray-900 bg-opacity-70 backdrop-blur-sm rounded-xl px-4 py-3 text-center"
                    >
                        <div className="text-white text-lg font-medium">{gameStatus}</div>
                    </motion.div>
                </div>
            )}

            {/* Enhanced Progress Bar */}
            {gameStarted && (
                <div className="absolute bottom-4 left-4 right-4 z-10">
                    <div className="bg-gray-900 bg-opacity-70 backdrop-blur-sm rounded-xl p-4">
                        <div className="flex items-center justify-between mb-3">
                            <div className="text-white text-sm font-medium">Postęp projektu:</div>
                            <div className="text-white text-xs">
                                Streak: {streak} | Max Combo: {maxCombo}
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-4">
                            {projectResources.map((resource) => {
                                const collected = collectedResources.includes(resource.name);
                                return (
                                    <motion.div
                                        key={resource.name}
                                        initial={{ scale: 0 }}
                                        animate={{ scale: collected ? 1.1 : 0.8, opacity: collected ? 1 : 0.5 }}
                                        className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${
                                            collected ? 'bg-green-600' : 'bg-gray-600'
                                        }`}
                                    >
                                        <span className="text-lg">{resource.emoji}</span>
                                        <span className="text-sm text-white">{resource.name}</span>
                                        {collected && <span className="text-green-300">✓</span>}
                                    </motion.div>
                                );
                            })}
                        </div>

                        <motion.button
                            whileHover={{ scale: canDeploy() ? 1.05 : 1 }}
                            whileTap={{ scale: canDeploy() ? 0.95 : 1 }}
                            onClick={handleDeploy}
                            disabled={!canDeploy()}
                            className={`w-full py-3 rounded-xl font-bold text-lg transition-all ${
                                canDeploy()
                                    ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white shadow-lg hover:shadow-xl'
                                    : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                            }`}
                        >
                            {canDeploy() ? '🚀 Deploy!' : `Potrzebujesz jeszcze ${6 - collectedResources.length} zasobów`}
                        </motion.button>
                    </div>
                </div>
            )}

            {/* Falling items */}
            {gameStarted && (
                <AnimatePresence>
                    {items.map(item => (
                        <motion.div
                            key={item.id}
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{
                                scale: item.scale,
                                opacity: 1,
                                rotate: item.rotation
                            }}
                            exit={{ scale: 0, opacity: 0 }}
                            whileHover={{ scale: (item.scale || 1) * 1.1 }}
                            whileTap={{ scale: (item.scale || 1) * 0.9 }}
                            onClick={() => handleItemClick(item)}
                            className={`absolute cursor-pointer z-10 rounded-2xl shadow-2xl flex flex-col items-center justify-center text-white font-bold border-2 ${
                                item.isBoss ? 'border-red-600 w-32 h-32' :
                                    item.isPowerUp ? 'border-yellow-400 w-20 h-20' :
                                        item.isBug ? 'border-red-400 w-20 h-20' : 'border-green-400 w-20 h-20'
                            } bg-gradient-to-br ${item.color}`}
                            style={{
                                top: `${item.y}%`,
                                left: `${item.x}%`,
                                transform: "translate(-50%, -50%)",
                                filter: `drop-shadow(0 0 ${
                                    item.isBoss ? '20px rgba(255, 0, 0, 0.8)' :
                                        item.isPowerUp ? '15px rgba(255, 255, 0, 0.6)' :
                                            item.isBug ? '15px rgba(239, 68, 68, 0.6)' :
                                                '15px rgba(34, 197, 94, 0.4)'
                                })`,
                            }}
                        >
                            <div className={`${item.isBoss ? 'text-4xl' : 'text-2xl'} mb-1`}>
                                {item.emoji}
                            </div>
                            <div className="text-xs text-center leading-tight">{item.name}</div>
                            {item.isBoss && item.hp && (
                                <div className="text-xs text-red-300 mt-1">
                                    HP: {item.hp}
                                </div>
                            )}
                        </motion.div>
                    ))}
                </AnimatePresence>
            )}

            {/* Floating messages */}
            <AnimatePresence>
                {floatingMessages.map(message => (
                    <motion.div
                        key={message.id}
                        className={`absolute pointer-events-none text-sm font-bold z-20 max-w-48 text-center ${
                            message.isPositive ? 'text-green-300' : 'text-red-300'
                        }`}
                        initial={{ opacity: 1, scale: 0.8 }}
                        animate={{
                            y: message.y - 60,
                            opacity: 0,
                            scale: 1.1,
                        }}
                        transition={{ duration: 2.5, ease: "easeOut" }}
                        style={{
                            left: `${message.x}%`,
                            top: `${message.y}%`,
                            transform: "translateX(-50%)"
                        }}
                    >
                        {message.message}
                    </motion.div>
                ))}
            </AnimatePresence>

            {/* Particles */}
            <AnimatePresence>
                {particles.map(particle => (
                    <motion.div
                        key={particle.id}
                        className={`absolute w-3 h-3 rounded-full bg-gradient-to-r ${particle.color} pointer-events-none z-30`}
                        initial={{ x: particle.x, y: particle.y, opacity: 1, scale: 1 }}
                        animate={{
                            x: particle.x + (Math.random() - 0.5) * 80,
                            y: particle.y - Math.random() * 40 - 15,
                            opacity: 0,
                            scale: 0,
                        }}
                        transition={{ duration: 1.2, ease: "easeOut" }}
                        onAnimationComplete={() => {
                            setParticles(prev => prev.filter(p => p.id !== particle.id));
                        }}
                    />
                ))}
            </AnimatePresence>

            {/* Animated background */}
            <div className="absolute inset-0 overflow-hidden opacity-20">
                {backgroundDots.map((dot, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-white rounded-full opacity-70"
                        initial={{
                            x: dot.x,
                            y: -10,
                        }}
                        animate={{
                            y: windowSize.height + 10,
                        }}
                        transition={{
                            duration: dot.duration,
                            repeat: Infinity,
                            ease: "linear",
                        }}
                    />
                ))}
            </div>

            {/* Health warning */}
            {gameStarted && health <= 25 && !gameEnded && (
                <motion.div
                    animate={{ opacity: [0.7, 1, 0.7] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="absolute inset-0 border-4 border-red-500 pointer-events-none z-40"
                />
            )}

            {/* Achievement notifications */}
            <AnimatePresence>
                {achievements.slice(-1).map((achievement) => (
                    <motion.div
                        key={achievement}
                        initial={{ opacity: 0, y: -100, x: "50%" }}
                        animate={{ opacity: 1, y: 100, x: "50%" }}
                        exit={{ opacity: 0, y: -100 }}
                        className="absolute left-1/2 transform -translate-x-1/2 z-50 bg-gradient-to-r from-yellow-500 to-orange-500 text-black px-6 py-3 rounded-xl font-bold text-lg shadow-2xl"
                    >
                        🏆 Achievement Unlocked!
                    </motion.div>
                ))}
            </AnimatePresence>

            {/* End screen */}
            <AnimatePresence>
                {gameEnded && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-80 backdrop-blur-sm z-50"
                    >
                        <div className="text-center bg-gradient-to-br from-gray-800 to-gray-900 p-10 rounded-3xl shadow-2xl max-w-md mx-4">
                            <div className="text-8xl mb-6">
                                {health <= 0 ? '💀' : projects > 2 ? '🎉' : projects > 0 ? '👨‍💻' : '😵‍💫'}
                            </div>
                            <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                                {health <= 0 ? 'Game Over!' : 'Koniec zmiany!'}
                            </h1>
                            <div className="text-white space-y-3 mb-8">
                                <p className="text-2xl">💻 Score: <span className="font-bold text-green-400">{score}</span></p>
                                <p className="text-xl">🚀 Projekty: <span className="font-bold text-blue-400">{projects}</span></p>
                                <p className="text-lg">⭐ Level: <span className="font-bold text-purple-400">{level}</span></p>
                                <p className="text-lg">🔥 Max Combo: <span className="font-bold text-orange-400">{maxCombo}</span></p>
                                <p className="text-lg">🏆 Osiągnięcia: <span className="font-bold text-yellow-400">{achievements.length}</span></p>
                                <p className="text-lg opacity-60 italic">
                                    {health <= 0 ? '"Może warto było napić się kawy..."' :
                                        projects > 2 ? '"Senior developer spotted!"' :
                                            projects > 0 ? '"Nie najgorzej jak na juniora!"' :
                                                '"Może warto wrócić na bootcamp..."'}
                                </p>
                            </div>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={resetGame}
                                className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white px-8 py-4 rounded-xl text-xl font-bold shadow-lg"
                            >
                                🔄 Nowa zmiana
                            </motion.button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}