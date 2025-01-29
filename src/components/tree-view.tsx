import type React from "react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronRight, ChevronDown, Folder, File, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export type TreeNode = {
  id: string
  name: string
  type: "file" | "folder"
  children?: TreeNode[]
}

interface TreeViewProps {
  data: TreeNode[]
  onAdd: (parentId: string | null, type: "file" | "folder", name: string) => void
  onDelete: (id: string) => void
}

export function TreeView({ data, onAdd, onDelete }: TreeViewProps) {
  return (
    <div className="p-2">
      <div className="space-y-2">
        {data.map((node) => (
          <TreeNode key={node.id} node={node} level={0} onAdd={onAdd} onDelete={onDelete} />
        ))}
      </div>
      <AddNode parentId={null} onAdd={onAdd} level={0} />
    </div>
  )
}

interface TreeNodeProps {
  node: TreeNode
  level: number
  onAdd: (parentId: string | null, type: "file" | "folder", name: string) => void
  onDelete: (id: string) => void
}

function TreeNode({ node, level, onAdd, onDelete }: TreeNodeProps) {
  const [isExpanded, setIsExpanded] = useState(true)
  const [isHovered, setIsHovered] = useState(false)

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (node.type === "folder") {
      setIsExpanded(!isExpanded)
    }
  }

  return (
    <div>
      <motion.div
        className={cn(
          "flex items-center gap-2 p-1.5 rounded-lg transition-colors relative group",
          isHovered && "bg-cyber-accent/50",
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{ marginLeft: `${level * 20}px` }}
      >
        <button
          onClick={handleToggle}
          className={cn("w-4 h-4 flex items-center justify-center", node.type === "file" && "invisible")}
        >
          {node.type === "folder" &&
            (isExpanded ? (
              <ChevronDown className="w-4 h-4 text-neon-blue" />
            ) : (
              <ChevronRight className="w-4 h-4 text-neon-blue" />
            ))}
        </button>

        {node.type === "folder" ? (
          <Folder className="w-4 h-4 text-neon-yellow" />
        ) : (
          <File className="w-4 h-4 text-neon-blue" />
        )}

        <span className="text-gray-200 select-none">{node.name}</span>

        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="absolute right-2 flex items-center gap-2"
            >
              {node.type === "folder" && (
                <>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-6 w-6 text-neon-blue hover:text-neon-blue hover:bg-neon-blue/20"
                    onClick={(e) => {
                      e.stopPropagation()
                      setIsExpanded(true)
                    }}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </>
              )}
              <Button
                size="icon"
                variant="ghost"
                className="h-6 w-6 text-neon-pink hover:text-neon-pink hover:bg-neon-pink/20"
                onClick={(e) => {
                  e.stopPropagation()
                  onDelete(node.id)
                }}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {node.type === "folder" && node.children && isExpanded && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            {node.children.map((childNode) => (
              <TreeNode key={childNode.id} node={childNode} level={level + 1} onAdd={onAdd} onDelete={onDelete} />
            ))}
            <AddNode parentId={node.id} onAdd={onAdd} level={level + 1} />
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  )
}

interface AddNodeProps {
  parentId: string | null
  onAdd: (parentId: string | null, type: "file" | "folder", name: string) => void
  level: number
}

function AddNode({ parentId, onAdd, level }: AddNodeProps) {
  const [isAdding, setIsAdding] = useState(false)
  const [newNodeName, setNewNodeName] = useState("")
  const [nodeType, setNodeType] = useState<"file" | "folder">("file")

  const handleAdd = () => {
    if (newNodeName.trim()) {
      onAdd(parentId, nodeType, newNodeName.trim())
      setNewNodeName("")
      setIsAdding(false)
    }
  }

  if (!isAdding) {
    return (
      <motion.div className="flex gap-2 p-1.5" style={{ marginLeft: `${level * 20}px` }}>
        <Button
          variant="ghost"
          size="sm"
          className="text-neon-blue hover:text-neon-blue hover:bg-neon-blue/20"
          onClick={() => setIsAdding(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add New
        </Button>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-2 p-1.5"
      style={{ marginLeft: `${level * 20}px` }}
    >
      <Input
        value={newNodeName}
        onChange={(e) => setNewNodeName(e.target.value)}
        placeholder={`New ${nodeType} name...`}
        className="h-8 bg-cyber-dark border-cyber-light/20"
        onKeyDown={(e) => {
          if (e.key === "Enter") handleAdd()
          if (e.key === "Escape") setIsAdding(false)
        }}
        autoFocus
      />
      <Button
        size="sm"
        variant="ghost"
        className={cn(
          "h-8 px-2",
          nodeType === "file"
            ? "text-neon-blue hover:text-neon-blue hover:bg-neon-blue/20"
            : "text-neon-yellow hover:text-neon-yellow hover:bg-neon-yellow/20",
        )}
        onClick={() => setNodeType(nodeType === "file" ? "folder" : "file")}
      >
        {nodeType === "file" ? <File className="h-4 w-4" /> : <Folder className="h-4 w-4" />}
      </Button>
      <Button size="sm" className="h-8 px-3 bg-neon-blue/20 text-neon-blue hover:bg-neon-blue/30" onClick={handleAdd}>
        Add
      </Button>
      <Button
        size="sm"
        variant="ghost"
        className="h-8 px-3 text-neon-pink hover:text-neon-pink hover:bg-neon-pink/20"
        onClick={() => setIsAdding(false)}
      >
        Cancel
      </Button>
    </motion.div>
  )
}

