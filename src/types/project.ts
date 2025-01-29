export type FileType = {
    id: string
    name: string
    type: "file" | "folder"
    children?: FileType[]
}

export type ProjectConfig = {
    language: string
    version: string
    dependencies: string[]
    ports: number[]
}

