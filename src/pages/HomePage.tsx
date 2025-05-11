"use client"

import { FaUsers, FaClipboardList, FaChartLine, FaCalendarAlt } from "react-icons/fa"
import Hero from "../components/Hero"
import FeatureCard from "../components/FeatureCard"
import Button from "../components/Button"
import { Link } from "react-router-dom"
import { useTheme } from "../context/ThemeContext"

const HomePage = () => {
  const { colors } = useTheme()

  const features = [
    {
      icon: <FaUsers size={40} />,
      title: "Employee Management",
      description: "Easily manage employee information, documents, and performance in one centralized system.",
    },
    {
      icon: <FaClipboardList size={40} />,
      title: "Recruitment",
      description: "Streamline your hiring process from job posting to onboarding with our intuitive tools.",
    },
    {
      icon: <FaChartLine size={40} />,
      title: "Performance Tracking",
      description: "Set goals, track progress, and provide feedback to help your employees grow.",
    },
    {
      icon: <FaCalendarAlt size={40} />,
      title: "Leave Management",
      description: "Simplify leave requests, approvals, and tracking for better workforce planning.",
    },
  ]

  return (
    <div>
      <Hero />

      {/* Features Section */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#2E4053]">Comprehensive HR Solutions</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
              NexHR provides all the tools you need to manage your workforce efficiently and effectively.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <FeatureCard key={index} icon={feature.icon} title={feature.title} description={feature.description} />
            ))}
          </div>
        </div>
      </section>

      {/* For Job Seekers Section */}
      <section style={{ backgroundColor: colors.accent }} className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-[#1C2833]">Find Your Dream Job</h2>
              <p className="mt-4 text-lg text-gray-700">
                Browse through thousands of job listings from top companies. Create your profile, showcase your skills,
                and get discovered by employers.
              </p>
              <div className="mt-8">
                <Link to="/jobs">
                  <Button variant="primary">Browse Jobs</Button>
                </Link>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold text-[#2E4053] mb-4">Featured Jobs</h3>
              {[1, 2, 3].map((job) => (
                <div key={job} className="mb-4 pb-4 border-b border-gray-200 last:border-0">
                  <h4 className="font-medium">Senior Software Engineer</h4>
                  <p className="text-sm text-gray-600">TechCorp Inc. • New York</p>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-sm font-medium text-[#2E4053]">$120K - $150K</span>
                    <span className="text-xs bg-[#F4F6F6] px-2 py-1 rounded">Full-time</span>
                  </div>
                </div>
              ))}
              <Link to="/jobs" className="text-[#2E4053] font-medium hover:underline text-sm">
                View all jobs →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* For Companies Section */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <div className="bg-[#F4F6F6] p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-semibold text-[#2E4053] mb-4">Subscription Plans</h3>
                <div className="space-y-4">
                  <div className="p-4 border border-[#BDC3C7] rounded-lg">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">Starter</h4>
                      <span className="font-bold">$49/mo</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">Perfect for small businesses with up to 10 employees.</p>
                  </div>
                  <div className="p-4 border-2 border-[#2E4053] rounded-lg bg-white">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">Professional</h4>
                      <span className="font-bold">$99/mo</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">Ideal for growing companies with up to 50 employees.</p>
                    <span className="inline-block mt-2 text-xs bg-[#2E4053] text-white px-2 py-1 rounded">
                      Most Popular
                    </span>
                  </div>
                  <div className="p-4 border border-[#BDC3C7] rounded-lg">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">Enterprise</h4>
                      <span className="font-bold">$249/mo</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">Advanced features for large organizations.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="order-1 md:order-2">
              <h2 className="text-3xl md:text-4xl font-bold text-[#2E4053]">Streamline Your HR Operations</h2>
              <p className="mt-4 text-lg text-gray-700">
                Join thousands of companies that use NexHR to manage their workforce, streamline recruitment, and
                enhance employee experience.
              </p>
              <ul className="mt-6 space-y-2">
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Centralized employee database</span>
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Automated recruitment process</span>
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Performance evaluation tools</span>
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Leave and attendance tracking</span>
                </li>
              </ul>
              <div className="mt-8">
                <Link to="/tenant/register">
                  <Button variant="primary">Register Your Company</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        className="py-16 px-6 bg-cover bg-center text-white"
        style={{
          backgroundColor: colors.primary,
          backgroundImage: "linear-gradient(rgba(46, 64, 83, 0.9), rgba(46, 64, 83, 0.9)), url(/images/cta-bg.jpg)",
        }}
      >
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold">Ready to Transform Your HR Management?</h2>
          <p className="mt-4 text-lg max-w-2xl mx-auto opacity-90">
            Join thousands of companies and job seekers who trust NexHR for their human resource needs.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup">
              <Button variant="primary" className="bg-white text-[#2E4053] hover:bg-gray-100">
                Sign Up as Job Seeker
              </Button>
            </Link>
            <Link to="/tenant/register">
              <Button variant="outline" className="border-white text-white hover:bg-white hover:text-[#2E4053]">
                Register Your Company
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage
