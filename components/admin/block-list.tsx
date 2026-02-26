"use client"

import { useState } from "react"
import { Plus } from "lucide-react"

import { BlockEditor } from "@/components/admin/block-editor"
import { BLOCK_TEMPLATES, BLOCK_TYPE_LABELS, createDefaultBlock } from "@/lib/block-defaults"
import type { PageBlock } from "@/types/content"

type BlockListProps = {
  blocks: PageBlock[]
  onChange: (blocks: PageBlock[]) => void
}

export function BlockList({ blocks, onChange }: BlockListProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)
  const [showTypePicker, setShowTypePicker] = useState(false)

  function handleChange(index: number, updated: PageBlock) {
    const next = [...blocks]
    next[index] = updated
    onChange(next)
  }

  function handleRemove(index: number) {
    const next = blocks.filter((_, i) => i !== index)
    onChange(next)
    if (expandedIndex !== null) {
      if (expandedIndex === index) setExpandedIndex(null)
      else if (expandedIndex > index) setExpandedIndex(expandedIndex - 1)
    }
  }

  function handleMoveUp(index: number) {
    if (index === 0) return
    const next = [...blocks]
    ;[next[index - 1], next[index]] = [next[index], next[index - 1]]
    onChange(next)
    if (expandedIndex === index) setExpandedIndex(index - 1)
    else if (expandedIndex !== null && expandedIndex === index - 1) setExpandedIndex(index)
  }

  function handleMoveDown(index: number) {
    if (index >= blocks.length - 1) return
    const next = [...blocks]
    ;[next[index], next[index + 1]] = [next[index + 1], next[index]]
    onChange(next)
    if (expandedIndex === index) setExpandedIndex(index + 1)
    else if (expandedIndex !== null && expandedIndex === index + 1) setExpandedIndex(index)
  }

  function handleAddBlock(template: PageBlock["_template"]) {
    const newBlock = createDefaultBlock(template)
    onChange([...blocks, newBlock])
    setExpandedIndex(blocks.length)
    setShowTypePicker(false)
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700">Blocks</label>
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowTypePicker((v) => !v)}
            className="inline-flex items-center gap-1 rounded border border-gray-300 bg-white px-3 py-2 text-sm hover:bg-gray-50"
          >
            <Plus className="size-4" />
            Add block
          </button>
          {showTypePicker && (
            <>
              <div
                className="fixed inset-0 z-10"
                aria-hidden
                onClick={() => setShowTypePicker(false)}
              />
              <ul
                className="absolute right-0 top-full z-20 mt-1 min-w-[180px] rounded border border-gray-200 bg-white py-1 shadow-lg"
                role="listbox"
              >
                {BLOCK_TEMPLATES.map((template) => (
                  <li key={template}>
                    <button
                      type="button"
                      role="option"
                      onClick={() => handleAddBlock(template)}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                    >
                      {BLOCK_TYPE_LABELS[template]}
                    </button>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>
      <div className="space-y-2">
        {blocks.length === 0 && (
          <p className="rounded border border-dashed border-gray-300 bg-gray-50 px-4 py-6 text-center text-sm text-gray-500">
            No blocks yet. Click &quot;Add block&quot; to add one.
          </p>
        )}
        {blocks.map((block, index) => (
          <BlockEditor
            key={index}
            block={block}
            index={index}
            total={blocks.length}
            expanded={expandedIndex === index}
            onToggle={() => setExpandedIndex(expandedIndex === index ? null : index)}
            onChange={(updated) => handleChange(index, updated)}
            onRemove={() => handleRemove(index)}
            onMoveUp={() => handleMoveUp(index)}
            onMoveDown={() => handleMoveDown(index)}
          />
        ))}
      </div>
    </div>
  )
}
