export interface DocumentItem {
  id: string
  title: string
  description: string
  category: string
  fileName: string
  fileType: string
  fileSize: string
  uploadDate: string
  downloads: number
  url: string
}

// Lista de documentos predeterminados locales (vacía para que solo se muestren documentos reales)
export const defaultDocuments: DocumentItem[] = []
