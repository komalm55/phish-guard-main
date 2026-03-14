import { useState, useEffect } from "react";
import { Download, X, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";

export function InstallPrompt() {
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [showPrompt, setShowPrompt] = useState(false);
    const isMobile = useIsMobile();

    useEffect(() => {
        const handler = (e: any) => {
            e.preventDefault();
            setDeferredPrompt(e);
            setShowPrompt(true);
        };

        window.addEventListener("beforeinstallprompt", handler);

        return () => {
            window.removeEventListener("beforeinstallprompt", handler);
        };
    }, []);

    const handleInstallClick = async () => {
        if (!deferredPrompt) return;

        deferredPrompt.prompt();

        const choiceResult = await deferredPrompt.userChoice;

        if (choiceResult.outcome === "accepted") {
            console.log("User accepted the install prompt");
        } else {
            console.log("User dismissed the install prompt");
        }

        setDeferredPrompt(null);
        setShowPrompt(false);
    };

    return (
        <AnimatePresence>
            {showPrompt && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    className="fixed bottom-4 left-3 right-3 sm:left-auto sm:right-4 z-50 sm:w-auto"
                >
                    <div className="bg-primary text-primary-foreground p-3 sm:p-4 rounded-xl shadow-lg flex items-center gap-3 sm:gap-4 border border-border">
                        <div className="p-2 bg-background/20 rounded-full flex-shrink-0">
                            {isMobile ? (
                                <Smartphone className="w-5 h-5 sm:w-6 sm:h-6" />
                            ) : (
                                <Download className="w-5 h-5 sm:w-6 sm:h-6" />
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-sm">
                                {isMobile ? "Install PhishGuard App" : "Install PhishGuard"}
                            </h3>
                            <p className="text-xs opacity-90">
                                {isMobile 
                                    ? "Add to home screen for app-like experience" 
                                    : "Add to your desktop for quick access"
                                }
                            </p>
                        </div>
                        <div className="flex gap-2 flex-shrink-0">
                            <Button
                                size="sm"
                                variant="secondary"
                                onClick={handleInstallClick}
                                className="whitespace-nowrap text-xs sm:text-sm"
                            >
                                Install
                            </Button>
                            <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8 hover:bg-background/20"
                                onClick={() => setShowPrompt(false)}
                            >
                                <X className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
