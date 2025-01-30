import { Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import React from "react"

// Add proper type declaration for the webkitdirectory attribute
declare module "react" {
  interface InputHTMLAttributes<T> extends HTMLAttributes<T> {
    webkitdirectory?: string
    directory?: string
  }
}

interface UploadButtonProps {
  onUpload: (nodes: any[]) => void
  isUploading: boolean
}

export function UploadButton({ onUpload, isUploading }: UploadButtonProps) {
  const { toast } = useToast()
  const inputRef = React.useRef<HTMLInputElement>(null)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    try {
      const { parseFileList } = await import("@/components/utils/file-utils")
      const structure = await parseFileList(files)
      onUpload(structure)
    } catch (error) {
      console.error("Error parsing files:", error)
      toast({
        variant: "destructive",
        title: "Error uploading folder",
        description: "There was an error reading your folder structure. Please try again.",
      })
    }

    // Reset input
    e.target.value = ""
  }

  const handleClick = () => {
    inputRef.current?.click()
  }

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="file"
        // Set both attributes for maximum browser compatibility
        webkitdirectory=""
        directory=""
        className="hidden"
        onChange={handleUpload}
        disabled={isUploading}
      />
      <Button
        variant="outline"
        className={`
          w-full relative border-dashed border-2 
          bg-cyber-dark/50 border-cyber-light/20 
          hover:bg-cyber-light/10 hover:border-neon-blue/50
          text-gray-400 hover:text-neon-blue
        `}
        disabled={isUploading}
        onClick={handleClick}
      >
        <Upload className="w-4 h-4 mr-2" />
        {isUploading ? "Uploading..." : "Upload Folder"}
      </Button>
    </div>
  )
}

