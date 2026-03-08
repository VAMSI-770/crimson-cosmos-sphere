import { motion, AnimatePresence } from "framer-motion";
import { X, ZoomIn, ZoomOut, Download, Maximize2 } from "lucide-react";
import { useState, useRef } from "react";

interface CertificateViewerProps {
  isOpen: boolean;
  onClose: () => void;
  file: {
    url: string;
    title: string;
    type: "pdf" | "image";
  } | null;
}

const CertificateViewer = ({ isOpen, onClose, file }: CertificateViewerProps) => {
  const [zoom, setZoom] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleZoomIn = () => setZoom((z) => Math.min(z + 0.25, 3));
  const handleZoomOut = () => setZoom((z) => Math.max(z - 0.25, 0.5));

  const handleDownload = () => {
    if (!file) return;
    const a = document.createElement("a");
    a.href = file.url;
    a.download = file.title;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleFullscreen = () => {
    if (!containerRef.current) return;
    if (!isFullscreen) {
      containerRef.current.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
    setIsFullscreen(!isFullscreen);
  };

  if (!file) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/90 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal */}
          <motion.div
            ref={containerRef}
            className="relative z-10 w-[95vw] h-[90vh] max-w-5xl flex flex-col rounded-2xl border border-border/30 bg-background/95 backdrop-blur-xl shadow-2xl overflow-hidden"
            initial={{ scale: 0.9, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 30 }}
            transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-border/30 bg-secondary/30">
              <h3 className="text-sm sm:text-base font-display font-semibold text-foreground truncate pr-4">
                {file.title}
              </h3>
              <div className="flex items-center gap-1 sm:gap-2 shrink-0">
                {file.type === "image" && (
                  <>
                    <button
                      onClick={handleZoomOut}
                      className="p-2 rounded-lg hover:bg-secondary/60 text-muted-foreground hover:text-foreground transition-colors"
                      title="Zoom Out"
                    >
                      <ZoomOut className="w-4 h-4" />
                    </button>
                    <span className="text-xs text-muted-foreground min-w-[3rem] text-center">
                      {Math.round(zoom * 100)}%
                    </span>
                    <button
                      onClick={handleZoomIn}
                      className="p-2 rounded-lg hover:bg-secondary/60 text-muted-foreground hover:text-foreground transition-colors"
                      title="Zoom In"
                    >
                      <ZoomIn className="w-4 h-4" />
                    </button>
                  </>
                )}
                <button
                  onClick={handleFullscreen}
                  className="p-2 rounded-lg hover:bg-secondary/60 text-muted-foreground hover:text-foreground transition-colors"
                  title="Fullscreen"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
                <button
                  onClick={handleDownload}
                  className="p-2 rounded-lg hover:bg-blue-primary/20 text-blue-bright hover:text-blue-bright transition-colors"
                  title="Download"
                >
                  <Download className="w-4 h-4" />
                </button>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-destructive/20 text-muted-foreground hover:text-destructive transition-colors"
                  title="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-auto flex items-center justify-center p-4 bg-black/20">
              {file.type === "image" ? (
                <motion.img
                  src={file.url}
                  alt={file.title}
                  className="max-w-full max-h-full object-contain rounded-lg select-none"
                  style={{ transform: `scale(${zoom})` }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  draggable={false}
                  loading="lazy"
                />
              ) : (
                <iframe
                  src={file.url}
                  className="w-full h-full rounded-lg border-0"
                  title={file.title}
                />
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CertificateViewer;
