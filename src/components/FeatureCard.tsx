import type React from "react"
import type { IconType } from "react-icons"

interface FeatureCardProps {
  icon: React.ReactElement<IconType>
  title: string
  description: string
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md transition-transform hover:transform hover:scale-105">
      <div className="text-[#2E4053] mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-[#1C2833] mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}

export default FeatureCard
