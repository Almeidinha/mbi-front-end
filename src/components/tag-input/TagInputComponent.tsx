import React, { useState } from 'react'
import { Select } from 'antd'

const { Option } = Select

interface TagsInputProps {
  onChange?: (tags: string[]) => void
  initialTags?: string[]
}

const TagsInput: React.FC<TagsInputProps> = ({ onChange, initialTags = [] }) => {
  const [tags, setTags] = useState<string[]>(initialTags)

  const handleTagsChange = (selectedTags: string[]) => {
    setTags(selectedTags)
    onChange?.(selectedTags)
  }

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === ' ') {
      e.preventDefault()
    }
  }

  return (
    <Select
      mode="tags"
      value={tags}
      showSearch={false}
      onChange={handleTagsChange}
      placeholder="Enter tags"
      maxTagTextLength={10}
      suffixIcon={null}
      dropdownStyle={{ display: 'none' }}
      onInputKeyDown={handleInputKeyDown}
    >
      {tags.map(tag => (
        <Option key={tag} value={tag}>
          {tag}
        </Option>
      ))}
    </Select>
  )
}

export default TagsInput;