import { useState, useEffect, useCallback } from 'react';
import { 
  UserProgress, 
  Badge, 
  Achievement, 
  XP_SYSTEM, 
  DEFAULT_BADGES,
  EDUCATION_STORAGE_KEYS,
  DifficultyLevel
} from '../types/educacaoFinanceira';

interface UseGamificationReturn {
  userProgress: UserProgress;
  badges: Badge[];
  achievements: Achievement[];
  isLoading: boolean;
  
  // Actions
  addXP: (amount: number, source?: string) => Promise<boolean>;
  completeModule: (moduleId: string, difficulty: DifficultyLevel) => Promise<boolean>;
  completeQuiz: (quizId: string, score: number, perfectScore?: boolean) => Promise<boolean>;
  completeTrack: (trackId: string) => Promise<boolean>;
  updateStreak: () => Promise<boolean>;
  
  // Calculations
  getXPForLevel: (level: number) => number;
  getXPForNextLevel: (currentLevel: number) => number;
  getLevelFromXP: (xp: number) => number;
  checkAchievements: () => Promise<Achievement[]>;
  
  // Utilities
  resetProgress: () => void;
  exportProgress: () => string;
  importProgress: (data: string) => boolean;
}

const useGamification = (): UseGamificationReturn => {
  const [userProgress, setUserProgress] = useState<UserProgress>({
    id: 'default-user',
    xp: 0,
    level: 1,
    completedModules: [],
    completedTracks: [],
    completedQuizzes: [],
    badges: [],
    certificates: [],
    streakDays: 0,
    lastActivity: new Date(),
    createdAt: new Date(),
    updatedAt: new Date()
  });

  const [badges, setBadges] = useState<Badge[]>(DEFAULT_BADGES);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load data from localStorage
  useEffect(() => {
    const loadData = () => {
      try {
        const savedProgress = localStorage.getItem(EDUCATION_STORAGE_KEYS.USER_PROGRESS);
        const savedBadges = localStorage.getItem(EDUCATION_STORAGE_KEYS.BADGES);

        if (savedProgress) {
          const progress = JSON.parse(savedProgress);
          setUserProgress({
            ...progress,
            lastActivity: new Date(progress.lastActivity),
            createdAt: new Date(progress.createdAt),
            updatedAt: new Date(progress.updatedAt)
          });
        }

        if (savedBadges) {
          setBadges(JSON.parse(savedBadges));
        }
      } catch (error) {
        console.error('Error loading gamification data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Save data to localStorage
  const saveProgress = useCallback((progress: UserProgress) => {
    try {
      localStorage.setItem(EDUCATION_STORAGE_KEYS.USER_PROGRESS, JSON.stringify(progress));
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  }, []);

  const saveBadges = useCallback((badgeList: Badge[]) => {
    try {
      localStorage.setItem(EDUCATION_STORAGE_KEYS.BADGES, JSON.stringify(badgeList));
    } catch (error) {
      console.error('Error saving badges:', error);
    }
  }, []);

  // XP and Level calculations
  const getXPForLevel = useCallback((level: number): number => {
    return Math.floor(XP_SYSTEM.LEVEL_BASE * Math.pow(XP_SYSTEM.LEVEL_MULTIPLIER, level - 1));
  }, []);

  const getXPForNextLevel = useCallback((currentLevel: number): number => {
    return getXPForLevel(currentLevel + 1);
  }, [getXPForLevel]);

  const getLevelFromXP = useCallback((xp: number): number => {
    let level = 1;
    let totalXPNeeded = 0;
    
    while (totalXPNeeded <= xp) {
      totalXPNeeded += getXPForLevel(level);
      if (totalXPNeeded <= xp) {
        level++;
      }
    }
    
    return level;
  }, [getXPForLevel]);

  // Add XP and check for level up
  const addXP = useCallback(async (amount: number, source?: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setUserProgress(prev => {
        const newXP = prev.xp + amount;
        const newLevel = getLevelFromXP(newXP);
        const leveledUp = newLevel > prev.level;

        const updated = {
          ...prev,
          xp: newXP,
          level: newLevel,
          lastActivity: new Date(),
          updatedAt: new Date()
        };

        saveProgress(updated);
        
        if (leveledUp) {
          console.log(`Level up! New level: ${newLevel}`);
        }
        
        resolve(leveledUp);
        return updated;
      });
    });
  }, [getLevelFromXP, saveProgress]);

  // Complete module
  const completeModule = useCallback(async (moduleId: string, difficulty: DifficultyLevel): Promise<boolean> => {
    if (userProgress.completedModules.includes(moduleId)) {
      return false;
    }

    const xpReward = XP_SYSTEM.ACTIVITIES.MODULE_COMPLETION[difficulty];
    
    setUserProgress(prev => {
      const updated = {
        ...prev,
        completedModules: [...prev.completedModules, moduleId],
        updatedAt: new Date()
      };
      saveProgress(updated);
      return updated;
    });

    return await addXP(xpReward, `module-${moduleId}`);
  }, [userProgress.completedModules, addXP, saveProgress]);

  // Complete quiz
  const completeQuiz = useCallback(async (quizId: string, score: number, perfectScore = false): Promise<boolean> => {
    const baseXP = XP_SYSTEM.ACTIVITIES.QUIZ_COMPLETION;
    const bonusXP = perfectScore ? XP_SYSTEM.ACTIVITIES.QUIZ_PERFECT_SCORE : 0;
    const totalXP = baseXP + bonusXP;

    return await addXP(totalXP, `quiz-${quizId}`);
  }, [addXP]);

  // Complete track
  const completeTrack = useCallback(async (trackId: string): Promise<boolean> => {
    if (userProgress.completedTracks.includes(trackId)) {
      return false;
    }

    setUserProgress(prev => {
      const updated = {
        ...prev,
        completedTracks: [...prev.completedTracks, trackId],
        updatedAt: new Date()
      };
      saveProgress(updated);
      return updated;
    });

    return await addXP(XP_SYSTEM.ACTIVITIES.TRACK_COMPLETION, `track-${trackId}`);
  }, [userProgress.completedTracks, addXP, saveProgress]);

  // Update streak
  const updateStreak = useCallback(async (): Promise<boolean> => {
    const today = new Date();
    const lastActivity = new Date(userProgress.lastActivity);
    const daysDiff = Math.floor((today.getTime() - lastActivity.getTime()) / (1000 * 60 * 60 * 24));

    let newStreak = userProgress.streakDays;
    let earnedXP = false;

    if (daysDiff === 1) {
      // Consecutive day
      newStreak += 1;
      await addXP(XP_SYSTEM.ACTIVITIES.DAILY_STREAK, 'daily-streak');
      earnedXP = true;
    } else if (daysDiff > 1) {
      // Streak broken
      newStreak = 1;
    }

    setUserProgress(prev => {
      const updated = {
        ...prev,
        streakDays: newStreak,
        lastActivity: today,
        updatedAt: new Date()
      };
      saveProgress(updated);
      return updated;
    });

    return earnedXP;
  }, [userProgress.lastActivity, userProgress.streakDays, addXP, saveProgress]);

  // Check achievements
  const checkAchievements = useCallback(async (): Promise<Achievement[]> => {
    const unlockedAchievements: Achievement[] = [];
    
    // Check each badge condition
    const updatedBadges = badges.map(badge => {
      if (badge.unlockedAt || !badge.condition) return badge;

      let conditionMet = false;
      const condition = badge.condition;

      switch (condition.type) {
        case 'modules_completed':
          conditionMet = userProgress.completedModules.length >= condition.target;
          break;
        case 'xp_earned':
          conditionMet = userProgress.xp >= condition.target;
          break;
        case 'streak_days':
          conditionMet = userProgress.streakDays >= condition.target;
          break;
        default:
          break;
      }

      if (conditionMet) {
        const unlockedBadge = {
          ...badge,
          unlockedAt: new Date()
        };

        // Add to user's badges
        setUserProgress(prev => {
          const updated = {
            ...prev,
            badges: [...prev.badges, unlockedBadge],
            updatedAt: new Date()
          };
          saveProgress(updated);
          return updated;
        });

        return unlockedBadge;
      }

      return badge;
    });

    setBadges(updatedBadges);
    saveBadges(updatedBadges);

    return unlockedAchievements;
  }, [badges, userProgress, saveProgress, saveBadges]);

  // Reset progress
  const resetProgress = useCallback(() => {
    const initialProgress: UserProgress = {
      id: 'default-user',
      xp: 0,
      level: 1,
      completedModules: [],
      completedTracks: [],
      completedQuizzes: [],
      badges: [],
      certificates: [],
      streakDays: 0,
      lastActivity: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    setUserProgress(initialProgress);
    setBadges(DEFAULT_BADGES);
    
    localStorage.removeItem(EDUCATION_STORAGE_KEYS.USER_PROGRESS);
    localStorage.removeItem(EDUCATION_STORAGE_KEYS.BADGES);
  }, []);

  // Export progress
  const exportProgress = useCallback((): string => {
    const data = {
      userProgress,
      badges,
      exportDate: new Date().toISOString()
    };
    return JSON.stringify(data, null, 2);
  }, [userProgress, badges]);

  // Import progress
  const importProgress = useCallback((data: string): boolean => {
    try {
      const parsed = JSON.parse(data);
      
      if (parsed.userProgress) {
        const progress = {
          ...parsed.userProgress,
          lastActivity: new Date(parsed.userProgress.lastActivity),
          createdAt: new Date(parsed.userProgress.createdAt),
          updatedAt: new Date(parsed.userProgress.updatedAt)
        };
        setUserProgress(progress);
        saveProgress(progress);
      }

      if (parsed.badges) {
        setBadges(parsed.badges);
        saveBadges(parsed.badges);
      }

      return true;
    } catch (error) {
      console.error('Error importing progress:', error);
      return false;
    }
  }, [saveProgress, saveBadges]);

  return {
    userProgress,
    badges,
    achievements,
    isLoading,
    
    // Actions
    addXP,
    completeModule,
    completeQuiz,
    completeTrack,
    updateStreak,
    
    // Calculations
    getXPForLevel,
    getXPForNextLevel,
    getLevelFromXP,
    checkAchievements,
    
    // Utilities
    resetProgress,
    exportProgress,
    importProgress
  };
};

export default useGamification;