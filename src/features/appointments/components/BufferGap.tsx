interface BufferGapProps {
  minutes: number
}

export function BufferGap({ minutes }: BufferGapProps) {
  if (minutes <= 0) return null
  
  return (
    <div className="flex items-center justify-center py-0.5">
      <div className="flex items-center gap-2 text-xs text-gray-400 ">
        <div className="h-px flex-1 bg-gray-200 " />
        <span className="font-medium uppercase tracking-wider">
          {minutes} min buffer
        </span>
        <div className="h-px flex-1 bg-gray-200 " />
      </div>
    </div>
  )
}
