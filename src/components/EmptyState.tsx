interface EmptyStateProps {
  message: string
}

export const EmptyState = ({ message }: EmptyStateProps) => {
  return (
    <div className="text-center py-12">
      <p className="text-body text-ink-tertiary">{message}</p>
    </div>
  )
}
