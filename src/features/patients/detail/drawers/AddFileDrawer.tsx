"use client"

import { useRef, useState } from "react"
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/Drawer"
import { Button } from "@/components/Button"
import { Label } from "@/components/Label"
import { Select } from "@/components/Select"
import { useAppTranslations } from "@/lib/useAppTranslations"
import { useLocale } from "@/contexts/locale-context"

interface AddFileDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpload: (files: FileList, kind: string) => void
}

export function AddFileDrawer({ open, onOpenChange, onUpload }: AddFileDrawerProps) {
  const t = useAppTranslations()
  const { isRtl } = useLocale()
  const inputRef = useRef<HTMLInputElement>(null)
  const [kind, setKind] = useState("lab")

  const handleUpload = () => {
    const files = inputRef.current?.files
    if (!files?.length) return
    onUpload(files, kind)
    onOpenChange(false)
    if (inputRef.current) inputRef.current.value = ""
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent side={isRtl ? "left" : "right"} className="w-full sm:max-w-md">
        <DrawerHeader>
          <DrawerTitle>{t.fileUpload.uploadFiles}</DrawerTitle>
        </DrawerHeader>
        <DrawerBody className="space-y-4">
          <div>
            <Label>{t.fileUpload.file}</Label>
            <input ref={inputRef} type="file" multiple className="block w-full text-sm" />
          </div>
          <div>
            <Label>{t.table.type}</Label>
            <Select value={kind} onChange={(e) => setKind(e.target.value)}>
              <option value="lab">{t.fileUpload.lab}</option>
              <option value="scan">{t.fileUpload.scan}</option>
              <option value="document">{t.fileUpload.document}</option>
            </Select>
          </div>
          <Button onClick={handleUpload}>{t.fileUpload.upload}</Button>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  )
}
