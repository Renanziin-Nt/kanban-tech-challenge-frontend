// components/kanban/RichTextEditor.tsx
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import {
  BoldIcon,
  ItalicIcon,
  ListIcon,
  ImageIcon
} from 'lucide-react'

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

const RichTextEditor = ({ value, onChange, placeholder }: RichTextEditorProps) => {
  const editor = useEditor({
    extensions: [StarterKit, Image],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
  })

  const addImage = () => {
    const url = prompt('URL da imagem:')
    if (url) {
      editor?.chain().focus().setImage({ src: url }).run()
    }
  }

  if (!editor) {
    return null
  }

  return (
    <div className="border border-gray-300 rounded-md focus-within:ring-2 focus-within:ring-primary-500">
      <div className="flex items-center p-2 border-b border-gray-200">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 rounded hover:bg-gray-100 ${
            editor.isActive('bold') ? 'bg-gray-200' : ''
          }`}
        >
          <BoldIcon size={16} />
        </button>
        
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 rounded hover:bg-gray-100 ${
            editor.isActive('italic') ? 'bg-gray-200' : ''
          }`}
        >
          <ItalicIcon size={16} />
        </button>
        
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded hover:bg-gray-100 ${
            editor.isActive('bulletList') ? 'bg-gray-200' : ''
          }`}
        >
          <ListIcon size={16} />
        </button>
        
        <button
          onClick={addImage}
          className="p-2 rounded hover:bg-gray-100"
        >
          <ImageIcon size={16} />
        </button>
      </div>
      
      <EditorContent
        editor={editor}
        className="prose prose-sm max-w-none p-4 min-h-[120px]"
        placeholder={placeholder}
      />
    </div>
  )
}

export default RichTextEditor