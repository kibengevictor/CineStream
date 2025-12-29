'use client'

import { useState } from 'react'
import { User, Mail, Lock, Eye, EyeOff } from 'lucide-react'

export default function StorePage() {
    const [isLogin, setIsLogin] = useState(true)
    const [showPassword, setShowPassword] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        
        if (!isLogin && formData.password !== formData.confirmPassword) {
            alert('Passwords do not match!')
            return
        }

        // Store user data in localStorage
        if (isLogin) {
            const storedUser = localStorage.getItem('user')
            if (storedUser) {
                const user = JSON.parse(storedUser)
                if (user.email === formData.email && user.password === formData.password) {
                    alert('Login successful!')
                    localStorage.setItem('isLoggedIn', 'true')
                    window.location.href = '/'
                } else {
                    alert('Invalid credentials!')
                }
            } else {
                alert('No account found. Please sign up first.')
            }
        } else {
            // Sign up
            const userData = {
                name: formData.name,
                email: formData.email,
                password: formData.password
            }
            localStorage.setItem('user', JSON.stringify(userData))
            localStorage.setItem('isLoggedIn', 'true')
            alert('Account created successfully!')
            window.location.href = '/'
        }
    }

    return (
        <div className="min-h-screen bg-[#000000] flex items-center justify-center px-4 py-12">
            <div className="max-w-md w-full">
                {/* Card */}
                <div className="bg-[#1c1c1e] rounded-2xl shadow-2xl overflow-hidden border border-white/10">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 text-center">
                        <h1 className="text-3xl font-bold text-white mb-2">
                            {isLogin ? 'Welcome Back' : 'Create Account'}
                        </h1>
                        <p className="text-purple-100">
                            {isLogin ? 'Sign in to your CineStream account' : 'Join CineStream today'}
                        </p>
                    </div>

                    {/* Form */}
                    <div className="p-8">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Name field (Sign up only) */}
                            {!isLogin && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Full Name
                                    </label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type="text"
                                            required
                                            value={formData.name}
                                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                                            className="w-full bg-[#2c2c2e] text-white rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 border border-white/10"
                                            placeholder="Enter your name"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Email field */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                                        className="w-full bg-[#2c2c2e] text-white rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 border border-white/10"
                                        placeholder="Enter your email"
                                    />
                                </div>
                            </div>

                            {/* Password field */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        required
                                        value={formData.password}
                                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                                        className="w-full bg-[#2c2c2e] text-white rounded-lg pl-10 pr-12 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 border border-white/10"
                                        placeholder="Enter your password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>

                            {/* Confirm Password (Sign up only) */}
                            {!isLogin && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Confirm Password
                                    </label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            required
                                            value={formData.confirmPassword}
                                            onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                                            className="w-full bg-[#2c2c2e] text-white rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 border border-white/10"
                                            placeholder="Confirm your password"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Submit button */}
                            <button
                                type="submit"
                                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 rounded-lg transition-all duration-200 transform hover:scale-[1.02] mt-6"
                            >
                                {isLogin ? 'Sign In' : 'Create Account'}
                            </button>
                        </form>

                        {/* Toggle between login and signup */}
                        <div className="mt-6 text-center">
                            <p className="text-gray-400">
                                {isLogin ? "Don't have an account?" : 'Already have an account?'}
                                <button
                                    onClick={() => setIsLogin(!isLogin)}
                                    className="ml-2 text-purple-500 hover:text-purple-400 font-semibold"
                                >
                                    {isLogin ? 'Sign Up' : 'Sign In'}
                                </button>
                            </p>
                        </div>

                        {/* Features list */}
                        <div className="mt-8 pt-6 border-t border-white/10">
                            <p className="text-sm text-gray-400 mb-3">With CineStream you get:</p>
                            <ul className="space-y-2 text-sm text-gray-300">
                                <li className="flex items-center">
                                    <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-2"></span>
                                    Unlimited streaming
                                </li>
                                <li className="flex items-center">
                                    <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-2"></span>
                                    Personal watchlist
                                </li>
                                <li className="flex items-center">
                                    <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-2"></span>
                                    Save favorites
                                </li>
                                <li className="flex items-center">
                                    <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-2"></span>
                                    No ads, no interruptions
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
