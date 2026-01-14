import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

// Icons using Feather style to match the site
const CheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
        <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
);

const ArrowRightIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="5" y1="12" x2="19" y2="12"></line>
        <polyline points="12 5 19 12 12 19"></polyline>
    </svg>
);

const GoogleIcon = () => (
    <svg className="h-5 w-5" viewBox="0 0 24 24">
        <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            fill="#4285F4"
        />
        <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34A853"
        />
        <path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            fill="#FBBC05"
        />
        <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            fill="#EA4335"
        />
    </svg>
);

interface PlgSignupProps {
    dashboardUrl: string;
}

export default function PlgSignup({ dashboardUrl }: PlgSignupProps) {
    const [registerUrl, setRegisterUrl] = useState<string>(`${dashboardUrl}/auth/register`);

    useEffect(() => {
        // Run only on client side
        if (typeof window !== 'undefined') {
            const currentParams = new URLSearchParams(window.location.search);
            // Construct the new URL with appended params
            const targetUrl = new URL(`${dashboardUrl}/auth/register`);

            currentParams.forEach((value, key) => {
                targetUrl.searchParams.append(key, value);
            });

            setRegisterUrl(targetUrl.toString());
        }
    }, [dashboardUrl]);

    return (
        <div className="mx-auto max-w-4xl relative">
            {/* Glow Effect */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-primary/5 rounded-[3rem] blur-3xl -z-10" />

            <div className="bg-surface rounded-2xl shadow-glow-primary border border-border overflow-hidden p-8 md:p-12 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-6">
                        <span className="text-3xl">🚀</span>
                    </div>

                    <h2 className="text-3xl md:text-4xl font-bold text-text mb-4">
                        Comienza tu prueba gratuita
                    </h2>
                    <p className="text-lg text-text-secondary max-w-2xl mx-auto mb-10">
                        Únete a miles de agentes inmobiliarios que ya están automatizando su cualificación de leads.
                        Sin tarjeta de crédito. Cancela cuando quieras.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-10">
                        <a
                            href={registerUrl}
                            className="btn-emerald w-full sm:w-auto text-lg px-8 py-4 shadow-lg hover:shadow-glow-emerald flex items-center justify-center gap-2"
                        >
                            Empezar Gratis Ahora
                            <ArrowRightIcon />
                        </a>

                        {/* Optional Google Login Shortcut - can point to same register URL or specific google auth endpoint if available */}
                        {/* For now, we point to register where they can choose Google */}
                        <a
                            href={registerUrl} // Or specific google auth endpoint if different
                            className="w-full sm:w-auto px-8 py-4 rounded-full border border-border bg-white text-gray-700 font-medium hover:bg-gray-50 hover:shadow-sm transition-all flex items-center justify-center gap-3"
                        >
                            <GoogleIcon />
                            <span>Entrar con Google</span>
                        </a>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left max-w-3xl mx-auto border-t border-border pt-8">
                        <div className="flex items-start gap-3">
                            <div className="mt-1 p-1 bg-primary/10 rounded-full"><CheckIcon /></div>
                            <div>
                                <h4 className="font-bold text-text text-sm">Prueba gratuita de 14 días</h4>
                                <p className="text-xs text-text-secondary mt-1">Acceso completo a todas las funciones PRO.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="mt-1 p-1 bg-primary/10 rounded-full"><CheckIcon /></div>
                            <div>
                                <h4 className="font-bold text-text text-sm">Configuración en 2 minutos</h4>
                                <p className="text-xs text-text-secondary mt-1">Integración sencilla con tus portales y web.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="mt-1 p-1 bg-primary/10 rounded-full"><CheckIcon /></div>
                            <div>
                                <h4 className="font-bold text-text text-sm">Sin compromiso</h4>
                                <p className="text-xs text-text-secondary mt-1">No te pediremos tarjeta de crédito para empezar.</p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
            <p className="text-center text-text-disabled text-sm mt-6">
                ¿Ya tienes una cuenta? <a href={`${dashboardUrl}/auth/login`} className="text-primary hover:underline">Inicia sesión aquí</a>
            </p>
        </div>
    );
}
