import React from 'react';

const Loader = ({
  size = 'md',
  text = 'Loading...',
  variant = 'default',
  overlay = false,
}) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
  };

  const LoaderContent = () => (
    <div className="flex flex-col items-center justify-center space-y-4">
      {/* Spinner */}
      {variant === 'default' && (
        <div className="relative">
          <div className={`${sizeClasses[size]} border-4 border-purple-500/20 rounded-full`}></div>
          <div
            className={`${sizeClasses[size]} border-4 border-purple-500 border-t-transparent rounded-full absolute top-0 left-0 animate-spin`}
          ></div>
        </div>
      )}

      {/* Pulsing Dots */}
      {variant === 'dots' && (
        <div className="flex space-x-2">
          <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-3 h-3 bg-pink-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
        </div>
      )}

      {/* Bouncing Squares */}
      {variant === 'squares' && (
        <div className="flex space-x-1">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="w-3 h-3 bg-gradient-to-r from-purple-500 to-blue-500 animate-bounce"
              style={{ animationDelay: `${i * 0.1}s` }}
            ></div>
          ))}
        </div>
      )}

      {/* Gradient Ring */}
      {variant === 'ring' && (
        <div className="relative">
          <div className={`${sizeClasses[size]} rounded-full bg-gradient-to-r from-purple-500 via-blue-500 to-pink-500 animate-spin p-1`}>
            <div className="bg-slate-900 rounded-full w-full h-full flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      )}

      {/* Flowing Bars */}
      {variant === 'bars' && (
        <div className="flex items-end space-x-1 h-8">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="w-2 bg-gradient-to-t from-purple-600 to-blue-400 rounded-t animate-pulse"
              style={{
                height: `${20 + (i % 3) * 10}px`,
                animationDelay: `${i * 0.1}s`,
                animationDuration: '1s',
              }}
            ></div>
          ))}
        </div>
      )}

      {/* Text */}
      {text && (
        <p className={`text-gray-300 ${textSizeClasses[size]} font-medium animate-pulse`}>
          {text}
        </p>
      )}
    </div>
  );

  if (overlay) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 min-w-[200px] text-center">
          <LoaderContent />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 text-center border border-white/10">
      <LoaderContent />
    </div>
  );
};

const LoaderDemo = () => {
  const [activeVariant, setActiveVariant] = React.useState('default');
  const [showOverlay, setShowOverlay] = React.useState(false);
  const [size, setSize] = React.useState('md');

  React.useEffect(() => {
    if (showOverlay) {
      const timer = setTimeout(() => setShowOverlay(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showOverlay]);

  const variants = [
    { key: 'default', name: 'Spinner' },
    { key: 'dots', name: 'Pulsing Dots' },
    { key: 'squares', name: 'Bouncing Squares' },
    { key: 'ring', name: 'Gradient Ring' },
    { key: 'bars', name: 'Flowing Bars' },
  ];

  const sizes = ['sm', 'md', 'lg', 'xl'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden p-4 sm:p-6">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-2000"></div>
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>

      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-black bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent mb-4">
            Cool Loader Component
          </h1>
          <p className="text-gray-300 text-base">
            Stylish loading animations for your API calls
          </p>
        </div>

        {/* Controls */}
        <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 mb-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Variant Buttons */}
            <div>
              <h3 className="text-white font-semibold mb-3">Variants</h3>
              <div className="grid grid-cols-2 gap-2">
                {variants.map((variant) => (
                  <button
                    key={variant.key}
                    onClick={() => setActiveVariant(variant.key)}
                    className={`p-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                      activeVariant === variant.key
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                        : 'bg-white/10 border border-white/20 text-gray-300 hover:bg-white/20'
                    }`}
                  >
                    {variant.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Size Buttons */}
            <div>
              <h3 className="text-white font-semibold mb-3">Sizes</h3>
              <div className="grid grid-cols-4 gap-2">
                {sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className={`p-3 rounded-lg text-sm font-medium uppercase transition-all duration-200 ${
                      size === s
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                        : 'bg-white/10 border border-white/20 text-gray-300 hover:bg-white/20'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Overlay Button */}
          <div className="mt-6">
            <button
              onClick={() => setShowOverlay(true)}
              className="bg-gradient-to-r from-pink-600 to-red-600 text-white px-6 py-3 rounded-lg hover:from-pink-700 hover:to-red-700 transition-all duration-300 font-medium"
            >
              Show Overlay Loader
            </button>
          </div>
        </div>

        {/* Loader Output */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-white font-semibold mb-4">Current Configuration</h3>
            <Loader variant={activeVariant} size={size} text="Loading your data..." />
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Usage Example</h3>
            <div className="bg-black/30 backdrop-blur-md rounded-xl p-4 border border-white/10">
              <pre className="text-gray-300 text-sm overflow-x-auto">
                <code>{`<Loader 
  variant="${activeVariant}" 
  size="${size}" 
  text="Loading your data..." 
  overlay={false}
/>`}</code>
              </pre>
            </div>
          </div>
        </div>

        {/* Overlay Instance */}
        {showOverlay && (
          <Loader
            variant={activeVariant}
            size={size}
            text="This is an overlay loader!"
            overlay={true}
          />
        )}
      </div>

      {/* Animations */}
      <style jsx>{`
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
        @keyframes pulse {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.3;
          }
        }
        @keyframes bounce {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        .animate-pulse {
          animation: pulse 2s ease-in-out infinite;
        }
        .animate-bounce {
          animation: bounce 1s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default LoaderDemo;
