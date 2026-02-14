import React from 'react';

interface AuthLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  title = 'AURA',
  subtitle = 'Por favor, inicia sesión en tu cuenta'
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden py-12 px-4 sm:px-6 lg:px-8">
      {/* Background Floating Orbs */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-15%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/30 blur-[120px] animate-float" />
        <div className="absolute bottom-[-15%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-500/20 blur-[120px] animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40%] h-[40%] rounded-full bg-blue-500/15 blur-[100px] animate-pulse-glow" />
      </div>

      <div className="max-w-md w-full space-y-8 relative z-10">
        {/* Logo & Title Section */}
        <div className="text-center">
          <div className="mx-auto h-20 w-20 flex items-center justify-center mb-6 relative group">
            {/* Glow effect behind icon */}
            <div className="absolute inset-0 bg-primary/30 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300" />

            {/* Icon container with glass effect */}
            <div className="relative glass rounded-2xl p-2 border border-white/10 shadow-[0_0_30px_rgba(124,58,237,0.3)] group-hover:shadow-[0_0_50px_rgba(124,58,237,0.5)] transition-all duration-300">
              <img
                src="/images/logo.png"
                alt="AURA Logo"
                className="h-16 w-16 object-contain"
              />
            </div>
          </div>

          <h1 className="text-4xl font-bold mb-3 tracking-tight">
            <span className="text-gradient">{title}</span>
          </h1>
          <p className="text-base text-muted-foreground max-w-sm mx-auto">
            {subtitle}
          </p>
        </div>

        {children}
      </div>
    </div>
  );
};

export default AuthLayout;