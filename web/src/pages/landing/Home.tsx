// src/pages/landing/HomePage.tsx
import { Button } from '@/components/ui/button'
import { Link } from '@tanstack/react-router'

export default function Home() {
  return (
    <section className="flex flex-col items-center justify-center text-center py-20 px-6 bg-gray-50">
      {/* Hero */}
      <h1 className="text-5xl font-bold mb-4 text-gray-900">
        Upload Your Bloodwork. Get Instant Analysis.
      </h1>
      <p className="text-xl text-gray-700 mb-8 max-w-xl">
        LabAnalysis helps you easily upload your bloodwork documents and get detailed insights, trends, and actionable results — all in one secure platform.
      </p>
      <div className="flex gap-4">
        <Link to="/register">
          <Button className="px-8 py-3 text-lg">Get Started</Button>
        </Link>
        <Link to="/login">
          <Button variant="outline" className="px-8 py-3 text-lg">Login</Button>
        </Link>
      </div>

      {/* Features */}
      <div className="mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 max-w-6xl mx-auto">
        <div className="p-6 bg-white rounded-xl shadow hover:shadow-lg transition">
          <h3 className="text-2xl font-semibold mb-2">Secure Uploads</h3>
          <p className="text-gray-600">Easily upload PDFs or images of your lab results with full privacy and security.</p>
        </div>
        <div className="p-6 bg-white rounded-xl shadow hover:shadow-lg transition">
          <h3 className="text-2xl font-semibold mb-2">Automated Analysis</h3>
          <p className="text-gray-600">Get automated, easy-to-understand insights from your bloodwork without waiting for a doctor’s explanation.</p>
        </div>
        <div className="p-6 bg-white rounded-xl shadow hover:shadow-lg transition">
          <h3 className="text-2xl font-semibold mb-2">Track Trends</h3>
          <p className="text-gray-600">Monitor changes in your health metrics over time and spot potential issues early.</p>
        </div>
      </div>

      {/* Optional Testimonials / Trust Section */}
      <div className="mt-20 max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-8">Trusted by Health Enthusiasts</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-6 bg-white rounded-xl shadow">
            <p className="text-gray-700">“LabAnalysis makes it so simple to keep track of my bloodwork. I love the automated insights!”</p>
            <p className="mt-4 font-semibold">— Jane D.</p>
          </div>
          <div className="p-6 bg-white rounded-xl shadow">
            <p className="text-gray-700">“Finally a tool that makes sense of all my lab reports. Highly recommend!”</p>
            <p className="mt-4 font-semibold">— Mark S.</p>
          </div>
          <div className="p-6 bg-white rounded-xl shadow">
            <p className="text-gray-700">“I can track trends over time and see my improvements — this app is a game-changer.”</p>
            <p className="mt-4 font-semibold">— Lisa K.</p>
          </div>
        </div>
      </div>
    </section>
  )
}
