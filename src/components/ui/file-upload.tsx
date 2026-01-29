"use client"

import { useMemo, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { UploadCloud, Image as ImageIcon } from "lucide-react"
import { cn } from "@/lib/utils"

type FileUploadProps = {
  onChange?: (files: File[]) => void
  accept?: string
  multiple?: boolean
  disabled?: boolean
  className?: string
  label?: string
  helperText?: string
}

export function FileUpload({
  onChange,
  accept = "image/*",
  multiple = false,
  disabled = false,
  className,
  label = "Upload file",
  helperText = "Drag or drop your files here or click to upload",
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isHover, setIsHover] = useState(false)
  const [files, setFiles] = useState<File[]>([])

  const prettyFiles = useMemo(() => {
    if (!files.length) return ""
    if (files.length === 1) return files[0].name
    return `${files.length} files selected`
  }, [files])

  const pickFiles = () => {
    if (disabled) return
    inputRef.current?.click()
  }

  const setAndEmit = (next: File[]) => {
    setFiles(next)
    onChange?.(next)
  }

  const onInputChange = (fileList: FileList | null) => {
    if (!fileList) return
    const next = Array.from(fileList)
    setAndEmit(multiple ? next : next.slice(0, 1))
  }

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (disabled) return
    setIsDragging(false)
    const dropped = Array.from(e.dataTransfer.files || [])
    const filtered = accept === "image/*" ? dropped.filter((f) => f.type.startsWith("image/")) : dropped
    setAndEmit(multiple ? filtered : filtered.slice(0, 1))
  }

  return (
    <div className={cn("w-full", className)}>
      {!!label && (
        <div className="flex items-center justify-between gap-3 mb-2">
          <p className="text-sm font-medium">{label}</p>
          <span className="text-xs text-muted-foreground">{prettyFiles || ""}</span>
        </div>
      )}

      <motion.div
        className={cn(
          "group relative w-full rounded-2xl border bg-card/40 backdrop-blur-sm overflow-hidden",
          "px-6 py-6 sm:px-8 sm:py-8",
          "transition-colors",
          disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer",
          isDragging ? "border-primary/60" : "border-border"
        )}
        onClick={pickFiles}
        onHoverStart={() => !disabled && setIsHover(true)}
        onHoverEnd={() => !disabled && setIsHover(false)}
        onDragEnter={(e) => {
          e.preventDefault()
          if (disabled) return
          setIsDragging(true)
        }}
        onDragOver={(e) => {
          e.preventDefault()
          if (disabled) return
          setIsDragging(true)
        }}
        onDragLeave={(e) => {
          e.preventDefault()
          if (disabled) return
          setIsDragging(false)
        }}
        onDrop={onDrop}
        animate={{
          scale: isDragging ? 1.01 : isHover ? 1.005 : 1,
          boxShadow: isDragging || isHover ? "0 0 0 1px rgba(255,255,255,0.04), 0 18px 55px rgba(0,0,0,0.45)" : "0 0 0 1px rgba(255,255,255,0.02)",
        }}
        transition={{ type: "spring", stiffness: 260, damping: 22 }}
        aria-disabled={disabled}
      >
        {/* soft glow */}
        <motion.div
          className="pointer-events-none absolute -inset-24 opacity-0"
          style={{
            background:
              "radial-gradient(600px 250px at 50% 30%, rgba(255,255,255,0.06), transparent 60%)",
          }}
          animate={{ opacity: isDragging || isHover ? 1 : 0 }}
          transition={{ duration: 0.25 }}
        />

        {/* subtle grid background */}
        <motion.div
          className={cn(
            "pointer-events-none absolute inset-0 opacity-50",
            "bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)]",
            "bg-[size:28px_28px]"
          )}
          animate={{
            backgroundPosition: isDragging || isHover ? "28px 28px" : "0px 0px",
            opacity: isDragging || isHover ? 0.7 : 0.5,
          }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        />

        {/* inner dotted highlight (shows on hover/drag) */}
        <motion.div
          className="pointer-events-none absolute inset-4 rounded-xl border border-dotted"
          animate={{
            borderColor: isDragging || isHover ? "rgba(255,255,255,0.18)" : "rgba(255,255,255,0.06)",
            opacity: isDragging || isHover ? 1 : 0,
          }}
          transition={{ duration: 0.2 }}
        />

        <div className="relative flex flex-col items-center text-center gap-3">
          {/* floating card */}
          <motion.div
            className={cn(
              "h-24 w-24 sm:h-28 sm:w-28 rounded-2xl flex items-center justify-center",
              "bg-background/30 border border-border/60 shadow-[0_20px_60px_rgba(0,0,0,0.35)]"
            )}
            animate={{
              y: isDragging ? -10 : isHover ? -6 : 0,
              rotate: isDragging ? 2 : 0,
              scale: isDragging ? 1.04 : isHover ? 1.02 : 1,
              borderColor: isDragging || isHover ? "rgba(255,255,255,0.14)" : "rgba(255,255,255,0.08)",
            }}
            transition={{ type: "spring", stiffness: 220, damping: 18 }}
          >
            <div className="h-14 w-14 rounded-2xl flex items-center justify-center bg-primary/10 border border-primary/20">
              {accept === "image/*" ? (
                <ImageIcon className="h-7 w-7 text-primary" />
              ) : (
                <UploadCloud className="h-7 w-7 text-primary" />
              )}
            </div>
          </motion.div>

          <div className="space-y-1">
            <p className="text-base font-semibold">
              {isDragging ? "Drop to upload" : helperText}
            </p>
            <p className="text-xs text-muted-foreground">
              {multiple ? "Multiple files supported" : "Single file"}
              {accept ? ` • ${accept}` : ""}
            </p>
          </div>

          <AnimatePresence>
            {isDragging && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                className="mt-2 text-xs font-medium text-primary"
              >
                Release mouse to upload
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          className="hidden"
          onChange={(e) => {
            onInputChange(e.target.files)
            // reset so selecting same file again triggers change
            e.target.value = ""
          }}
        />
      </motion.div>
    </div>
  )
}


