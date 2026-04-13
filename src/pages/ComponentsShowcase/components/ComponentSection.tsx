interface ComponentSectionProps {
  title: string
  children: React.ReactNode
}

export const ComponentSection = ({ title, children }: ComponentSectionProps) => {
  return (
    <section className="mb-12">
      <h2 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
        {title}
      </h2>
      <div className="space-y-4">
        {children}
      </div>
    </section>
  )
}
