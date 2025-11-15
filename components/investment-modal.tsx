'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Fighter } from '@/lib/types'
import { Loader2, Wallet, TrendingUp, Award, CheckCircle2, ExternalLink } from 'lucide-react'
import Image from 'next/image'
import { useInvestments } from '@/lib/investment-context'
import { mintInvestmentShareNFT } from '@/app/actions/invest-mock'

interface InvestmentModalProps {
  fighter: Fighter
  isOpen: boolean
  onClose: () => void
}

export function InvestmentModal({ fighter, isOpen, onClose }: InvestmentModalProps) {
  const { addInvestment } = useInvestments()
  const [amount, setAmount] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [nftDetails, setNftDetails] = useState<{
    nftId: string
    sharePercentage: number
    investmentAmount: number
    txDigest?: string
  } | null>(null)

  const minInvestment = 100
  const maxInvestment = 10000
  const numAmount = parseFloat(amount) || 0

  // Calculate acquired share from investment amount (simple calculation)
  const calculateShare = (investAmount: number) => {
    const remaining = fighter.funding.targetAmount - fighter.funding.currentAmount
    return ((investAmount / remaining) * 100).toFixed(2)
  }

  // Calculate estimated return (based on annual prize money assumption)
  const calculateEstimatedReturn = (investAmount: number) => {
    const sharePercent = parseFloat(calculateShare(investAmount))
    const annualPrizeMoney = 50000 // Estimated annual prize money (provisional)
    const isaPercent = fighter.isaContract?.percentage || 30
    const annualReturn = (annualPrizeMoney * (isaPercent / 100) * (sharePercent / 100))
    return annualReturn.toFixed(0)
  }

  const handleInvest = async () => {
    if (numAmount < minInvestment || numAmount > maxInvestment) {
      return
    }

    setIsProcessing(true)
    setError(null)

    try {
      // Issue NFT on server side (mock mode)
      // Note: Does not perform actual SUI payment, only issues NFT
      console.log('🚀 Starting investment transaction...')
      console.log('Fighter ID:', fighter.id)
      console.log('Investment amount:', numAmount, 'SUI')
      
      // Issue NFT using Server Action
      const result = await mintInvestmentShareNFT(
        fighter.id,
        numAmount
      )

      if (!result.success) {
        throw new Error(result.error || 'Failed to mint NFT')
      }

      console.log('✅ Investment successful!')
      console.log('NFT ID:', result.nftId)

      // NFT発行成功
      const sharePercentage = parseFloat(calculateShare(numAmount))
      
      setNftDetails({
        nftId: result.nftId || `0x${Math.random().toString(16).substr(2, 40)}`,
        sharePercentage,
        investmentAmount: numAmount,
        txDigest: undefined,
      })

      // Add to investment context
      addInvestment({
        id: result.nftId || `temp-${Date.now()}`,
        fighterId: fighter.id,
        fighterName: fighter.name,
        fighterNameJa: fighter.nameJa,
        fighterImage: fighter.image,
        investorAddress: 'mock', // Mock investment
        amount: numAmount,
        percentage: sharePercentage,
        investedAt: new Date().toISOString(),
        currentValue: numAmount,
        totalReturnsReceived: 0,
        status: 'active',
        fighterStatus: fighter.currentStatus,
        benefits: {
          documentaryAccess: true,
          ticketPresale: true,
          votingRight: true,
        },
      })
      
      setIsSuccess(true)
    } catch (error: any) {
      console.error('❌ Investment failed:', error)
      
      // Make error message more understandable
      let errorMessage = 'Investment processing failed.'
      if (error.message?.includes('No function')) {
        errorMessage = 'Smart contract function not found.'
      } else if (error.message?.includes('Object not found')) {
        errorMessage = 'This fighter has not been created on the blockchain yet. An administrator needs to approve the scout proposal.'
      } else if (error.message) {
        errorMessage = error.message
      }
      
      setError(errorMessage)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleClose = () => {
    setAmount('')
    setIsSuccess(false)
    setNftDetails(null)
    onClose()
  }

  const handleViewNFT = () => {
    const network = process.env.NEXT_PUBLIC_SUI_NETWORK || 'testnet'
    if (nftDetails?.txDigest) {
      window.open(`https://suiscan.xyz/${network}/tx/${nftDetails.txDigest}`, '_blank')
    } else if (nftDetails?.nftId) {
      window.open(`https://suiscan.xyz/${network}/object/${nftDetails.nftId}`, '_blank')
    }
  }

  // Investment success screen
  if (isSuccess && nftDetails) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <div className="flex flex-col items-center gap-4 py-6">
              <div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle2 className="h-12 w-12 text-green-600" />
              </div>
              <DialogTitle className="text-2xl text-center">
                Investment Complete!
              </DialogTitle>
              <DialogDescription className="text-center">
                Investment Share NFT has been minted
              </DialogDescription>
            </div>
          </DialogHeader>

          <div className="space-y-4">
            {/* NFT カード */}
            <div className="border rounded-lg p-4 bg-gradient-to-br from-primary/5 to-background">
              <div className="flex items-center gap-4 mb-4">
                <div className="relative h-16 w-16 rounded-lg overflow-hidden">
                  <Image
                    src={fighter.image}
                    alt={fighter.nameJa}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-lg">{fighter.nameJa}</p>
                  <p className="text-sm text-muted-foreground">Investment Share NFT</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-t">
                  <span className="text-sm text-muted-foreground">Investment Amount</span>
                  <span className="font-semibold">${nftDetails.investmentAmount.toLocaleString()} USDsui</span>
                </div>
                <div className="flex justify-between items-center py-2 border-t">
                  <span className="text-sm text-muted-foreground">Acquired Share</span>
                  <span className="font-semibold text-primary">{nftDetails.sharePercentage.toFixed(2)}%</span>
                </div>
                <div className="flex justify-between items-center py-2 border-t">
                  <span className="text-sm text-muted-foreground">NFT ID</span>
                  <span className="font-mono text-xs">{nftDetails.nftId.slice(0, 10)}...</span>
                </div>
              </div>
            </div>

            {/* Explanation */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Award className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
                <div className="text-sm text-blue-900">
                  <p className="font-semibold mb-1">Next Steps</p>
                  <p>A portion of prize money won by the fighter will be automatically distributed according to your NFT holding ratio.</p>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={handleClose} className="flex-1">
              Close
            </Button>
            <Button onClick={handleViewNFT} className="flex-1">
              <ExternalLink className="h-4 w-4 mr-2" />
              View NFT
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  // Investment input screen
  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="relative h-12 w-12 rounded-lg overflow-hidden">
              <Image
                src={fighter.image}
                alt={fighter.nameJa}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <p>Invest in {fighter.nameJa}</p>
              <p className="text-sm font-normal text-muted-foreground">{fighter.name}</p>
            </div>
          </DialogTitle>
          <DialogDescription>
            Enter investment amount ({minInvestment} - {maxInvestment} USDsui)
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Investment amount input */}
          <div className="space-y-2">
            <Label htmlFor="amount">Investment Amount (USDsui)</Label>
            <div className="relative">
              <Input
                id="amount"
                type="number"
                placeholder="1000"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min={minInvestment}
                max={maxInvestment}
                className="text-lg pr-20"
                disabled={isProcessing}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                USDsui
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Min: ${minInvestment} | Max: ${maxInvestment}
            </p>
          </div>

          {/* Preview information */}
          {numAmount >= minInvestment && (
            <div className="space-y-3 p-4 bg-muted rounded-lg">
              <h4 className="font-semibold text-sm">Investment Details</h4>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Acquired Share
                  </span>
                  <span className="font-semibold text-primary">
                    {calculateShare(numAmount)}%
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground flex items-center gap-2">
                    <Award className="h-4 w-4" />
                    Estimated Annual Return
                  </span>
                  <span className="font-semibold text-green-600">
                    ${calculateEstimatedReturn(numAmount)}
                  </span>
                </div>

                <div className="flex justify-between items-center pt-2 border-t">
                  <span className="text-sm text-muted-foreground">
                    ISA Contract
                  </span>
                  <span className="text-sm">
                    {fighter.isaContract?.percentage}% of prize money for {fighter.isaContract?.duration} years
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Error display */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-xs text-red-900">
                <strong>Error:</strong> {error}
              </p>
            </div>
          )}

          {/* Notice */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
            <p className="text-xs text-amber-900">
              <strong>Notice:</strong> After investment, an Investment Share NFT will be issued. This NFT is transferable and represents the right to receive future earnings from the fighter.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isProcessing}>
            Cancel
          </Button>
          <Button
            onClick={handleInvest}
            disabled={numAmount < minInvestment || numAmount > maxInvestment || isProcessing}
            className="min-w-[120px]"
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Wallet className="h-4 w-4 mr-2" />
                Invest
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
