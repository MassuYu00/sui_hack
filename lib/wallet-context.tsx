'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519'
import { getBalance, requestTokensFromFaucet } from './sui-client'

interface WalletContextType {
  address: string | null
  balance: number
  isConnected: boolean
  connect: () => Promise<void>
  disconnect: () => void
  requestFaucet: () => Promise<boolean>
  refreshBalance: () => Promise<void>
  keypair: Ed25519Keypair | null
}

const WalletContext = createContext<WalletContextType | undefined>(undefined)

export function WalletProvider({ children }: { children: ReactNode }) {
  const [address, setAddress] = useState<string | null>(null)
  const [balance, setBalance] = useState(0)
  const [keypair, setKeypair] = useState<Ed25519Keypair | null>(null)
  const [isConnected, setIsConnected] = useState(false)

  // ローカルストレージからウォレットを復元
  useEffect(() => {
    const savedPrivateKey = localStorage.getItem('sui_private_key')
    if (savedPrivateKey) {
      try {
        // 32バイトの秘密鍵から復元
        const privateKeyArray = Uint8Array.from(JSON.parse(savedPrivateKey))
        const kp = Ed25519Keypair.fromSecretKey(privateKeyArray)
        setKeypair(kp)
        const addr = kp.getPublicKey().toSuiAddress()
        setAddress(addr)
        setIsConnected(true)
        refreshBalanceForAddress(addr)
      } catch (error) {
        console.error('Failed to restore wallet:', error)
        localStorage.removeItem('sui_private_key')
      }
    }
  }, [])

  const refreshBalanceForAddress = async (addr: string) => {
    const bal = await getBalance(addr)
    // MISTからSUIに変換（1 SUI = 10^9 MIST）
    setBalance(Number(bal) / 1_000_000_000)
  }

  const connect = async () => {
    try {
      // 新しいキーペアを生成
      const newKeypair = new Ed25519Keypair()
      const newAddress = newKeypair.getPublicKey().toSuiAddress()

      // プライベートキーをローカルストレージに保存（本番環境では推奨されない）
      // getSecretKey()は64バイト返すが、最初の32バイトだけを保存
      const secretKey = newKeypair.getSecretKey()
      const privateKey = secretKey.slice(0, 32)
      localStorage.setItem('sui_private_key', JSON.stringify(Array.from(privateKey)))

      setKeypair(newKeypair)
      setAddress(newAddress)
      setIsConnected(true)

      // 残高を取得
      await refreshBalanceForAddress(newAddress)

      console.log('Wallet connected:', newAddress)
    } catch (error) {
      console.error('Failed to connect wallet:', error)
    }
  }

  const disconnect = () => {
    localStorage.removeItem('sui_private_key')
    setKeypair(null)
    setAddress(null)
    setBalance(0)
    setIsConnected(false)
  }

  const requestFaucet = async (): Promise<boolean> => {
    if (!address) return false
    const success = await requestTokensFromFaucet(address)
    if (success) {
      // 残高を更新（faucetは非同期なので少し待つ）
      setTimeout(() => refreshBalance(), 3000)
    }
    return success
  }

  const refreshBalance = async () => {
    if (address) {
      await refreshBalanceForAddress(address)
    }
  }

  return (
    <WalletContext.Provider
      value={{
        address,
        balance,
        isConnected,
        connect,
        disconnect,
        requestFaucet,
        refreshBalance,
        keypair,
      }}
    >
      {children}
    </WalletContext.Provider>
  )
}

export function useWallet() {
  const context = useContext(WalletContext)
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider')
  }
  return context
}
