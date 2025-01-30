import { motion } from "framer-motion"
import { useState } from "react"
import { TreeView, type TreeNode } from "@/components/tree-view"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertTriangle, FileCode, FileDown } from "lucide-react"
import CodeBlock from "@/components/code-block"
import axios from 'axios'

interface GeneratedFiles {
  dockerfile: string
  dockerignore: string
  analysis: {
    summary: string
    suggestions: string[]
    warnings: string[]
  }
}

export default function DockerfileGenerator() {
  const [structure, setStructure] = useState<TreeNode[]>([])
  const [language, setLanguage] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedFiles, setGeneratedFiles] = useState<GeneratedFiles | null>(null)

  const handleAddNode = (parentId: string | null, type: "file" | "folder", name: string) => {
    const newNode: TreeNode = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      type,
      children: type === "folder" ? [] : undefined,
    }

    if (!parentId) {
      setStructure([...structure, newNode])
      return
    }

    const updateChildren = (nodes: TreeNode[]): TreeNode[] => {
    return nodes.map((node) => {
      if (node.id === parentId) {
        return {
        ...node,
        children: [...(node.children || []), newNode],
        }
      }
      if (node.children) {
        return {
        ...node,
        children: updateChildren(node.children),
        }
      }
      return node
    })
    }

    setStructure(updateChildren(structure))
  }

  const handleDeleteNode = (id: string) => {
    const deleteFromChildren = (nodes: TreeNode[]): TreeNode[] => {
      return nodes
        .filter((node) => node.id !== id)
        .map((node) => {
          if (node.children) {
            return {
              ...node,
              children: deleteFromChildren(node.children),
            }
          }
          return node
        })
    }

    setStructure(deleteFromChildren(structure))
  }

  const handleGenerate = async () => {
    setIsGenerating(true)
    try {
        const response = await axios.post('https://ai-docker.onrender.com/docker-generate',{
            language,
            structure
        });

        const data = response.data.content;
        // data is just dockerfile content
        setGeneratedFiles({
            dockerfile: data,
            dockerignore: "",
            analysis: {
                summary: "Analysis completed",
                suggestions: [],
                warnings: [],
            },
        })
    } catch (error) {
      console.error("Error:", error)
      // You might want to add error state handling here
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDownload = (content: string, filename: string) => {
    const blob = new Blob([content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-cyber-black bg-cyber-grid relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 bg-glow-conic opacity-5 blur-3xl"></div>
      <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-neon-pink opacity-5 blur-[100px] animate-pulse"></div>
      <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-neon-blue opacity-5 blur-[100px] animate-pulse delay-1000"></div>

      <div className="relative p-8">
        <Card className="max-w-4xl mx-auto bg-cyber-darker/80 backdrop-blur-xl border border-cyber-light/20 shadow-neon-glow">
          <CardHeader className="border-b border-cyber-light/10">
            <CardTitle className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon-pink via-neon-blue to-neon-purple pb-2">
              Dockerfile Generator
            </CardTitle>
            <CardDescription className="text-gray-400">
              Create your project structure and generate a Dockerfile
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8 p-6">
            <div className="grid grid-cols-1 lg:grid-cols-[300px,1fr] gap-8">
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-neon-blue">Project Settings</h3>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger className="bg-cyber-dark border-cyber-light/20 text-gray-200 focus:ring-neon-blue/50">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent className="bg-cyber-darker border-cyber-light/20">
                      <SelectItem value="node" className="text-gray-200 focus:bg-cyber-light focus:text-neon-blue">
                        Node.js
                      </SelectItem>
                      <SelectItem value="python" className="text-gray-200 focus:bg-cyber-light focus:text-neon-blue">
                        Python
                      </SelectItem>
                      <SelectItem value="java" className="text-gray-200 focus:bg-cyber-light focus:text-neon-blue">
                        Java
                      </SelectItem>
                      <SelectItem value="go" className="text-gray-200 focus:bg-cyber-light focus:text-neon-blue">
                        Go
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  size="lg"
                  onClick={handleGenerate}
                  disabled={isGenerating || structure.length === 0 || !language}
                  className={`
                    w-full relative overflow-hidden bg-gradient-to-r from-neon-pink to-neon-blue
                    hover:from-neon-blue hover:to-neon-pink transition-all duration-300
                    disabled:opacity-50 disabled:cursor-not-allowed
                    text-white font-semibold
                  `}
                >
                  {isGenerating ? (
                    <>
                      <motion.div
                        className="h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                      />
                      Generating...
                    </>
                  ) : (
                    <>
                      <FileCode className="h-4 w-4 mr-2" />
                      Generate Dockerfile
                    </>
                  )}
                </Button>
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-neon-pink">Project Structure</h3>
                <Card className="text-white bg-cyber-dark/50 border-cyber-light/20 backdrop-blur-sm min-h-[400px]">
                  <CardContent>
                    <TreeView data={structure} onAdd={handleAddNode} onDelete={handleDeleteNode} />
                  </CardContent>
                </Card>
              </div>
            </div>

            {generatedFiles && (
              <div className="space-y-6">
                <Tabs defaultValue="dockerfile" className="w-full">
                  <TabsList className="bg-cyber-dark border border-cyber-light/20">
                    <TabsTrigger value="dockerfile" className="data-[state=active]:bg-cyber-light">
                      Dockerfile
                    </TabsTrigger>
                    <TabsTrigger value="dockerignore" className="data-[state=active]:bg-cyber-light">
                      .dockerignore
                    </TabsTrigger>
                    <TabsTrigger value="analysis" className="data-[state=active]:bg-cyber-light">
                      Analysis
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="dockerfile" className="mt-4">
                    <div className="flex justify-end mb-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-neon-blue hover:text-neon-blue hover:bg-neon-blue/20"
                        onClick={() => handleDownload(generatedFiles.dockerfile, "Dockerfile")}
                      >
                        <FileDown className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                    <CodeBlock code={generatedFiles.dockerfile} language="dockerfile" />
                  </TabsContent>
                  <TabsContent value="dockerignore" className="mt-4">
                    <div className="flex justify-end mb-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-neon-blue hover:text-neon-blue hover:bg-neon-blue/20"
                        onClick={() => handleDownload(generatedFiles.dockerignore, "dockerignore")}
                      >
                        <FileDown className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                    <CodeBlock code={generatedFiles.dockerignore} language="plaintext" />
                  </TabsContent>
                  <TabsContent value="analysis" className="mt-4 space-y-4">
                    <Alert>
                      <AlertTitle className="text-neon-blue">{generatedFiles.analysis.summary}</AlertTitle>
                    </Alert>

                    {generatedFiles.analysis.warnings.length > 0 && (
                      <Alert variant="destructive">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertTitle>Warnings</AlertTitle>
                        <AlertDescription>
                          <ul className="list-disc list-inside mt-2">
                            {generatedFiles.analysis.warnings.map((warning, index) => (
                              <li key={index}>{warning}</li>
                            ))}
                          </ul>
                        </AlertDescription>
                      </Alert>
                    )}

                    {generatedFiles.analysis.suggestions.length > 0 && (
                      <Alert>
                        <AlertTitle>Suggestions</AlertTitle>
                        <AlertDescription>
                          <ul className="list-disc list-inside mt-2">
                            {generatedFiles.analysis.suggestions.map((suggestion, index) => (
                              <li key={index}>{suggestion}</li>
                            ))}
                          </ul>
                        </AlertDescription>
                      </Alert>
                    )}
                  </TabsContent>
                </Tabs>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

