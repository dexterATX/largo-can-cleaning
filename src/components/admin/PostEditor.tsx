'use client'

import { useState, useEffect } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  Heading1,
  Heading2,
  Heading3,
  Link as LinkIcon,
  Image as ImageIcon,
  Undo,
  Redo,
  Code,
  AlertCircle,
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils'

// URL validation to prevent XSS via javascript: or data: URLs
const validateUrl = (url: string): boolean => {
  try {
    const parsed = new URL(url)
    return ['http:', 'https:', 'mailto:', 'tel:'].includes(parsed.protocol)
  } catch {
    return false
  }
}

// ToolbarButton moved OUTSIDE component to prevent recreation on each render
interface ToolbarButtonProps {
  onClick: () => void
  active?: boolean
  children: React.ReactNode
  title: string
}

function ToolbarButton({ onClick, active, children, title }: ToolbarButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={cn(
        'p-2 rounded-lg transition-colors',
        active
          ? 'bg-[var(--safety-orange)] text-white'
          : 'text-[var(--slate-gray)] hover:text-white hover:bg-[var(--steel-gray)]/30'
      )}
    >
      {children}
    </button>
  )
}

interface PostEditorProps {
  content: string
  onChange: (content: string) => void
}

export default function PostEditor({ content, onChange }: PostEditorProps) {
  const [urlError, setUrlError] = useState<string | null>(null)

  // Auto-dismiss error after 5 seconds
  useEffect(() => {
    if (urlError) {
      const timer = setTimeout(() => setUrlError(null), 5000)
      return () => clearTimeout(timer)
    }
  }, [urlError])

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'rounded-lg max-w-full',
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-[var(--safety-orange)] underline',
        },
      }),
      Placeholder.configure({
        placeholder: 'Start writing your article...',
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: 'prose prose-invert max-w-none min-h-[400px] p-6 focus:outline-none',
      },
    },
  })

  if (!editor) {
    return (
      <div className="bg-[var(--asphalt-dark)] border border-[var(--steel-gray)]/20 rounded-xl min-h-[500px] flex items-center justify-center">
        <span className="text-[var(--slate-gray)]">Loading editor...</span>
      </div>
    )
  }

  const addLink = () => {
    const url = prompt('Enter URL:')
    if (url) {
      if (!validateUrl(url)) {
        setUrlError('Invalid URL. Please use http://, https://, mailto:, or tel: URLs only.')
        return
      }
      setUrlError(null)
      editor.chain().focus().setLink({ href: url }).run()
    }
  }

  const addImage = () => {
    const url = prompt('Enter image URL:')
    if (url) {
      if (!validateUrl(url)) {
        setUrlError('Invalid URL. Please use http:// or https:// URLs only.')
        return
      }
      setUrlError(null)
      editor.chain().focus().setImage({ src: url }).run()
    }
  }

  return (
    <div className="bg-[var(--asphalt-dark)] border border-[var(--steel-gray)]/20 rounded-xl overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center gap-1 flex-wrap p-3 border-b border-[var(--steel-gray)]/20 bg-[var(--concrete-gray)]/30">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive('bold')}
          title="Bold"
        >
          <Bold className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive('italic')}
          title="Italic"
        >
          <Italic className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCode().run()}
          active={editor.isActive('code')}
          title="Code"
        >
          <Code className="w-4 h-4" />
        </ToolbarButton>

        <div className="w-px h-6 bg-[var(--steel-gray)]/30 mx-1" />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          active={editor.isActive('heading', { level: 1 })}
          title="Heading 1"
        >
          <Heading1 className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          active={editor.isActive('heading', { level: 2 })}
          title="Heading 2"
        >
          <Heading2 className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          active={editor.isActive('heading', { level: 3 })}
          title="Heading 3"
        >
          <Heading3 className="w-4 h-4" />
        </ToolbarButton>

        <div className="w-px h-6 bg-[var(--steel-gray)]/30 mx-1" />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive('bulletList')}
          title="Bullet List"
        >
          <List className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive('orderedList')}
          title="Ordered List"
        >
          <ListOrdered className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          active={editor.isActive('blockquote')}
          title="Quote"
        >
          <Quote className="w-4 h-4" />
        </ToolbarButton>

        <div className="w-px h-6 bg-[var(--steel-gray)]/30 mx-1" />

        <ToolbarButton
          onClick={addLink}
          active={editor.isActive('link')}
          title="Add Link"
        >
          <LinkIcon className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={addImage}
          active={false}
          title="Add Image"
        >
          <ImageIcon className="w-4 h-4" />
        </ToolbarButton>

        <div className="flex-1" />

        <ToolbarButton
          onClick={() => editor.chain().focus().undo().run()}
          active={false}
          title="Undo"
        >
          <Undo className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().redo().run()}
          active={false}
          title="Redo"
        >
          <Redo className="w-4 h-4" />
        </ToolbarButton>
      </div>

      {/* URL Error Display */}
      {urlError && (
        <div className="flex items-center justify-between gap-3 px-4 py-3 bg-red-500/10 border-b border-red-500/20 text-red-400 text-sm">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{urlError}</span>
          </div>
          <button
            type="button"
            onClick={() => setUrlError(null)}
            className="p-1 rounded hover:bg-red-500/20 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Editor Content */}
      <EditorContent editor={editor} />

      {/* Styles for TipTap */}
      <style jsx global>{`
        .ProseMirror p.is-editor-empty:first-child::before {
          color: var(--steel-gray);
          content: attr(data-placeholder);
          float: left;
          height: 0;
          pointer-events: none;
        }

        .ProseMirror h1 {
          font-size: 2em;
          font-weight: 700;
          margin-top: 1em;
          margin-bottom: 0.5em;
        }

        .ProseMirror h2 {
          font-size: 1.5em;
          font-weight: 600;
          margin-top: 1em;
          margin-bottom: 0.5em;
        }

        .ProseMirror h3 {
          font-size: 1.25em;
          font-weight: 600;
          margin-top: 1em;
          margin-bottom: 0.5em;
        }

        .ProseMirror ul,
        .ProseMirror ol {
          padding-left: 1.5em;
          margin: 1em 0;
        }

        .ProseMirror li {
          margin: 0.25em 0;
        }

        .ProseMirror blockquote {
          border-left: 3px solid var(--safety-orange);
          padding-left: 1em;
          margin: 1em 0;
          color: var(--slate-gray);
          font-style: italic;
        }

        .ProseMirror code {
          background: var(--concrete-gray);
          padding: 0.2em 0.4em;
          border-radius: 4px;
          font-family: var(--font-mono);
        }

        .ProseMirror img {
          max-width: 100%;
          height: auto;
          margin: 1em 0;
        }
      `}</style>
    </div>
  )
}
