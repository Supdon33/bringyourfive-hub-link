import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, X, Play, Pause } from "lucide-react";

import scene1 from "@/assets/reel/scene1-couch.jpg";
import scene2 from "@/assets/reel/scene2-phone-home.jpg";
import scene2Screen from "@/assets/reel/by5_homescreen.png";
import scene3 from "@/assets/reel/scene3-phone-login.jpg";
import scene3Screen from "@/assets/reel/by5_signin.png";
import scene4 from "@/assets/reel/scene4-phone-runs.jpg";
import scene4Screen from "@/assets/reel/by5_listedruns.png";
import scene5 from "@/assets/reel/scene5-phone-joined.jpg";
import scene5Screen from "@/assets/reel/by5_addnametolist.png";

const scenes = [
  {
    id: 1,
    image: scene1,
    caption: "Bored at home... tossing the ball around 🏀",
    subtitle: '"I need to find a run..."',
  },
  {
    id: 2,
    image: scene2,
    screen: scene2Screen,
    caption: "Opens Bring Your 🖐🏿",
    subtitle: "The app to find pickup games near you",
  },
  {
    id: 3,
    image: scene3,
    screen: scene3Screen,
    caption: "Signs in to his account ✅",
    subtitle: "Quick login, ready to hoop",
  },
  {
    id: 4,
    image: scene4,
    screen: scene4Screen,
    caption: "Finds an available run! 🔥",
    subtitle: "College Male run at Greenbelt Rec — let's go!",
  },
  {
    id: 5,
    image: scene5,
    screen: scene5Screen,
    caption: "Adds his name to the roster 🙌🏿",
    subtitle: "Locked in. Time to hoop!",
  },
];

const SCENE_DURATION = 4000;

const Reel = () => {
  const [current, setCurrent] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [showScreen, setShowScreen] = useState(false);
  const navigate = useNavigate();

  const next = useCallback(() => {
    setCurrent((c) => (c < scenes.length - 1 ? c + 1 : c));
    setProgress(0);
    setShowScreen(false);
  }, []);

  const prev = useCallback(() => {
    setCurrent((c) => (c > 0 ? c - 1 : c));
    setProgress(0);
    setShowScreen(false);
  }, []);

  // Auto-advance
  useEffect(() => {
    if (!playing) return;
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          if (current < scenes.length - 1) {
            next();
            return 0;
          }
          setPlaying(false);
          return 100;
        }
        return p + 100 / (SCENE_DURATION / 50);
      });
    }, 50);
    return () => clearInterval(interval);
  }, [playing, current, next]);

  // Show screen overlay after a delay
  useEffect(() => {
    if (scenes[current].screen) {
      const timer = setTimeout(() => setShowScreen(true), 800);
      return () => clearTimeout(timer);
    } else {
      setShowScreen(false);
    }
  }, [current]);

  // Keyboard nav
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") next();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "Escape") navigate("/");
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [next, prev, navigate]);

  const scene = scenes[current];

  return (
    <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center select-none">
      {/* Close */}
      <button
        onClick={() => navigate("/")}
        className="absolute top-4 right-4 z-50 text-white/70 hover:text-white transition-colors"
      >
        <X className="w-7 h-7" />
      </button>

      {/* Progress bars */}
      <div className="absolute top-0 left-0 right-0 z-50 flex gap-1 px-3 pt-3">
        {scenes.map((_, i) => (
          <div key={i} className="flex-1 h-[3px] bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-75"
              style={{
                width: i < current ? "100%" : i === current ? `${progress}%` : "0%",
              }}
            />
          </div>
        ))}
      </div>

      {/* Main scene */}
      <div className="relative w-full h-full max-w-[430px] mx-auto overflow-hidden">
        {/* Background image */}
        <img
          src={scene.image}
          alt={scene.caption}
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
        />

        {/* Dark gradient overlay for text */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />

        {/* Phone screen overlay */}
        {scene.screen && (
          <div
            className={`absolute inset-0 flex items-center justify-center transition-all duration-700 ${
              showScreen ? "opacity-100 scale-100" : "opacity-0 scale-90"
            }`}
          >
            <div className="relative w-[85%] max-w-[360px] rounded-2xl overflow-hidden shadow-2xl border-2 border-white/10">
              <img
                src={scene.screen}
                alt="App screenshot"
                className="w-full h-auto"
              />
            </div>
          </div>
        )}

        {/* Caption */}
        <div className="absolute bottom-0 left-0 right-0 p-6 pb-16 z-10">
          <p className="text-white font-bold text-xl leading-tight mb-1 drop-shadow-lg">
            {scene.caption}
          </p>
          <p className="text-white/70 text-sm drop-shadow-md">
            {scene.subtitle}
          </p>
        </div>

        {/* Tap zones */}
        <button
          onClick={prev}
          className="absolute left-0 top-0 w-1/3 h-full z-20"
          aria-label="Previous"
        />
        <button
          onClick={next}
          className="absolute right-0 top-0 w-2/3 h-full z-20"
          aria-label="Next"
        />
      </div>

      {/* Play/Pause */}
      <button
        onClick={() => setPlaying((p) => !p)}
        className="absolute bottom-4 right-4 z-50 text-white/50 hover:text-white transition-colors"
      >
        {playing ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
      </button>

      {/* Scene counter */}
      <div className="absolute bottom-4 left-4 z-50 text-white/50 text-xs font-mono">
        {current + 1} / {scenes.length}
      </div>
    </div>
  );
};

export default Reel;
