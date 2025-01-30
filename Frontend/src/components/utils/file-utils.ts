import type { TreeNode } from "@/components/tree-view"

export async function parseFileList(fileList: FileList): Promise<TreeNode[]> {
  const structure: Record<string, TreeNode> = {}

  // Sort files to ensure folders are created before their contents
  const sortedFiles = Array.from(fileList).sort((a, b) => {
    const aDepth = a.webkitRelativePath.split("/").length
    const bDepth = b.webkitRelativePath.split("/").length
    return aDepth - bDepth
  })

  for (const file of sortedFiles) {
    const pathParts = file.webkitRelativePath.split("/")
    let currentPath = ""
    let parentId: string | null = null

    // Skip the root folder name
    for (let i = 1; i < pathParts.length; i++) {
      const part = pathParts[i]
      const isFile = i === pathParts.length - 1
      const currentId = Math.random().toString(36).substr(2, 9)

      if (currentPath === "") {
        currentPath = part
      } else {
        currentPath += "/" + part
      }

      if (!structure[currentPath]) {
        const node: TreeNode = {
          id: currentId,
          name: part,
          type: isFile ? "file" : "folder",
          children: isFile ? undefined : [],
        }

        structure[currentPath] = node

        if (parentId && structure[pathParts.slice(1, i).join("/")]) {
          const parent = structure[pathParts.slice(1, i).join("/")]
          if (parent.children) {
            parent.children.push(node)
          }
        }
      }

      parentId = structure[currentPath].id
    }
  }

  // Return only top-level nodes
  return Object.values(structure).filter((node) => {
    const pathParts = Object.entries(structure)
      .find(([, n]) => n === node)?.[0]
      ?.split("/")
    return pathParts && pathParts.length === 1
  })
}

