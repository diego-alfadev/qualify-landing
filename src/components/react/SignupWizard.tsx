
import React, { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Helper for conditional classes
function cn(...inputs: (string | undefined | null | false)[]) {
    return twMerge(clsx(inputs));
}

const Typewriter = ({ phrases }: { phrases: string[] }) => {
    const [text, setText] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);
    const [loopNum, setLoopNum] = useState(0);
    const [typingSpeed, setTypingSpeed] = useState(150);

    React.useEffect(() => {
        const i = loopNum % phrases.length;
        const fullText = phrases[i];

        const handleType = () => {
            setText(isDeleting
                ? fullText.substring(0, text.length - 1)
                : fullText.substring(0, text.length + 1)
            );

            setTypingSpeed(isDeleting ? 50 : 100);

            if (!isDeleting && text === fullText) {
                // Pause at end
                setTimeout(() => setIsDeleting(true), 2000);
            } else if (isDeleting && text === '') {
                setIsDeleting(false);
                setLoopNum(loopNum + 1);
            }
        };

        const timer = setTimeout(handleType, isDeleting && text === fullText ? 2000 : typingSpeed);
        return () => clearTimeout(timer);
    }, [text, isDeleting, loopNum, phrases, typingSpeed]);

    return (
        <span className="inline-block min-w-[20px]">
            {text}
            <span className="animate-pulse border-r-2 border-primary ml-1">&nbsp;</span>
        </span>
    );
};

// Steps configuration
const steps = [
    { id: 'personal', title: 'Datos Personales' },
    { id: 'agency', title: 'Tu Agencia' },
    { id: 'marketing', title: 'Conócenos' },
    { id: 'review', title: 'Confirmación' },
];

type FormData = {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    agencyName: string;
    website?: string;
    referralSource: string;
    referralDetail?: string;
    whyQualify?: string;
    // Traking fields
    utmSource?: string;
    utmMedium?: string;
    utmCampaign?: string;
    utmTerm?: string;
    utmContent?: string;
    referralCode?: string;
};

interface SignupWizardProps {
    // initialValues are now optional and mainly for testing or strict defaults
    initialValues?: Partial<FormData>;
    // customWelcome can still be passed as prop, but we'll also check params
    customWelcomeFromProps?: {
        title?: string;
        message?: string;
        showBanner?: boolean;
    };
}

export default function SignupWizard({ initialValues, customWelcomeFromProps }: SignupWizardProps) {
    const [currentStep, setCurrentStep] = useState(0);
    const [direction, setDirection] = useState(0);

    const { register, handleSubmit, trigger, control, setValue, formState: { errors } } = useForm<FormData>({
        mode: "onChange",
        defaultValues: initialValues
    });

    const [welcomeState, setWelcomeState] = useState(customWelcomeFromProps);

    // Handle Query Params on Mount
    React.useEffect(() => {
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);

            // Helper to set value if param exists
            const setIfPresent = (param: string, field: keyof FormData) => {
                const val = params.get(param);
                if (val) setValue(field, val);
            };

            // Map params to fields
            setIfPresent('name', 'firstName');
            setIfPresent('lastname', 'lastName');
            setIfPresent('email', 'email');
            setIfPresent('phone', 'phone');
            setIfPresent('company', 'agencyName');
            setIfPresent('website', 'website');

            // Handle Source / Referral
            const source = params.get('source');
            if (source) {
                // Check if it matches our select options
                const validSources = ['google', 'social', 'referral', 'blog'];
                if (validSources.includes(source.toLowerCase())) {
                    setValue('referralSource', source.toLowerCase());
                } else {
                    // If not a standard source, maybe put it in 'other' or just track it
                    setValue('referralSource', 'other');
                    setValue('referralDetail', source);
                }
            }

            // Tracking fields
            setIfPresent('utm_source', 'utmSource');
            setIfPresent('utm_medium', 'utmMedium');
            setIfPresent('utm_campaign', 'utmCampaign');
            setIfPresent('utm_term', 'utmTerm');
            setIfPresent('utm_content', 'utmContent');

            // Handle 'ref', 'referral', 'referrer' -> referralCode
            const ref = params.get('ref') || params.get('referral') || params.get('referrer');
            if (ref) setValue('referralCode', ref);

            // Fallback: if utm_source is empty but source is present, use source
            if (!params.get('utm_source') && source) {
                setValue('utmSource', source);
            }
            if (!params.get('utm_campaign') && params.get('campaign')) {
                setValue('utmCampaign', params.get('campaign')!);
            }

            // Handle Custom Welcome Message from Params
            const msg = params.get('msg');
            if (msg) {
                setWelcomeState({
                    showBanner: true,
                    title: params.get('title') || "¡Te estábamos esperando!",
                    message: msg,
                });
            }
        }
    }, [setValue]);

    // Watch values for the review step
    const formValues = useWatch({ control });

    const processStep = async (nextStep: number) => {
        // Prevent going out of bounds
        if (nextStep < 0 || nextStep >= steps.length) return;

        // Validate current step fields before moving forward
        if (nextStep > currentStep) {
            let fieldsToValidate: (keyof FormData)[] = [];
            if (currentStep === 0) fieldsToValidate = ['firstName', 'lastName', 'email', 'phone'];
            if (currentStep === 1) fieldsToValidate = ['agencyName'];
            if (currentStep === 2) fieldsToValidate = ['referralSource'];

            const isValid = await trigger(fieldsToValidate);
            if (!isValid) return;
        }

        setDirection(nextStep > currentStep ? 1 : -1);
        setCurrentStep(nextStep);
    };

    const onSubmit = (data: FormData) => {
        console.log('Form Submitted', data);
        // Simulation of API call

    };

    // Variants for animation
    const variants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 50 : -50,
            opacity: 0,
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1,
        },
        exit: (direction: number) => ({
            zIndex: 0,
            x: direction < 0 ? 50 : -50,
            opacity: 0,
        }),
    };

    return (
        <div className="mx-auto max-w-5xl">
            {/* Glow Effect Background */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[105%] h-[105%] bg-primary/5 rounded-[2rem] blur-3xl -z-10" />

            <div className="bg-surface rounded-2xl shadow-glow-primary border border-border overflow-hidden grid grid-cols-1 lg:grid-cols-[1fr_350px]">
                {/* Main Form Area */}
                <div className="p-6 md:p-8 lg:p-10 order-2 lg:order-1">
                    {/* Hidden Inputs for Tracking */}
                    <input type="hidden" {...register('utmSource')} />
                    <input type="hidden" {...register('utmMedium')} />
                    <input type="hidden" {...register('utmCampaign')} />
                    <input type="hidden" {...register('utmTerm')} />
                    <input type="hidden" {...register('utmContent')} />
                    <input type="hidden" {...register('referralCode')} />

                    {/* Personalized Welcome Banner */}
                    {welcomeState?.showBanner && (
                        <div className="mb-8 p-4 bg-primary/10 border border-primary/20 rounded-xl flex items-start gap-3">
                            <span className="text-2xl">👋</span>
                            <div>
                                <h3 className="font-bold text-text mb-1">{welcomeState.title || "¡Hola!"}</h3>
                                <p className="text-sm text-text-secondary">{welcomeState.message}</p>
                            </div>
                        </div>
                    )}

                    {/* Progress Bar */}
                    <div className="mb-8">
                        <div className="flex justify-between mb-4 px-1 relative z-10">
                            {steps.map((step, index) => (
                                <div key={step.id} className={cn("flex items-center gap-2 transition-colors duration-300", index <= currentStep ? "text-primary" : "text-text-disabled")}>
                                    <span className={cn("flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold border transition-all",
                                        index <= currentStep ? "border-primary bg-primary/10" : "border-gray-500/30 bg-surface"
                                    )}>
                                        {index + 1}
                                    </span>
                                    <span className="hidden md:block text-base font-medium">
                                        {step.title}
                                    </span>
                                </div>
                            ))}
                        </div>
                        <div className="h-1.5 bg-background/50 rounded-full overflow-hidden relative">
                            <motion.div
                                className="h-full bg-gradient-to-r from-primary to-secondary"
                                initial={{ width: 0 }}
                                animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                                transition={{ duration: 0.4, ease: "easeInOut" }}
                            />
                        </div>
                    </div>

                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            if (currentStep === steps.length - 1) {
                                handleSubmit(onSubmit)(e);
                            }
                        }}
                        className="overflow-hidden relative min-h-[600px] flex flex-col"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                if (e.target instanceof HTMLTextAreaElement) return;
                                e.preventDefault();

                                const form = e.currentTarget;
                                const elements = Array.from(form.querySelectorAll('input, select, textarea, button[type="submit"]')) as HTMLElement[];
                                const currentIndex = elements.indexOf(e.target as HTMLElement);
                                const nextElement = elements[currentIndex + 1];

                                if (nextElement && !nextElement.hasAttribute('disabled') && nextElement.tagName !== 'BUTTON') {
                                    nextElement.focus();
                                } else {
                                    if (currentStep < steps.length - 1) {
                                        processStep(currentStep + 1);
                                    } else {
                                        // Only submit if it's the submit button or we are at the end
                                        handleSubmit(onSubmit)();
                                    }
                                }
                            }
                        }}
                    >
                        <div className="flex-grow relative">
                            <AnimatePresence mode="wait" custom={direction}>
                                <motion.div
                                    key={currentStep}
                                    custom={direction}
                                    variants={variants}
                                    initial="enter"
                                    animate="center"
                                    exit="exit"
                                    transition={{
                                        x: { type: "spring", stiffness: 300, damping: 30 },
                                        opacity: { duration: 0.2 }
                                    }}
                                    className="w-full absolute top-0 left-0"
                                >
                                    {currentStep === 0 && (
                                        <div className="space-y-6">
                                            <h2 className="text-2xl font-bold text-text">Cuéntanos sobre ti</h2>
                                            <p className="text-text-secondary -mt-4">Necesitamos tus datos de contacto para crear la cuenta.</p>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="space-y-1">
                                                    <label className="block text-sm font-medium text-text">Nombre</label>
                                                    <input {...register('firstName', { required: 'El nombre es obligatorio' })}
                                                        className="w-full rounded-xl border border-border bg-surface/50 p-4 text-text shadow-sm backdrop-blur-sm transition-all duration-200 focus:border-primary focus:bg-surface focus:shadow-glow-primary focus:outline-none focus:ring-0 placeholder:text-text-disabled"
                                                        placeholder="Ej. Juan" />
                                                    {errors.firstName && <p className="text-danger text-xs ml-1">{errors.firstName.message}</p>}
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="block text-sm font-medium text-text">Apellidos</label>
                                                    <input {...register('lastName', { required: 'El apellido es obligatorio' })}
                                                        className="w-full rounded-xl border border-border bg-surface/50 p-4 text-text shadow-sm backdrop-blur-sm transition-all duration-200 focus:border-primary focus:bg-surface focus:shadow-glow-primary focus:outline-none focus:ring-0 placeholder:text-text-disabled"
                                                        placeholder="Ej. Pérez" />
                                                    {errors.lastName && <p className="text-danger text-xs ml-1">{errors.lastName.message}</p>}
                                                </div>
                                            </div>

                                            <div className="space-y-1">
                                                <label className="block text-sm font-medium text-text">Email Profesional</label>
                                                <input {...register('email', {
                                                    required: 'El email es obligatorio',
                                                    pattern: { value: /^\S+@\S+$/i, message: "Introduce un email válido" }
                                                })}
                                                    className="w-full rounded-xl border border-border bg-surface/50 p-4 text-text shadow-sm backdrop-blur-sm transition-all duration-200 focus:border-primary focus:bg-surface focus:shadow-glow-primary focus:outline-none focus:ring-0 placeholder:text-text-disabled"
                                                    placeholder="juan@tuagencia.com" />
                                                {errors.email && <p className="text-danger text-xs ml-1">{errors.email.message}</p>}
                                            </div>

                                            <div className="space-y-1">
                                                <label className="block text-sm font-medium text-text">Teléfono</label>
                                                <input {...register('phone', { required: 'El teléfono es obligatorio' })}
                                                    className="w-full rounded-xl border border-border bg-surface/50 p-4 text-text shadow-sm backdrop-blur-sm transition-all duration-200 focus:border-primary focus:bg-surface focus:shadow-glow-primary focus:outline-none focus:ring-0 placeholder:text-text-disabled"
                                                    placeholder="+34 600 000 000" />
                                                {errors.phone && <p className="text-danger text-xs ml-1">{errors.phone.message}</p>}
                                            </div>
                                        </div>
                                    )}

                                    {currentStep === 1 && (
                                        <div className="space-y-6">
                                            <h2 className="text-2xl font-bold text-text">Sobre tu Agencia</h2>
                                            <p className="text-text-secondary -mt-4">Configura el perfil de tu inmobiliaria.</p>

                                            <div className="space-y-1">
                                                <label className="block text-sm font-medium text-text">Nombre Comercial</label>
                                                <input {...register('agencyName', { required: 'El nombre de la agencia es obligatorio' })}
                                                    className="w-full rounded-xl border border-border bg-surface/50 p-4 text-text shadow-sm backdrop-blur-sm transition-all duration-200 focus:border-primary focus:bg-surface focus:shadow-glow-primary focus:outline-none focus:ring-0 placeholder:text-text-disabled"
                                                    placeholder="Ej. Nuevo Milenio Real Estate" />
                                                {errors.agencyName && <p className="text-danger text-xs ml-1">{errors.agencyName.message}</p>}
                                            </div>

                                            <div className="space-y-1">
                                                <label className="block text-sm font-medium text-text">Sitio Web (Opcional)</label>
                                                <input {...register('website')}
                                                    className="w-full rounded-xl border border-border bg-surface/50 p-4 text-text shadow-sm backdrop-blur-sm transition-all duration-200 focus:border-primary focus:bg-surface focus:shadow-glow-primary focus:outline-none focus:ring-0 placeholder:text-text-disabled"
                                                    placeholder="www.nuevo-milenio.com" />
                                            </div>

                                            <div className="p-4 bg-primary/5 rounded-lg border border-primary/10">
                                                <p className="text-sm text-primary flex items-start gap-2">
                                                    <span className="text-lg">💡</span>
                                                    <span>Qualify Inmo se integrará con tu web para captar leads automáticamente.</span>
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {currentStep === 2 && (
                                        <div className="space-y-6">
                                            <h2 className="text-2xl font-bold text-text">Nos gustaría conocerte</h2>
                                            <p className="text-text-secondary -mt-4">Ayúdanos a mejorar Qualify Inmo.</p>

                                            <div className="space-y-1">
                                                <label className="block text-sm font-medium text-text">¿Cómo nos has conocido?</label>
                                                <select {...register('referralSource', { required: 'Selecciona una opción' })}
                                                    className="form-select w-full rounded-xl border border-border bg-surface/50 p-4 text-text shadow-sm backdrop-blur-sm transition-all duration-200 focus:border-primary focus:bg-surface focus:shadow-glow-primary focus:outline-none focus:ring-0">
                                                    <option value="">Selecciona una opción...</option>
                                                    <option value="google">Búsqueda en Google</option>
                                                    <option value="social">Redes Sociales (LinkedIn, Twitter...)</option>
                                                    <option value="referral">Recomendación de un amigo/colega</option>
                                                    <option value="blog">Blog / Artículo</option>
                                                    <option value="other">Otro</option>
                                                </select>
                                                {errors.referralSource && <p className="text-danger text-xs ml-1">{errors.referralSource.message}</p>}
                                            </div>

                                            {formValues.referralSource === 'other' && (
                                                <div className="space-y-1">
                                                    <label className="block text-sm font-medium text-text">¿Podrías especificar?</label>
                                                    <input {...register('referralDetail')}
                                                        className="w-full rounded-xl border border-border bg-surface/50 p-4 text-text shadow-sm backdrop-blur-sm transition-all duration-200 focus:border-primary focus:bg-surface focus:shadow-glow-primary focus:outline-none focus:ring-0 placeholder:text-text-disabled"
                                                        placeholder="Cuéntanos más..." />
                                                </div>
                                            )}

                                            <div className="space-y-1">
                                                <label className="block text-sm font-medium text-text">¿Por qué has elegido Qualify Inmo? (Opcional)</label>
                                                <textarea {...register('whyQualify')}
                                                    rows={3}
                                                    className="w-full rounded-xl border border-border bg-surface/50 p-4 text-text shadow-sm backdrop-blur-sm transition-all duration-200 focus:border-primary focus:bg-surface focus:shadow-glow-primary focus:outline-none focus:ring-0 placeholder:text-text-disabled"
                                                    placeholder="Ahorro de tiempo, automatización, probar algo nuevo..." />
                                            </div>
                                        </div>
                                    )}

                                    {currentStep === 3 && (
                                        <div className="space-y-6">
                                            <h2 className="text-2xl font-bold text-text">¡Casi hemos terminado!</h2>
                                            <p className="text-text-secondary -mt-4">Revisa tus datos antes de continuar.</p>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="p-4 bg-background rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow">
                                                    <span className="text-xs text-text-secondary font-medium uppercase tracking-wider block mb-1">Contacto</span>
                                                    <div className="font-bold text-text truncate">{formValues.firstName} {formValues.lastName}</div>
                                                    <div className="text-sm text-text-secondary truncate">{formValues.email}</div>
                                                    <div className="text-sm text-text-secondary">{formValues.phone}</div>
                                                </div>

                                                <div className="p-4 bg-background rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow">
                                                    <span className="text-xs text-text-secondary font-medium uppercase tracking-wider block mb-1">Agencia</span>
                                                    <div className="font-bold text-text truncate">{formValues.agencyName}</div>
                                                    {formValues.website && (
                                                        <div className="text-sm text-text-secondary truncate text-primary">{formValues.website}</div>
                                                    )}
                                                </div>

                                                <div className="p-4 bg-background rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow md:col-span-2">
                                                    <span className="text-xs text-text-secondary font-medium uppercase tracking-wider block mb-1">Nos conociste por</span>
                                                    <div className="flex items-center gap-2">
                                                        <span className="inline-flex items-center rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary ring-1 ring-inset ring-primary/20">
                                                            {formValues.referralSource}
                                                        </span>
                                                        {formValues.referralDetail && (
                                                            <span className="text-sm text-text-secondary"> - {formValues.referralDetail}</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-start gap-3 mt-4">
                                                <input type="checkbox" id="terms" className="mt-1 rounded border-border text-primary focus:ring-primary" required />
                                                <label htmlFor="terms" className="text-sm text-text-secondary">
                                                    Acepto la <a href="#" className="text-primary hover:underline">Política de Privacidad</a> y los <a href="#" className="text-primary hover:underline">Términos de Servicio</a>.
                                                </label>
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        {/* Buttons Footer */}
                        <div className="mt-auto pt-6 border-t border-border flex justify-between items-center bg-surface relative z-10">
                            <button
                                type="button"
                                onClick={() => processStep(currentStep - 1)}
                                disabled={currentStep === 0}
                                className={cn("px-6 py-2.5 rounded-full font-medium transition-all text-sm md:text-base",
                                    currentStep === 0
                                        ? "text-text-disabled cursor-not-allowed opacity-50"
                                        : "text-text hover:bg-background hover:shadow-sm"
                                )}
                            >
                                Atrás
                            </button>

                            {currentStep < steps.length - 1 ? (
                                <button
                                    type="button"
                                    onClick={() => processStep(currentStep + 1)}
                                    className="btn-emerald"
                                >
                                    Siguiente
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                                </button>
                            ) : (
                                <button
                                    type="submit"
                                    //add glow effect on hover
                                    className="btn-emerald hover:shadow-glow-emerald"
                                >
                                    Crear Cuenta
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                {/* Sidebar Info - Hidden on mobile, visible on LG */}
                <div className="hidden lg:flex flex-col justify-between bg-surface-2 p-8 lg:p-10 border-l border-border order-1 lg:order-2 relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />

                    <div className="relative z-10 space-y-8">
                        <div>
                            <h3 className="text-2xl font-bold text-text mb-4">
                                Tu agencia, más <br />
                                <span className="text-primary">
                                    <Typewriter phrases={['Rápida', 'Eficiente', 'Automática', 'Digital']} />
                                </span>
                            </h3>
                            <p className="text-text-secondary leading-relaxed">
                                Únete a las agencias que ya están transformando su gestión de leads con Qualify Inmo.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center gap-3 text-sm text-text-secondary">
                                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green-500/20 text-green-500">✓</span>
                                Configuración en 2 minutos
                            </div>
                            <div className="flex items-center gap-3 text-sm text-text-secondary">
                                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green-500/20 text-green-500">✓</span>
                                Sin tarjeta de crédito
                            </div>
                            <div className="flex items-center gap-3 text-sm text-text-secondary">
                                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green-500/20 text-green-500">✓</span>
                                Soporte prioritario
                            </div>
                        </div>
                    </div>

                    <div className="relative z-10 mt-auto pt-8 border-t border-border/50">
                        <div className="flex items-center gap-4">
                            <div className="flex -space-x-3">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="h-8 w-8 rounded-full border-2 border-surface bg-gray-300 flex items-center justify-center text-[10px] font-bold text-gray-600 bg-cover bg-center" style={{ backgroundImage: `url('https://i.pravatar.cc/100?img=${i + 10}')` }}></div>
                                ))}
                            </div>
                            <div className="text-xs text-text-secondary">
                                <strong className="text-text block">+500 Agencias</strong>
                                confían en nosotros
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
