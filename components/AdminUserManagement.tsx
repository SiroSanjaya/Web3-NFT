'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  UsersIcon, CheckCircleIcon, ExclamationTriangleIcon, XCircleIcon,
  EyeIcon, StarIcon, CurrencyDollarIcon, UserGroupIcon
} from '@heroicons/react/24/outline'

interface User {
  id: string
  address: string
  name: string
  email: string
  status: 'active' | 'suspended' | 'banned'
  role: 'user' | 'creator' | 'admin'
  joinedDate: string
  totalNFTs: number
  totalSales: number
  isVerified: boolean
  reputation: number
}

export default function AdminUserManagement() {
  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      address: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
      name: 'CryptoCreator',
      email: 'creator@nexusverse.io',
      status: 'active',
      role: 'creator',
      joinedDate: '2024-01-15',
      totalNFTs: 45,
      totalSales: 12.5,
      isVerified: true,
      reputation: 95
    },
    {
      id: '2',
      address: '0xBuyerAddressHere',
      name: 'NFTCollector',
      email: 'collector@nexusverse.io',
      status: 'active',
      role: 'user',
      joinedDate: '2024-02-20',
      totalNFTs: 23,
      totalSales: 0,
      isVerified: false,
      reputation: 78
    },
    {
      id: '3',
      address: '0xSuspendedUser',
      name: 'SuspiciousUser',
      email: 'suspicious@nexusverse.io',
      status: 'suspended',
      role: 'user',
      joinedDate: '2024-03-10',
      totalNFTs: 5,
      totalSales: 0,
      isVerified: false,
      reputation: 25
    }
  ])

  const handleUserAction = (userId: string, action: string) => {
    setUsers(prevUsers => 
      prevUsers.map(user => {
        if (user.id === userId) {
          switch (action) {
            case 'suspend':
              return { ...user, status: 'suspended' as const }
            case 'ban':
              return { ...user, status: 'banned' as const }
            case 'activate':
              return { ...user, status: 'active' as const }
            default:
              return user
          }
        }
        return user
      })
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-600 bg-green-100'
      case 'suspended':
        return 'text-yellow-600 bg-yellow-100'
      case 'banned':
        return 'text-red-600 bg-red-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircleIcon className="h-4 w-4" />
      case 'suspended':
        return <ExclamationTriangleIcon className="h-4 w-4" />
      case 'banned':
        return <XCircleIcon className="h-4 w-4" />
      default:
        return <EyeIcon className="h-4 w-4" />
    }
  }

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  return (
    <div className="card">
      <h3 className="text-lg font-semibold mb-6">User Management</h3>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="text-left py-3 px-4 font-medium">User</th>
              <th className="text-left py-3 px-4 font-medium">Role</th>
              <th className="text-left py-3 px-4 font-medium">Status</th>
              <th className="text-left py-3 px-4 font-medium">NFTs</th>
              <th className="text-left py-3 px-4 font-medium">Sales</th>
              <th className="text-left py-3 px-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b border-gray-100 dark:border-gray-800">
                <td className="py-4 px-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white font-semibold">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <p className="font-medium">{user.name}</p>
                        {user.isVerified && (
                          <StarIcon className="h-4 w-4 text-blue-500" />
                        )}
                      </div>
                      <p className="text-sm text-gray-500">{formatAddress(user.address)}</p>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <span className="capitalize">{user.role}</span>
                </td>
                <td className="py-4 px-4">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                    {getStatusIcon(user.status)}
                    <span className="ml-1 capitalize">{user.status}</span>
                  </span>
                </td>
                <td className="py-4 px-4">{user.totalNFTs}</td>
                <td className="py-4 px-4">{user.totalSales} ETH</td>
                <td className="py-4 px-4">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleUserAction(user.id, user.status === 'active' ? 'suspend' : 'activate')}
                      className={`px-3 py-1 rounded text-xs font-medium ${
                        user.status === 'active'
                          ? 'bg-red-100 text-red-700 hover:bg-red-200'
                          : 'bg-green-100 text-green-700 hover:bg-green-200'
                      }`}
                    >
                      {user.status === 'active' ? 'Suspend' : 'Activate'}
                    </button>
                    <button className="px-3 py-1 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded text-xs font-medium">
                      View
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
