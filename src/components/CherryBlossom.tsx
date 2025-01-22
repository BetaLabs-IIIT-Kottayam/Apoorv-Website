// src/components/CherryBlossom.jsx
export const CherryBlossom = () => {
    return (
      <div className="absolute inset-0 overflow-hidden z-30 pointer-events-none">
        {[...Array(100)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-blossom-fall"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 10}s`,
              opacity: Math.random() * 0.4 + 0.2,
              fontSize: `${Math.random() * 8 + 8}px`,
              filter: `blur(${Math.random() * 3}px)`,
            }}
          >
          </div>
        ))}
      </div>
    );
  };